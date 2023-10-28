import { pool } from '../config/database.js';

/**
 * Function to create a new activity
 * @param {*} req 
 * @param {*} res 
 */
const createActivity = async (req, res) => {
    const trip_id = req.params.trip_id;
    const { activity } = req.body;
    const num_votes = 0;

    // Add a SQL query to the database to insert a new row into activities table
    const createActivityQuery = `
        INSERT INTO activities (trip_id, activity, num_votes)
        VALUES ($1, $2, $3)
        RETURNING *`;

    try {
        // Execute the query
        const result = await pool.query(createActivityQuery, [trip_id, activity, num_votes]);
        // Send the result
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
        console.error('Error creating activity: ', error.message);
    }
};

/**
 * Retrieve all activities
 * @param {*} req is request
 * @param {*} res is response
 */
const getActivities = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM activities ORDER BY id ASC');
        res.status(200).json(results.rows);
    } catch (error) {
        res.status(409).json({ error: error.message });
        console.log('Unable to get activities');
        console.log('Error:', error.message);
    }
};

/**
 * Retrieve all activities associated with a specific trip
 * @param {*} req is request
 * @param {*} res is response
 */
const getActivitiesByTrip = async (req, res) => {
    // Get the trip_id from the request parameters
    const trip_id = parseInt(req.params.trip_id);

    try {
        // Execute the query
        const results = await pool.query('SELECT * FROM activities WHERE trip_id = $1 ORDER BY id ASC', [trip_id]);
        res.status(200).json(results.rows);
    } catch (error) {
        // Send error message as response
        res.status(409).json({ error: error.message });
        console.log('Unable to get activities by trip');
        console.log('Error:', error.message);
    }
};

/**
 * Update the number of likes for a specific activity
 * @param {*} req is request
 * @param {*} res is response
 */
const updateActivityLikes = async (req, res) => {
    // Get the id from the request parameters
    const id = parseInt(req.params.id);
    // Get the num_votes from the request body
    const { num_votes } = req.body;
    try {
        // Execute the query
        const results = await pool.query(
            `UPDATE activities SET num_votes = $1 WHERE id = $2`, [num_votes, id]
        );
        res.status(200).json(results.rows[0]);
    } catch (error) {
        // Send error message as response
        res.status(409).json({ error: error.message });
        console.log('Unable to update activity likes');
        console.log('Error:', error.message);
    }
};

/**
 * Delete a single activity
 * @param {*} req is request
 * @param {*} res is response
 */
const deleteActivity = async (req, res) => {
    // Get the id from the request parameters
    const id = parseInt(req.params.id);
    try {
        // Execute the query
        const results = await pool.query(
            `DELETE FROM activities WHERE id = $1`, [id]
        );
        res.status(200).json(results.rows[0]);
    } catch (error) {
        // Send error message as response
        res.status(409).json({ error: error.message });
        console.log('Unable to delete activity');
        console.log('Error:', error.message);
    }
};

export default {
    createActivity,
    getActivities,
    getActivitiesByTrip,
    updateActivityLikes,
    deleteActivity
}