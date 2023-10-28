import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './CreateActivity.css'

const CreateActivity = () => {

    const [activity, setActivity] = useState({activity: "" })
    const {trip_id} = useParams();

    /**
     * Update the state variable when the user types in the input field
     * @param {*} event 
     */
    const handleChange = (event) => {
        const {name, value} = event.target;
        setActivity( (prev) => {
            return {
                ...prev,
                [name]:value,
            }
        })
    }
    
    /**
     * Create a new activity
     * @param {*} event 
     */
    const createActivity = async (event) => {
        // Avoid default behavior of the submit button
        if (event) {
            event.preventDefault();
        }

        // Create a new activity
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(activity)
        };

        const response = await fetch(`/api/activities/${trip_id}`, options);
        window.location.href = `/`;

    }

    return (
        <div>
            <center><h3>Add Activity</h3></center>
            <form>
                <label>Activity</label> <br />
                <input type="text" id="activity" name="activity" value={activity.activity} onChange={handleChange}/><br />
                <br/>

                <label>Trip ID</label><br />
                <input type="number" id="trip_id" name="trip_id" value={trip_id} readOnly/><br />
                <br/>

                <input type="submit" value="Submit" onClick={createActivity} />
            </form>
        </div>
    )
}

export default CreateActivity