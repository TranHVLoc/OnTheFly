import express from 'express';
import cors from 'cors';

// Authentication
import passport from 'passport';
import session from 'express-session';
import { GitHub } from './config/auth.js';  // GitHub authentication strategy
import authRoutes from './routes/auth.js';

// Import the routers from the routes folder
import tripRoutes from './routes/trips.js';
import activityRoutes from './routes/activities.js';
import destinationRoutes from './routes/destinations.js';
import trip_destinationRoutes from './routes/trips_destinations.js'
import userTripRoutes from './routes/users_trips.js';

// Initialize the express server
const app = express();

// Add express-session as middleware
// This will add a session object to all incoming requests
// The session object is attached to the request object as req.session
// The session object is where you can store data to persist across requests
// The session middleware will also automatically set a cookie in the browser
// that will be used to identify the session
app.use(session({
    secret: process.env.SESSION_SECRET, // Used to sign the session ID cookie
    resave: false,  // Session will only be stored in the session store if something in the session has changed
    saveUninitialized: true //  Option forces a session that is "uninitialized" to be saved to the store.
                            // A session is considered "unintialized" when it is new and not modified
}))

// Add the express middleware to parse JSON data from HTTP request
app.use(express.json());
// Add the cors middleware to enable CROSS ORIGIN
app.use(cors({
    origin: 'http://localhost:3000', // The origin URL of the receiving server (client)
    methods: 'GET,PUT,PATCH,POST,DELETE', // The allowed HTTP methods
    credentials: true // Allow cookies to be included in CORS and sent from the client to the server
}));

// Accept the request from root path
app.get('/', (req, res) => {
    // res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">✈️ On The Fly API</h1>');
    res.redirect('http://localhost:3000');
});

// Initialize the passport middleware
app.use(passport.initialize());
// Add the passport middleware to persist ("remember") the login session
app.use(passport.session());

// Configure the GitHub strategy for use by Passport
passport.use(GitHub);

// Add the serialize and deserialize functions to the passport object
// They will be called every time a user makes a request
// When a user logs in, serializeUser will determine what data from the user object should be stored in the session
// Then with each subsequent request, deserializeUser will use the data stored in the session to create a user object and assign it to req.user
passport.serializeUser((user, done) => {
    // Call done() with null and the user object to store in the session
    done(null, user);
});

passport.deserializeUser((user, done) => {
    // The user object is retrieved from the session
    // This will be used to populate req.user
    done(null, user);
});

// Specify that the /users_trips endpoint should use the userTripRoutes router
app.use('/users_trips', userTripRoutes);
// Specify that the /auth endpoint should use the authRoutes router
app.use('/auth', authRoutes);
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

