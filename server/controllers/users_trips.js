import { pool } from "../config/database.js";

/**
 * Function to create a new trip for a user
 * @param {*} req 
 * @param {*} res 
 */
const createTripUser = async (req, res) => {
    const trip_id = parseInt(req.params.trip_id);   // Get the trip ID from the request parameters
    const { username } = req.body;  // Get the username from the request body

    const createTripUserQuery = `
        INSERT INTO users_trips (trip_id, username)
        VALUES ($1, $2)
        RETURNING *;
    `;
    const values = [trip_id, username];

    // Query the database
    try {
        const results = await pool.query(createTripUserQuery, values);
        res.status(200).json(results.rows[0]);
        console.log('🆕 Added user to trip successfully');
    } catch (error) {
        res.status(409).json({ error: error.message });
        console.log('❌ Error creating trip for user: ', error.message);
    }
};

/**
 * Function to get trips from a user
 * @param {*} req 
 * @param {*} res 
 */
const getTripUsers = async (req, res) => {
    try {
        const trip_id = parseInt(req.params.trip_id);   // Get the trip ID from the request parameters
        // Query the database
        const results = await pool.query('SELECT * FROM users_trips WHERE trip_id = $1', [trip_id]);
        res.status(200).json(results.rows);
    } catch (error) {
        res.status(409).json( { error: error.message } )
        console.log('🚫 Unable to GET all users (travelers) - Error:', error.message)
    }
};

/**
 * Function to get users from a trip
 * @param {*} req 
 * @param {*} res 
 */
const getUserTrips = async (req, res) => {
    try {
        const username = req.params.username
        const results = await pool.query(`
            SELECT t.* FROM users_trips ut, trips t
            WHERE ut.trip_id = t.id
            AND ut.username = $1`,
            [username]
        )
        // Successful query
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(409).json( { error: error.message } )
        console.log('🚫 Unable to GET users trips = Error:', error.message)
    }
}

export default {
    createTripUser,
    getTripUsers,
    getUserTrips
}