import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './CreateDestination.css'

const CreateDestination = () => {

    const [destination, setDestination] = useState({destination: "", description: "", city: "", country: "", img_url: "", flag_img_url: "" })
    const {trip_id} = useParams();


    const handleChange = (event) => {
        const {name, value} = event.target;
        setDestination( (prev) => {
            return {
                ...prev,
                [name]:value,
            }
        })
    }
    
    const createDestination = async (event) => {
        // Prevents page from refreshing
        if (event) {
            event.preventDefault();
        }

        /**
         * 1. Add destination to database
         */
        const addDestination = async () => {
            // Creates destination object
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(destination)
            }

            // Adds destination to database
            const response = await fetch('/api/destinations', options)
            const data = await response.json()  // get the data from the response
            setDestination(data)    // set destination to the data returned from the database
            return data.id
        }

        /**
         * 2. Add trip destination to database
         * @param {*} destination_id 
         */
        const createTripDestination = async (destination_id) => {
            // Creates trip destination object
            const tripDestination = {
                trip_id: trip_id,
                destination_id: destination_id
            }
            // Creates trip destination options
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tripDestination)
            }

            // Adds trip destination to database
            const response = await fetch('/api/trip_destinations', options)
            const data = await response.json()  // get the data from the response
            return data
        }

        // Execute the functions
        addDestination().then(res => createDestination(res)).then(res => window.location = `/destinations`)

    }

    return (
        <div>
            <center><h3>Add Destination</h3></center>
            <form>
                <label>Destination</label> <br />
                <input type="text" id="destination" name="destination" value={destination.destination} onChange={handleChange}/><br />
                <br/>

                <label>Description</label><br />
                <textarea rows="5" cols="50" id="description" name="description" value={destination.description} onChange={handleChange}>
                </textarea>
                <br/>

                <label>City </label><br />
                <input type="text" id="city" name="city" value={destination.city} onChange={handleChange}/><br />
                <br/>

                <label>Country</label><br />
                <input type="text" id="country" name="country" value={destination.country} onChange={handleChange}/><br />
                <br/>

                <label>Image URL </label><br />
                <input type="text" id="img_url" name="img_url" value={destination.img_url} onChange={handleChange}/><br />
                <br/>

                <label>Flag Image URL</label><br />
                <input type="text" id="flag_img_url" name="flag_img_url" value={destination.flag_img_url} onChange={handleChange}/><br />
                <br/>

                <label>Trip ID</label><br />
                <input type="text" id="flag_img_url" name="flag_img_url" value={trip_id} readOnly/><br />
                <br/>

                <input type="submit" value="Submit" onClick={createDestination} />
            </form>
        </div>
    )
}

export default CreateDestination