import React from 'react';
import Navbar from './components/Navbar';
import RideList from './components/RideList';
import AddRide from './components/AddRide';
import Register from './components/Register';
import Login from './components/Login';

const App = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Register />
        <Login />
        <AddRide />
        <RideList />
      </div>
    </div>
  );
};

export default App;
