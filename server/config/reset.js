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

// Call the seedTripsTable function
seedTripsTable();