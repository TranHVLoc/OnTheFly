import express from 'express';
import cors from 'cors';
// Import the routers from the routes folder
import tripRoutes from './routes/trips.js';
import activityRoutes from './routes/activities.js';
import destinationRoutes from './routes/destinations.js';
import trip_destinationRoutes from './routes/trips_destinations.js'


// Initialize the express server
const app = express();

// Add the express middleware to parse JSON data from HTTP request
app.use(express.json());
// Add the cors middleware to enable CROSS ORIGIN
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">✈️ On The Fly API</h1>');
});

// We'll add /api in front of the endpoint so we can set the server proxy for the frontend to /api when we set up the client
// Specify that the /trips endpoint should use the tripRoutes router
app.use('/api/trips', tripRoutes);
// Specify that the /activities endpoint should use the activityRoutes router
app.use('/api/activities', activityRoutes);
// Specify that the /destinations endpoint should use the destinationRoutes router
app.use('/api/destinations', destinationRoutes);
// Specify that the /trips_destinations endpoint should use the trip_destinationRoutes router
app.use('/api/trips_destinations', trip_destinationRoutes);

// Start the express server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

