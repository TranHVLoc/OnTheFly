import Express from 'express';
import TripsDestinationsControllers from '../controllers/trips_destinations.js';

const router = Express.Router();

// A GET route handler that calls getTripsDestinations when a GET request is made to /
router.get('/', TripsDestinationsControllers.getTripsDestinations);
// A GET route handler that calls getAllTrips when a GET request is made to /trips/:destination_id
router.get('/trips/:destination_id', TripsDestinationsControllers.getAllTrips);
// A GET route handler that calls getAllDestinations when a GET request is made to /destinations/:trip_id
router.get('/destinations/:trip_id', TripsDestinationsControllers.getAllDestinations);
// A POST route handler that calls createTripDestination when a POST request is made to /
router.post('/', TripsDestinationsControllers.createTripDestination);

export default router;