import React, { useState, useEffect } from 'react';
import './EditRideModal.css';

const EditRideModal = ({ ride, isOpen, onClose, onSave }) => {
  const [name, setName] = useState(ride.name);
  const [park, setPark] = useState(ride.park);
  const [dateRidden, setDateRidden] = useState(ride.dateRidden);
  const [rating, setRating] = useState(ride.rating);
  const [review, setReview] = useState(ride.review);

  useEffect(() => {
    setName(ride.name);
    setPark(ride.park);
    setDateRidden(ride.dateRidden);
    setRating(ride.rating);
    setReview(ride.review);
  }, [ride]);

  const handleSave = () => {
    onSave({ ...ride, name, park, dateRidden, rating, review });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Edit Ride</h3>
        <input
          type="text"
          placeholder="Ride Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Park Name"
          value={park}
          onChange={(e) => setPark(e.target.value)}
        />
        <input
          type="date"
          value={dateRidden}
          onChange={(e) => setDateRidden(e.target.value)}
        />
        <input
          type="number"
          placeholder="Rating"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          min="1"
          max="5"
        />
        <textarea
          placeholder="Review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditRideModal;
