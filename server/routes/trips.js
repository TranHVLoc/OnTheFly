import Express from "express";
import TripControllers from "../controllers/trips.js";

const router = Express.Router();

// A GET route handler that calls getTrips when a GET request is made to /trips
router.get('/', TripControllers.getTrips);
// A GET route handler that calls getTrip when a GET request is made to /trips/:id
router.get('/:id', TripControllers.getTrip);
// A POST route handler that calls createTrip when a POST request is made to /trips
router.post('/', TripControllers.createTrip);
// A DELETE route handler that calls deleteTrip when a DELETE request is made to /trips/:id
router.delete('/:id', TripControllers.deleteTrip);
// A PATCH route handler that calls updateTrip when a PATCH request is made to /trips/:id
router.patch('/:id', TripControllers.updateTrip);

export default router;