import { pool } from '../config/database.js';

/**
 * Insert a new destination
 * @param {*} req is request
 * @param {*} res is response
 */
const createDestination = async (req, res) => {
    // Get the destination details from the request body
    const { destination, description, city, country, img_url, flag_img_url } = req.body;
    // Add a SQL query to the database to insert a new row into destinations table
    const createDestinationQuery = `
        INSERT INTO destinations (destination, description, city, country, img_url, flag_img_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`;

    // Execute the query
    try {
        const result = await pool.query(createDestinationQuery, [destination, description, city, country, img_url, flag_img_url]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
        console.error('Error creating destination: ', error.message);
    }
};

/**
 * Retrieve all destinations
 * @param {*} req is request
 * @param {*} res is response
 */
const getDestinations = async (req, res) => {
    try {
        // Execute the query
        const results = await pool.query('SELECT * FROM destinations ORDER BY id ASC');
        res.status(200).json(results.rows);
    } catch (error) {
        // Send error message as response
        res.status(409).json({ error: error.message });
        console.error('Error getting destinations: ', error.message);
    }
};

/**
 * Retrieve a single destination
 * @param {*} req is request
 * @param {*} res is response
 */
const getDestination = async (req, res) => {
    // Get the id from the request parameters
    const id = parseInt(req.params.id);
    try {
        // Execute the query
        const result = await pool.query('SELECT * FROM destinations WHERE id = $1', [id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
        console.error('Error getting destination: ', error.message);
    }
};

/**
 * Update the details for a single destination
 * @param {*} req is request
 * @param {*} res is response
 */
const updateDestination = async (req, res) => {
    // Get the id from the request parameters
    const id = parseInt(req.params.id);
    // Get the destination details from the request body
    const { destination, description, city, country, img_url, flag_img_url } = req.body;
    // Add a SQL query to the database to update the destination
    const updateDestinationQuery = `
        UPDATE destinations
        SET destination = $1, description = $2, city = $3, country = $4, img_url = $5, flag_img_url = $6
        WHERE id = $7`;

    try {
        // Execute the query
        const result = await pool.query(updateDestinationQuery, [destination, description, city, country, img_url, flag_img_url, id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
        console.error('Error updating destination: ', error.message);
    }
};

/**
 * Delete a single destination
 * @param {*} req is request
 * @param {*} res is response
 */
const deleteDestination = async (req, res) => {
    // Get the id from the request parameters
    const id = parseInt(req.params.id);
    // Add a SQL query to the database to delete the destination
    const deleteDestinationQuery = `
        DELETE FROM destinations WHERE id = $1`;

    try {
        // Execute the query
        const result = await pool.query(deleteDestinationQuery, [id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        // Send error message as response
        res.status(409).json({ error: error.message });
        console.error('Error deleting destination: ', error.message);
    }
};

export default {
    createDestination,
    getDestinations,
    getDestination,
    updateDestination,
    deleteDestination
};