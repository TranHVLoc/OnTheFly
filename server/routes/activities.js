import Express from 'express';
import ActivityControllers from '../controllers/activities.js';

const router = Express.Router();

// A GET route handler that calls getActivities when a GET request is made to /activities
router.get('/', ActivityControllers.getActivities);
// A GET route handler that calls getActivitiesByTrip when a GET request is made to /activities/:trip_id
router.get('/:trip_id', ActivityControllers.getActivitiesByTrip);
// A POST route handler that calls createActivity when a POST request is made to /activities/:trip_id
router.post('/:trip_id', ActivityControllers.createActivity);
// A DELETE route handler that calls deleteActivity when a DELETE request is made to /activities/:id
router.delete('/:id', ActivityControllers.deleteActivity);
// A PATCH route handler that calls updateActivityLikes when a PATCH request is made to /activities/:id
router.patch('/:id', ActivityControllers.updateActivityLikes);

export default router;