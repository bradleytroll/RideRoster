import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_RIDES = gql`
  {
    rides {
      id
      name
      park
      dateRidden
      rating
      review
    }
  }
`;

const RideList = () => {
  const { loading, error, data } = useQuery(GET_RIDES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h3>Ride Logs</h3>
      <ul>
        {data.rides.map(({ id, name, park, dateRidden, rating, review }) => (
          <li key={id}>
            <h4>{name}</h4>
            <p>Park: {park}</p>
            <p>Date: {new Date(dateRidden).toLocaleDateString()}</p>
            <p>Rating: {rating}</p>
            <p>Review: {review}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RideList;
