import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { format } from 'date-fns';
import { fetchUnsplashImage } from '../utils/fetchUnsplashImage';

const GET_RECENTLY_RATED_RIDES = gql`
  query GetRecentlyRatedRides {
    recentlyRatedRides {
      id
      name
      park
      dateRidden
      rating
      review
      user {
        username
      }
    }
  }
`;

const RecentlyRatedRides = () => {
  const { loading, error, data } = useQuery(GET_RECENTLY_RATED_RIDES);
  const [ridesWithImages, setRidesWithImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      if (data && data.recentlyRatedRides) {
        const ridesWithImages = await Promise.all(
          data.recentlyRatedRides.map(async (ride) => {
            const imageUrl = await fetchUnsplashImage(ride.name);
            return { ...ride, imageUrl };
          })
        );
        setRidesWithImages(ridesWithImages);
      }
    };
    fetchImages();
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h3>Recently Rated Rides</h3>
      <ul>
        {ridesWithImages.map(({ id, name, park, dateRidden, rating, review, user, imageUrl }) => (
          <li key={id}>
            <h4>{name}</h4>
            {imageUrl && <img src={imageUrl} alt={name} style={{ width: '200px', height: '150px' }} />}
            <p>Park: {park}</p>
            <p>Date: {isNaN(new Date(dateRidden).getTime()) ? 'Invalid Date' : format(new Date(dateRidden), 'yyyy-MM-dd')}</p>
            <p>Rating: {rating}</p>
            <p>Review: {review}</p>
            <p>User: {user.username}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentlyRatedRides;
