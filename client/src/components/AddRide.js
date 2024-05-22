import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';  // Use named import

const ADD_RIDE = gql`
  mutation AddRide(
    $name: String!
    $park: String!
    $dateRidden: String!
    $rating: Int
    $review: String
    $userId: ID!
  ) {
    addRide(
      name: $name
      park: $park
      dateRidden: $dateRidden
      rating: $rating
      review: $review
      userId: $userId
    ) {
      id
      name
      park
      dateRidden
      rating
      review
    }
  }
`;

const AddRide = () => {
  const [name, setName] = useState('');
  const [park, setPark] = useState('');
  const [dateRidden, setDateRidden] = useState('');
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState('');
  const [error, setError] = useState('');
  const [addRide] = useMutation(ADD_RIDE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated');
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      await addRide({
        variables: {
          name,
          park,
          dateRidden,
          rating,
          review,
          userId,
        },
      });

      setName('');
      setPark('');
      setDateRidden('');
      setRating(1);
      setReview('');
      alert('Ride added successfully!');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div>
      <h3>Add a Ride</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ride Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Park Name"
          value={park}
          onChange={(e) => setPark(e.target.value)}
          required
        />
        <input
          type="date"
          value={dateRidden}
          onChange={(e) => setDateRidden(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Rating"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          min="1"
          max="5"
          required
        />
        <textarea
          placeholder="Review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <button type="submit">Add Ride</button>
      </form>
    </div>
  );
};

export default AddRide;
