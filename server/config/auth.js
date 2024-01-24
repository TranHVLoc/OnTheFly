import GithubStrategy from 'passport-github2';
import { pool } from './database.js';

const options = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callBackURL: 'http://localhost:3001/auth/github/callback'
}

/**
 * Verify function is responsible for determining which user in the database the credential belongs to.
 * Therefore, before calling the callback function, we want to first verify that the user is in our users table.
 * If not, we will add a row with the user's credentials.
 * @param {*} accessToken - The access token returned by the provider
 * @param {*} refreshToken - Used to obtain new access tokens and may be undefined
 *                          if the provider does not issue refresh tokens
 * @param {*} profile - Used to access user profile information provided by the service provider
 * @param {*} callback - Signal whether the authentication was successful or not
 */
const verify = async (accessToken, refreshToken, profile, callback) => {
    // Extract the user's profile information from the profile argument
    const {
        // The underscore prefix convention is often used to indicate that
        // a variable or property is intended to be private or internal to a module or class
        // It is a way to signal to other developers that they should not directly
        // access or modify that variable or property
        _json: {
            id,
            name,
            login,
            avatar_url
        }
    } = profile;

    // Store the user's profile information in an object
    const userData = {
        githubID: id,
        username: login,
        avatarURL: avatar_url,
        accessToken
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [userData.username]);
        // Get the first row from the results
        const user = result.rows[0];

        // Before this return statement,
        // we should also check if a matching user was even found.
        if (!user) {
            const result = await pool.query(
                `INSERT INTO users (githubid, username, avatarurl, accesstoken) VALUES ($1, $2, $3, $4) RETURNING *`,
                [userData.githubID, userData.username, userData.avatarURL, accessToken]
            );

            const newUser = result.rows[0];
            return callback(null, newUser);
        }

        // If user exists, return the user data
        return callback(null, user);
    } catch (error) {
        // Return error
        return callback(error);
    }
}

export const GitHub = new GithubStrategy(options, verify);
