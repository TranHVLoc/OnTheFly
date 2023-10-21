import Express from 'express';
import DestinationControllers from '../controllers/destinations.js';

const router = Express.Router();

// A GET route handler that calls getDestinations when a GET request is made to /destinations
router.get('/', DestinationControllers.getDestinations);
// A GET route handler that calls getDestination when a GET request is made to /destinations/:id
router.get('/:id', DestinationControllers.getDestination);
// A POST route handler that calls createDestination when a POST request is made to /destinations
router.post('/', DestinationControllers.createDestination);
// A DELETE route handler that calls deleteDestination when a DELETE request is made to /destinations/:id
router.delete('/:id', DestinationControllers.deleteDestination);
// A PATCH route handler that calls updateDestination when a PATCH request is made to /destinations/:id
router.patch('/:id', DestinationControllers.updateDestination);

export default router;