import { pool } from './database.js';
import './dotenv.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';

// Set to the URL to the curent file
const currentPath = fileURLToPath(import.meta.url);

// Set to the data.json and data_destination.json file
const tripsFile = fs.readFileSync(path.join(dirname(currentPath), '../config/data/data.json'));
const destinationsFile = fs.readFileSync(path.join(dirname(currentPath), '../config/data/data_destination.json'));

// Parse the data.json file
const tripsData = JSON.parse(tripsFile);
// Parse the data_destination.json file
const destinationsData = JSON.parse(destinationsFile);

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
        DROP TABLE IF EXISTS destinations CASCADE;

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
 * Insert destinations data into the destinations table
 */
const seedDestinationsTable = async () => {
    await createDestinationTable();

    destinationsData.forEach((destination) => {
        const insertQuery = {
            text: `INSERT INTO destinations (destination, description, city, country, img_url, flag_img_url)
                    VALUES ($1, $2, $3, $4, $5, $6)`
        }

        const values = [
            destination.destination,
            destination.description,
            destination.city,
            destination.country,
            destination.img_url,
            destination.flag_img_url
        ];

        try {
            const query = pool.query(insertQuery, values, (error, results) => {
                if (error) {
                    console.log('❌ Error seeding destination', error);
                    return;
                }
    
                console.log(`✅ ${destination.destination} added successfully!`);
            });
        } catch (error) {
            console.log('❌ Error seeding destination', error);
        }
    })
}

/**
 * @description - Reset the database
 * Create new activities table
 */
const createActivitiesTable = async () => {
    const createActivitiesTableQuery = `
        DROP TABLE IF EXISTS activities CASCADE;

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
        DROP TABLE IF EXISTS trips_destinations CASCADE;

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
        DROP TABLE IF EXISTS users CASCADE;

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
        console.log('🎉 Users table created successfully!');
    } catch (error) {
        console.log('❌ Error creating users table: ', error);
    }
}

/**
 * @description - Reset the database
 * Create new trips users table
 */
const createUsersTripsTable = async () => {
    const createTripsUsersTableQuery = `
        DROP TABLE IF EXISTS users_trips CASCADE;

        CREATE TABLE IF NOT EXISTS users_trips (
            id SERIAL PRIMARY KEY NOT NULL,
            trip_id INTEGER NOT NULL,
            username TEXT NOT NULL,
            FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE
        );
    `;

    // Create table with above schema
    try {
        const query = await pool.query(createTripsUsersTableQuery);
        console.log('🎉 users_trips table created successfully!');
    } catch (error) {
        console.log('❌ Error creating users_trips table: ', error.message);
    }
}

// Call the seedTripsTable function
await seedTripsTable();

// Call the createDestinationTable function
await seedDestinationsTable();

// Call the createActivitiesTable function
await createActivitiesTable();

// Call the createTripsDestinationsTable function
await createTripsDestinationsTable();

// Call the createUsersTable function
await createUsersTable();

// Call the createTripsUsersTable function
await createUsersTripsTable();
