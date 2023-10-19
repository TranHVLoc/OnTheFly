import { pool } from '../config/database.js'

/**
 * Create a new trip
 */
const createTrip = async (req, res) => {
    const { title, description, img_url, num_days, start_date, end_date, total_cost } = req.body;
    
    // Add a SQL query to the database to insert a new row into trips table
    try {
        const result = await pool.query(
            `INSERT INTO trips (title, description, img_url, num_days, start_date, end_date, total_cost)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [title, description, img_url, num_days, start_date, end_date, total_cost]
        );
    
        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Send error message as response
        res.status(409).json({ error: error.message });
    }
}

export default {
    createTrip
}