import React from 'react'
import { useParams } from 'react-router-dom';
import './Card.css'


const AddTripOptionCard = (props) =>  {
  const {destination_id} = useParams();

  const addToTrip = async (event) => {
    event.preventDefault(); // Prevents page from refreshing

    // Creates trip destination object
    const tripDestination = {
      trip_id: props.id,
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
    fetch('/api/trips_destinations', options)
    window.location.href = `/destinations`;

}

  return (
      <div className="Card" style={{ backgroundImage:`url(${props.img_url})`}} >
        <div className="card-info">
          <h2 className="title">{props.title}</h2>
          <p className="description">{props.description}</p>
          <button className="addToTrip" onClick={addToTrip}>+ Add to Trip</button>
        </div>
      </div>
  );
};

export default AddTripOptionCard;