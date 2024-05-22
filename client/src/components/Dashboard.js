import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import EditRideModal from './EditRideModal';
import { format } from 'date-fns';

const GET_USER_RIDES = gql`
  query GetUserRides($userId: ID!) {
    user(id: $userId) {
      rideLogs {
        id
        name
        park
        dateRidden
        rating
        review
      }
    }
  }
`;

const DELETE_RIDE = gql`
  mutation DeleteRide($id: ID!) {
    deleteRide(id: $id) {
      id
    }
  }
`;

const UPDATE_RIDE = gql`
  mutation UpdateRide($id: ID!, $name: String!, $park: String!, $dateRidden: String!, $rating: Int, $review: String) {
    updateRide(id: $id, name: $name, park: $park, dateRidden: $dateRidden, rating: $rating, review: $review) {
      id
      name
      park
      dateRidden
      rating
      review
    }
  }
`;

const Dashboard = ({ userId }) => {
  const { loading, error, data } = useQuery(GET_USER_RIDES, {
    variables: { userId },
  });
  const [deleteRide] = useMutation(DELETE_RIDE);
  const [updateRide] = useMutation(UPDATE_RIDE);
  const [editingRide, setEditingRide] = useState(null);

  const handleDelete = async (id) => {
    try {
      await deleteRide({
        variables: { id },
        refetchQueries: [{ query: GET_USER_RIDES, variables: { userId } }],
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (updatedRide) => {
    try {
      await updateRide({
        variables: updatedRide,
        refetchQueries: [{ query: GET_USER_RIDES, variables: { userId } }],
      });
      setEditingRide(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h3>Your Rides</h3>
      <ul>
        {data.user.rideLogs.map(({ id, name, park, dateRidden, rating, review }) => (
          <li key={id}>
            <h4>{name}</h4>
            <p>Park: {park}</p>
            <p>Date: {isNaN(new Date(dateRidden).getTime()) ? 'Invalid Date' : format(new Date(dateRidden), 'yyyy-MM-dd')}</p>
            <p>Rating: {rating}</p>
            <p>Review: {review}</p>
            <button onClick={() => setEditingRide({ id, name, park, dateRidden, rating, review })}>Edit</button>
            <button onClick={() => handleDelete(id)}>Delete</button>
          </li>
        ))}
      </ul>
      {editingRide && (
        <EditRideModal
          ride={editingRide}
          isOpen={!!editingRide}
          onClose={() => setEditingRide(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Dashboard;
