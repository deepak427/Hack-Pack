'use client';

import React, { useState } from 'react';
import { Calendar, X, Edit2, CheckCircle, Plus, Minus } from 'lucide-react';
import { Hackathon, deleteHackathon, updateHackathon, incrementProjectCount, toggleFinalSubmission } from '@/app/actions';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface HackathonCardProps {
    hackathon: Hackathon;
    onEdit: (hackathon: Hackathon) => void;
}

export function HackathonCard({ hackathon, onEdit }: HackathonCardProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const deadlineDate = new Date(hackathon.deadline);
    
    // Urgency check based on priority and expiration
    const urgent = !hackathon.is_expired && hackathon.priority === 'CRITICAL';

    const handleDelete = async () => {
        await deleteHackathon(hackathon.id);
        setShowDeleteModal(false);
    };

    const getPriorityColor = (priority: string) => {
        const colors = {
            CRITICAL: 'text-accent-red border-accent-red bg-accent-red/5',
            HIGH: 'text-orange-700 border-orange-700 bg-orange-50',
            MEDIUM: 'text-accent-yellow border-accent-yellow bg-yellow-50',
            LOW: 'text-accent-cyan border-accent-cyan bg-cyan-50',
        };
        return colors[priority as keyof typeof colors] || colors.LOW;
    };

    const getStatusStamp = (status: string) => {
        const styles = {
            WON: 'text-green-700 border-green-700 rotate-[-12deg]',
            IN_PROGRESS: 'text-accent-yellow border-accent-yellow rotate-[-5deg]',
            SUBMITTED: 'text-purple-700 border-purple-700 rotate-[-8deg]',
            LOST: 'text-red-700 border-red-700 rotate-[12deg]',
            PLANNED: 'text-ink-500 border-ink-500 rotate-[-2deg]',
            ABANDONED: 'text-ink-400 border-ink-400 rotate-[3deg] opacity-60',
        };
        return styles[status as keyof typeof styles] || styles.PLANNED;
    };

    return (
        <div className={cn(
            "group relative bg-white p-6 md:p-8 shadow-paper hover:shadow-lifted transition-all duration-500 ease-out transform hover:-translate-y-1 hover:rotate-[0.5deg]",
            hackathon.is_expired && "opacity-75 grayscale-[0.3]"
        )}>
            {/* Card Tape Effect */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-paper-100/90 shadow-sm rotate-[-1deg] opacity-80 backdrop-blur-[1px] border-l border-r border-white/50"></div>

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex-1 pr-4">
                    <h3 className="text-2xl font-serif font-bold text-ink-900 leading-tight mb-2 group-hover:text-accent-blue transition-colors">
                        {hackathon.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn("px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase border", getPriorityColor(hackathon.priority))}>
                            {hackathon.priority}
                        </span>
                        {hackathon.theme && (
                            <span className="text-xs font-serif italic text-ink-500 border-b border-paper-300">
                                {hackathon.theme}
                            </span>
                        )}
                    </div>
                </div>

                {/* Status Stamp */}
                <div className={cn(
                    "border-2 px-3 py-1 font-black uppercase text-xs tracking-widest opacity-80 mix-blend-multiply transition-transform group-hover:scale-110",
                    getStatusStamp(hackathon.status)
                )}>
                    {hackathon.status}
                </div>
            </div>

            {/* Dates & Info */}
            <div className="mb-6 space-y-3">
                <div className="flex items-center gap-3 text-sm border-b border-paper-200 pb-2">
                    <Calendar size={16} className={urgent ? "text-accent-red" : "text-ink-400"} />
                    <span className={cn("font-serif", urgent ? "text-accent-red font-bold" : "text-ink-800")}>
                        {format(new Date(hackathon.deadline), 'EEEE, MMMM do, yyyy')}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                    <span className={cn("font-mono text-xs", hackathon.is_expired ? 'text-ink-400' : 'text-ink-500')}>
                        {hackathon.is_expired ? 'Past Event' : format(deadlineDate, 'MMM dd, yyyy')}
                        {hackathon.is_expired && hackathon.status === 'SUBMITTED' && (
                            <span className="block sm:inline sm:ml-2 text-purple-600 font-bold">• Results Pending</span>
                        )}
                    </span>
                    {hackathon.prize_pool && (
                        <span className="font-bold text-ink-900 bg-accent-yellow/10 px-2 py-0.5 rounded-sm self-start">
                            💰 {hackathon.prize_pool}
                        </span>
                    )}
                </div>
            </div>

            {/* Notes */}
            {hackathon.notes && (
                <div className="mb-6 relative">
                    <div className="absolute -left-3 top-0 bottom-0 w-1 bg-accent-blue/20 rounded-full"></div>
                    <p className="font-hand text-xl text-ink-800 leading-relaxed opacity-90 pl-3 line-clamp-3">
                        "{hackathon.notes}"
                    </p>
                </div>
            )}

            {/* New Feature: Project Tracker */}
            <div className="mb-6 flex items-center justify-between bg-paper-100 p-2 rounded-sm border border-paper-200">
                <div className="text-xs font-bold uppercase text-ink-500 tracking-wider">Project Drafts</div>
                <div className="flex items-center gap-3">
                    <button onClick={() => incrementProjectCount(hackathon.id, -1)} className="hover:bg-paper-200 p-1 rounded-full"><Minus size={14} /></button>
                    <span className="font-mono text-lg font-bold text-ink-900 w-4 text-center">{hackathon.project_count || 0}</span>
                    <button onClick={() => incrementProjectCount(hackathon.id, 1)} className="hover:bg-paper-200 p-1 rounded-full"><Plus size={14} /></button>
                </div>
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-paper-200 flex items-center justify-between gap-3 opacity-90 transition-opacity">
                <div className="flex gap-2 flex-wrap">
                    {/* Edit Button */}
                    <button
                        onClick={() => onEdit(hackathon)}
                        className="text-ink-500 hover:text-ink-900 p-1.5 hover:bg-paper-100 rounded-sm transition-colors"
                        title="Edit Entry"
                    >
                        <Edit2 size={16} />
                    </button>

                    {/* Quick Status Toggles */}
                    {hackathon.status === 'PLANNED' && (
                        <button onClick={() => updateHackathon(hackathon.id, { status: 'IN_PROGRESS' })} className="text-xs font-bold uppercase text-green-700 hover:bg-green-50 px-2 py-1 rounded-sm">Start</button>
                    )}

                    {hackathon.status === 'IN_PROGRESS' && !hackathon.is_finalized && (
                        <button
                            onClick={() => toggleFinalSubmission(hackathon.id, true)}
                            className="flex items-center gap-1 text-xs font-bold uppercase text-indigo-700 hover:bg-indigo-50 px-2 py-1 rounded-sm border border-indigo-200"
                        >
                            <CheckCircle size={12} /> Submit Final
                        </button>
                    )}

                    {hackathon.is_finalized && hackathon.status !== 'WON' && hackathon.status !== 'LOST' && (
                        <>
                            <button onClick={() => updateHackathon(hackathon.id, { status: 'WON' })} className="text-xs font-bold uppercase text-green-700 hover:bg-green-50 px-2 py-1">Won</button>
                            <button onClick={() => updateHackathon(hackathon.id, { status: 'LOST' })} className="text-xs font-bold uppercase text-ink-500 hover:bg-ink-100 px-2 py-1">Lost</button>
                        </>
                    )}

                    {hackathon.url && (
                        <a href={hackathon.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase text-ink-400 hover:text-ink-900 px-2 py-1">Link ↗</a>
                    )}
                </div>

                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="text-ink-300 hover:text-accent-red transition-colors p-1.5"
                    title="Discard"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-paper-50 w-full max-w-md shadow-2xl relative transform rotate-1 border-4 border-double border-paper-300">
                        <div className="absolute inset-0 bg-paper-noise opacity-30 pointer-events-none"></div>
                        
                        <div className="relative p-8">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 mx-auto mb-4 bg-accent-red/10 rounded-full flex items-center justify-center">
                                    <X size={32} className="text-accent-red" />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-ink-900 mb-2">
                                    Tear This Page?
                                </h3>
                                <p className="text-ink-600 font-serif">
                                    This hackathon entry will be permanently removed from your journal.
                                </p>
                                <p className="text-sm text-ink-400 mt-2 font-hand text-lg">
                                    "{hackathon.title}"
                                </p>
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-3 px-4 bg-paper-200 text-ink-900 font-serif font-medium rounded-sm hover:bg-paper-300 transition-colors"
                                >
                                    Keep Entry
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 py-3 px-4 bg-accent-red text-white font-serif font-medium rounded-sm hover:bg-red-700 transition-colors"
                                >
                                    Discard Forever
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
