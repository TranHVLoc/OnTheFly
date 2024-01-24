import express from 'express';
import { createTripUser, getTripUsers, getUserTrips } from '../controllers/users_trips.js';

const router = express.Router();

// A POST route handler that creates a new trip user
router.post('/create/:trip_id', createTripUser);
// A GET route handler that gets all users for a trip
router.get('/users/:trip_id', getTripUsers);
// A GET route handler that gets all trips for a user
router.get('/trips/:username', getUserTrips);

export default router;