import express from 'express';
import cors from 'cors';
import { Client } from 'pg';

const app = express();
app.use(cors());
app.use(express.json());

const connectionString = 'postgresql://neondb_owner:npg_SPJ1qgvpchE0@ep-raspy-truth-adf8h7hp-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

const getClient = () => new Client({ connectionString });

app.get('/api/hackathons', async (req, res) => {
  const client = getClient();
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM hackathons ORDER BY deadline ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    res.status(500).json({ error: 'Failed to fetch hackathons' });
  } finally {
    await client.end();
  }
});

app.post('/api/hackathons', async (req, res) => {
  const client = getClient();
  try {
    await client.connect();
    const { title, url, deadline, priority, status, notes, theme, prize_pool } = req.body;
    
    await client.query(
      `INSERT INTO hackathons (title, url, deadline, priority, status, notes, theme, prize_pool) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [title, url || '', deadline, priority, status, notes || null, theme || null, prize_pool || null]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding hackathon:', error);
    res.status(500).json({ error: 'Failed to add hackathon' });
  } finally {
    await client.end();
  }
});

app.patch('/api/hackathons/:id/status', async (req, res) => {
  const client = getClient();
  try {
    await client.connect();
    const { id } = req.params;
    const { status } = req.body;
    
    await client.query(
      'UPDATE hackathons SET status = $1, updated_at = NOW() WHERE id = $2',
      [status, id]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  } finally {
    await client.end();
  }
});

app.delete('/api/hackathons/:id', async (req, res) => {
  const client = getClient();
  try {
    await client.connect();
    const { id } = req.params;
    
    await client.query('DELETE FROM hackathons WHERE id = $1', [id]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting hackathon:', error);
    res.status(500).json({ error: 'Failed to delete hackathon' });
  } finally {
    await client.end();
  }
});

app.listen(3002, () => {
  console.log('API server running on http://localhost:3002');
});
