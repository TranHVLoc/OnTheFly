import { pool } from './database.js';
import './dotenv.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import { create } from 'domain';

// Set to the URL to the curent file
const currentPath = fileURLToPath(import.meta.url);

// Set to the data.json file
const tripsFile = fs.readFileSync(path.join(dirname(currentPath), '../config/data/data.json'));

// Parse the data.json file
const tripsData = JSON.parse(tripsFile);

/**
 * @description - Reset the database
 * Create new trips table
 */
const createTripsTable = async () => {
    const createTripsTableQuery = `
        DROP TABLE IF EXISTS trips CASCADE;

        CREATE TABLE IF NOT EXISTS trips (
            id SERIAL PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            description VARCHAR(500) NOT NULL,
            img_url TEXT NOT NULL,
            num_days INTEGER NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            total_cost MONEY NOT NULL
        );
    `;

    try {
        const query = await pool.query(createTripsTableQuery);
        console.log('🎉 Trips table created successfully!');
    } catch (error) {
        console.log('❌ Error creating trips table: ', error);
    }
}

/**
 * @description - Reset the database
 * Insert trips data into the trips table
 */
const seedTripsTable = async () => {
    await createTripsTable();

    tripsData.forEach((trip) => {
        const insertQuery = {
            text: `INSERT INTO trips (title, description, img_url, num_days, start_date, end_date, total_cost)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)`
        }

        const values = [
            trip.title,
            trip.description,
            trip.img_url,
            trip.num_days,
            trip.start_date,
            trip.end_date,
            trip.total_cost
        ];

        pool.query(insertQuery, values, (error, results) => {
            if (error) {
                console.log('❌ Error seeding trip', error);
                return;
            }

            console.log(`✅ ${trip.title} added successfully!`);
        });
    })
}

/**
 * @description - Reset the database
 * Create new destinations table
 */
const createDestinationTable = async () => {
    const createDestinationTableQuery = `
        CREATE TABLE IF NOT EXISTS destinations (
            id SERIAL PRIMARY KEY,
            destination VARCHAR(100) NOT NULL,
            description VARCHAR(500) NOT NULL,
            city VARCHAR(100) NOT NULL,
            country VARCHAR(100) NOT NULL,
            img_url TEXT NOT NULL,
            flag_img_url TEXT NOT NULL
        );
    `;

    // Create table with above schema
    try {
        const query = await pool.query(createDestinationTableQuery);
        console.log('🎉 Destinations table created successfully!');
    } catch (error) {
        console.log('❌ Error creating destinations table: ', error);
    }
}

/**
 * @description - Reset the database
 * Create new activities table
 */
const createActivitiesTable = async () => {
    const createActivitiesTableQuery = `
        CREATE TABLE IF NOT EXISTS activities (
            id SERIAL PRIMARY KEY,
            trip_id INTEGER NOT NULL,
            activity VARCHAR(100) NOT NULL,
            num_votes INTEGER DEFAULT 0,
            FOREIGN KEY(trip_id) REFERENCES trips(id)
        );
    `;

    // Create table with above schema
    try {
        const query = await pool.query(createActivitiesTableQuery);
        console.log('🎉 Activities table created successfully!');
    } catch (error) {
        console.log('❌ Error creating activities table: ', error);
    }
}

/**
 * @description - Reset the database
 * Create new trips destinations table
 */
const createTripsDestinationsTable = async () => {
    const createTripsDestinationsTableQuery = `
        CREATE TABLE IF NOT EXISTS trips_destinations (
            trip_id INTEGER NOT NULL,
            destination_id INTEGER NOT NULL,
            PRIMARY KEY (trip_id, destination_id),
            FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
            FOREIGN KEY (destination_id) REFERENCES destinations(id) ON UPDATE CASCADE
        );
    `;

    // Create table with above schema
    try {
        const query = await pool.query(createTripsDestinationsTableQuery);
        console.log('🎉 trips_destinations table created successfully!');
    } catch (error) {
        console.log('❌ Error creating trips_destinations table: ', error);
    }
}

/**
 * @description - Reset the database
 * Create new users table
 */
const createUsersTable = async () => {
    const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            githubid INTEGER NOT NULL,
            username VARCHAR(100) NOT NULL,
            avatarurl VARCHAR(500) NOT NULL,
            accesstoken VARCHAR(500) NOT NULL
        );
    `;

    // Create table with above schema
    try {
        const query = await pool.query(createUsersTableQuery);
        console.log('🎉 users table created successfully!');
    } catch (error) {
        console.log('❌ Error creating users table: ', error);
    }
}

/**
 * @description - Reset the database
 * Create new trips users table
 */
const createTripsUsersTable = async () => {
    const createTripsUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS trips_users (
            trip_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            PRIMARY KEY (trip_id, user_id),
            FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
        );
    `;

    // Create table with above schema
    try {
        const query = await pool.query(createTripsUsersTableQuery);
        console.log('🎉 trips_users table created successfully!');
    } catch (error) {
        console.log('❌ Error creating trips_users table: ', error);
    }
}

// Call the seedTripsTable function
seedTripsTable();

// Call the createDestinationTable function
createDestinationTable();

// Call the createActivitiesTable function
createActivitiesTable();

// Call the createTripsDestinationsTable function
createTripsDestinationsTable();

// Call the createUsersTable function
createUsersTable();

// Call the createTripsUsersTable function
createTripsUsersTable();
