import './App.css';

import React, { useState, useEffect } from 'react';
import { useRoutes } from 'react-router-dom'
import { Link } from 'react-router-dom'

import ReadTrips from './pages/ReadTrips'
import CreateTrip from './pages/CreateTrip'
import EditTrip from './pages/EditTrip'
import CreateDestination from './pages/CreateDestination';
import ReadDestinations from './pages/ReadDestinations'
import TripDetails from './pages/TripDetails'
import CreateActivity from './pages/CreateActivity';
import AddToTrip from './pages/AddToTrip';
import Login from './pages/Login';
import Avatar from './components/Avatar';
import AddUserToTrip from './pages/AddUserToTrip';

const API_URL = process.env.API_URL || "http://localhost:3001";  // The URL of the API server, obtained from the .env file


const App = () => {
  
  const [trips, setTrips] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [user, setUser] = useState(null);

  // Fetches user from database
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`${API_URL}/auth/login/success`, { credentials: 'include' } );
      const json = await response.json();
      setUser(json.user);
    }

    fetchUser();

  }, []);

  // Fetches trips from database
  useEffect(() => {
    const fetchTrips = async () => {
      const response = await fetch(`${API_URL}/api/trips`);
      const data = await response.json();
      setTrips(data);
    }

    fetchTrips();

  }, []);

  // Fetches destinations from database
  useEffect(() => {
    const fetchDestinations = async () => {
      const response = await fetch(`${API_URL}/api/destinations`);
      const data = await response.json();
      setDestinations(data);
    }

    fetchDestinations();

  }, []);

  const logout = async () => {
    const url = `${API_URL}/auth/logout`;
    const response = await fetch(url, { credentials: 'include' });
    const json = await response.json();
    window.location.href = '/';
  }

  // Sets up routes
  let element = useRoutes([
    {
      path: "/",
      element: user && user.id ?
        <ReadTrips data={trips} user={user} /> : <Login api_url = {API_URL} />
    },
    {
      path: "/trip/new",
      element: user && user.id ?
        <CreateTrip api_url = {API_URL} user={user} /> : <Login api_url = {API_URL} />
    },
    {
      path: "/edit/:id",
      element: user && user.id ?
        <EditTrip data={trips} api_url = {API_URL} user={user} /> : <Login api_url = {API_URL} />
    },
    {
      path: "/destinations",
      element: user && user.id ?
        <ReadDestinations data={destinations} user={user} /> : <Login api_url = {API_URL} />
    },
    {
      path: "/trip/get/:id",
      element: user && user.id ?
        <TripDetails data={trips} api_url = {API_URL} user={user} /> : <Login api_url = {API_URL} />
    },
    {
      path: "/destination/new/:trip_id",
      element: user && user.id ?
        <CreateDestination api_url = {API_URL} user={user} /> : <Login api_url = {API_URL} />
    },
    {
      path: "/activity/create/:trip_id",
      element: user && user.id ?
        <CreateActivity api_url = {API_URL} user={user} /> : <Login api_url = {API_URL} />
    },
    {
      path: "/destinations/add/:destination_id",
      element: user && user.id ?
        <AddToTrip data={trips} api_url = {API_URL} user={user} /> : <Login api_url = {API_URL} />
    },
    {
      path: '/users/add/:trip_id',
      element: user && user.id ?
        <AddUserToTrip user={user} api_url={API_URL} /> : <Login api_url={API_URL} />
    }
  ]);

  
  return ( 

    <div className="App">
      {
        user && user.id ?
          <div className="header">
            <h1>On The Fly ✈️</h1>
            <Link to="/"><button className="headerBtn">Explore Trips</button></Link>
            <Link to="/destinations"><button className="headerBtn">Explore Destinations</button></Link>
            <Link to="/trip/new"><button className="headerBtn"> + Add Trip </button></Link>
            <button onClick={logout} className='headerBtn'>Logout</button>

            <Avatar className='avatar' user={user} />
          </div>
        : <></>
      }
        {element}
    </div>

  );
}

export default App;
