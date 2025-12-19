'use server';

import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface Hackathon {
    id: string;
    title: string;
    url: string;
    deadline: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    status: 'PLANNED' | 'IN_PROGRESS' | 'SUBMITTED' | 'WON' | 'LOST' | 'ABANDONED';
    notes?: string;
    theme?: string;
    prize_pool?: string;
    project_count: number;
    is_finalized: boolean;
    is_expired: boolean;
    created_at: string;
    updated_at: string;
}

export async function getHackathons() {
    const client = await pool.connect();
    try {
        // Auto-mark hackathons as expired if past deadline
        await client.query(`
            UPDATE hackathons 
            SET is_expired = TRUE 
            WHERE deadline < NOW() 
            AND is_expired = FALSE
        `);
        
        // Smart sorting: non-expired first (by deadline), then expired ones last
        const result = await client.query(`
            SELECT * FROM hackathons 
            ORDER BY 
                is_expired ASC,
                deadline ASC
        `);
        return result.rows as Hackathon[];
    } finally {
        client.release();
    }
}

export async function addHackathon(data: Omit<Hackathon, 'id' | 'created_at' | 'updated_at' | 'project_count' | 'is_finalized' | 'is_expired'>) {
    const client = await pool.connect();
    try {
        const isExpired = new Date(data.deadline) < new Date();
        await client.query(
            `INSERT INTO hackathons (title, url, deadline, priority, status, notes, theme, prize_pool, project_count, is_finalized, is_expired) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, false, $9)`,
            [data.title, data.url || '', data.deadline, data.priority, 'PLANNED', data.notes || null, data.theme || null, data.prize_pool || null, isExpired]
        );
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to add hackathon:', error);
        return { success: false, error };
    } finally {
        client.release();
    }
}

export async function updateHackathon(id: string, data: Partial<Hackathon>) {
    const client = await pool.connect();
    try {
        const fields: string[] = [];
        const values: any[] = [];
        let idx = 1;

        // Check if deadline is being updated to determine expiration
        if (data.deadline) {
            data.is_expired = new Date(data.deadline) < new Date();
        }

        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
                fields.push(`${key} = $${idx}`);
                values.push(value);
                idx++;
            }
        });

        if (fields.length === 0) return { success: true };

        values.push(id);
        await client.query(
            `UPDATE hackathons SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx}`,
            values
        );

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to update hackathon:', error);
        return { success: false, error };
    } finally {
        client.release();
    }
}

export async function deleteHackathon(id: string) {
    const client = await pool.connect();
    try {
        await client.query('DELETE FROM hackathons WHERE id = $1', [id]);
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete hackathon:', error);
        return { success: false, error };
    } finally {
        client.release();
    }
}

export async function incrementProjectCount(id: string, increment: number) {
    const client = await pool.connect();
    try {
        await client.query(
            'UPDATE hackathons SET project_count = GREATEST(0, project_count + $1) WHERE id = $2',
            [increment, id]
        );
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to update project count:', error);
        return { success: false, error };
    } finally {
        client.release();
    }
}

export async function toggleFinalSubmission(id: string, isFinal: boolean) {
    const client = await pool.connect();
    try {
        await client.query(
            'UPDATE hackathons SET is_finalized = $1, status = CASE WHEN $1 = true THEN \'SUBMITTED\' ELSE status END WHERE id = $2',
            [isFinal, id]
        );
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to toggle final submission:', error);
        return { success: false, error };
    } finally {
        client.release();
    }
}