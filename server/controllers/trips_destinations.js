import { pool } from '../config/database.js';

/**
 * Insert a new trip destination
 * @param {*} req is request
 * @param {*} res is response
 */
const createTripDestination = async (req, res) => {
    // Get the trip_id and destination_id from the request body
    const { trip_id, destination_id } = req.body;
    // Add a SQL query to the database to insert a new row into trips_destinations table
    const createTripDestinationQuery = `
        INSERT INTO trips_destinations (trip_id, destination_id) VALUES ($1, $2) RETURNING *`;

    try {
        // Execute the query
        const result = await pool.query(createTripDestinationQuery, [trip_id, destination_id]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Send error message as response
        res.status(409).json({ error: error.message });
        console.error('Error creating trip destination: ', error.message);
    }
};

/**
 * Retrieve all trip destinations
 * @param {*} req is request
 * @param {*} res is response
 */
const getTripsDestinations = async (req, res) => {
    try {
        // Execute the query
        const results = await pool.query('SELECT * FROM trips_destinations ORDER BY trip_id ASC');
        res.status(200).json(results.rows);
    } catch (error) {
        // Send error message as response
        console.error('Error getting trip destinations: ', error.message);
        res.status(409).json({ error: error.message });
    }
};

/**
 * Retrieve all trips associated with a specific destination
 * @param {*} req is request
 * @param {*} res is response
 */
const getAllTrips = async (req, res) => {
    // Get the destination_id from the request parameters
    const destination_id = parseInt(req.params.destination_id);
    // Add a SQL query to the database to retrieve all trips associated with a specific destination
    const getAllTripsQuery = `
        SELECT trips.*
        FROM trips
        JOIN trips_destinations ON trips.id = trips_destinations.trip_id
        WHERE trips_destinations.destination_id = $1
        ORDER BY trips.id ASC
    `;

    try {
        // Execute the query
        const results = await pool.query(getAllTripsQuery, [destination_id]);
        res.status(200).json(results.rows);
    } catch (error) {
        // Send error message as response
        console.error('Error getting all trips: ', error.message);
        res.status(409).json({ error: error.message });
    }
};

/**
 * Retrieve all destinations associated with a specific trip
 * @param {*} req is request
 * @param {*} res is response
 */
const getAllDestinations = async (req, res) => {
    // Get the trip_id from the request parameters
    const trip_id = parseInt(req.params.trip_id);
    // Add a SQL query to the database to retrieve all destinations associated with a specific trip
    const getAllDestinationsQuery = `
        SELECT destinations.*
        FROM destinations
        JOIN trips_destinations ON destinations.id = trips_destinations.destination_id
        WHERE trips_destinations.trip_id = $1
        ORDER BY destinations.id ASC
    `;

    try {
        const results = await pool.query(getAllDestinationsQuery, [trip_id]);
        res.status(200).json(results.rows);
    } catch (error) {
        console.error('Error getting all destinations: ', error.message);
        res.status(409).json({ error: error.message });
    }
};

export default {
    createTripDestination,
    getTripsDestinations,
    getAllTrips,
    getAllDestinations
};