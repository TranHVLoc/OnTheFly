import Express from 'express';
import UsersTripsController from '../controllers/users_trips.js';

const router = Express.Router();

// A POST route handler that creates a new trip user
router.post('/create/:trip_id', UsersTripsController.createTripUser);
// A GET route handler that gets all users for a trip
router.get('/users/:trip_id', UsersTripsController.getTripUsers);
// A GET route handler that gets all trips for a user
router.get('/trips/:username', UsersTripsController.getUserTrips);

export default router;