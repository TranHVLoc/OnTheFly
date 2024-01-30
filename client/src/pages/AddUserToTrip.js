import React, { useState } from "react"
import { useParams } from "react-router-dom"
import './CreateActivity.css'


const AddUserToTrip = ({ user, api_url }) => {
    // The username state variable will hold the data entered into the form
    const [username, setUsername] = useState({ username: "" });
    const { trip_id } = useParams();    // The trip_id parameter from the path "/users/add/:trip_id"

    /**
     * Function to handle the form input changes
     * @param {*} event 
     */
    const handleChange = (event) => {
        // Destructure the name and value properties from event.target
        const { name, value } = event.target;
        setUsername((prev) => {
            return {
                ...prev,
                [name]: value
            };
        })
    };

    /**
     * Function to handle the form submission
     * @param {*} event 
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(username)
        };

        // Send a POST request to the backend API endpoint
        fetch(`${api_url}/api/users_trips/create/${trip_id}`, options);
        // Redirect to the home page
        window.location.href = '/';
    };

    return (
        <div className="AddUserToTrip">
            <h1>Add User To Trip</h1>
            <label>
                Username:
                <input
                    type="text"
                    id = "username"
                    name="username"
                    value={username.username}
                    onChange={handleChange}
                />
            </label>
            <br />
            <label>
                Trip ID:
                <input
                    type="number"
                    name="trip_id"
                    value={trip_id}
                    readOnly
                />
            </label>
            <br />
            <input type="submit" value="Submit" onClick={handleSubmit} />
        </div>
    )
};

export default AddUserToTrip;