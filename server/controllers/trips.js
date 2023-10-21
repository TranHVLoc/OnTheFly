import { pool } from '../config/database.js'

/**
 * Create a new trip
 * @param {*} req is request
 * @param {*} res is response
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
        console.log("Unable to create trip");
        console.log('Error:', error.message);
    }
}


/**
 * Get all trips
 * @param {*} req is request
 * @param {*} res is rsponse
 */
const getTrips = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM trips ORDER BY id ASC');
        res.status(200).json(results.rows);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}


/**
 * Get a trip by id
 * @param {*} req 
 * @param {*} res 
 */
const getTrip = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const results = await pool.query('SELECT * FROM trips WHERE id = $1', [id]);
        res.status(200).json(results.rows[0]);  // return the first row
    } catch (error) {
        res.status(409).json({ error: error.message });
        console.log("Unable to get trip");
        console.log('Error:', error.message);
    }
}

/**
 * Update a trip by id
 * @param {*} req 
 * @param {*} res 
 */
const updateTrip = async (req, res) => {
    try {
        const { title, description, img_url, num_days, start_date, end_date, total_cost } = req.body
        const id = parseInt(req.params.id);

        const results = await pool.query(
            `UPDATE trips 
            SET title = $1, description = $2, img_url = $3, num_days = $4, start_date = $5, end_date = $6, total_cost = $7
            WHERE id = $8`,
            [title, description, img_url, num_days, start_date, end_date, total_cost, id]
        )

        res.status(200).json(results.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
        console.log("Unable to update trip");
        console.log('Error:', error.message);
    }
}


/**
 * Delete a trip by id
 * @param {*} req 
 * @param {*} res 
 */
const deleteTrip = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        // Delete the trip from trips table
        const results = await pool.query(
            `DELETE FROM trips WHERE id = $1`, [id]
        )
        // When deleting a trip, we also have to delete activities associated with the trip
        const activity_deletion = await pool.query(
            `DELETE FROM activities WHERE trip_id = $1`, [id]
        )

        res.status(200).json(results.rows[0]);

    } catch (error) {
        res.status(409).json({ error: error.message });
        console.log("Unable to delete trip");
        console.log('Error:', error.message);
    }
}

export default {
    createTrip,
    getTrips,
    getTrip,
    updateTrip,
    deleteTrip
}