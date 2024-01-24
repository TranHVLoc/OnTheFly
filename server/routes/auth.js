import Express from "express";
import passport from "passport";

const router = Express.Router();

/**
 * Handle successful authentication
 * @route GET /auth/login/success
 */
router.get('/login/success', (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            user: req.user
        });
    }
});

/**
 * Handle failed authentication
 * @route GET /auth/login/failed
 */
router.get('/login/failed', (req, res) => {
    res.status(401).json({
        success: false,
        message: "Failure"
    });
});

/**
 * Handle logout
 * @route GET /auth/logout
 */
router.get('/logout', (req, res, next) => {
    // logout function provided by Passport to invalidate the login session
    // This should take a callback function that will be executed once the logout process is completed
    req.logout((err) => {
        // If an error occurs during the logout process, pass the error to
        // the next middleware function
        if (err) {
            return next(err);
        }
        
        // If there are no errors, call the destroy function provided by express-session on the session object
        // to remove the session data from the session store. This should also take a callback function
        // that will be executed once the session destruction is complete
        req.session.destroy((err) => {
            // Clear the connect.sid cookie, which is the default name of the session ID
            // set by express-session
            res.clearCookie('connect.sid');

            // Send a JSON response indicating that the logout operation was successful
            // and that there is now no user associated with the client
            res.json({ status: "logout", user: {} })
        });
    });
});

/**
 * Handle GitHub authentication
 * @route GET /auth/github
 */
router.get(
    '/github',
    // Route the application to GitHub's authentication page
    passport.authenticate('github', {
        scope: [ 'read:user' ] // Request the user's username and avatar from GitHub
    })
);

/**
 * Handle GitHub callback
 * @route GET /auth/github/callback
 */
router.get(
    '/github/callback',
    // After the user has authenticated with GitHub, the provider will redirect the user back to the application
    // at this URL. Passport will then call the verify function we defined in server/config/auth.js
    passport.authenticate('github', {
        successRedirect: '/',
        failureRedirect: '/destinations'
    })
);

export default router