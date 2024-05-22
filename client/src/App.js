import React from 'react';
import Navbar from './components/Navbar';
import RideList from './components/RideList';
import AddRide from './components/AddRide';

const App = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <AddRide />
        <RideList />
      </div>
    </div>
  );
};

export default App;
