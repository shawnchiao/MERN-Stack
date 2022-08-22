import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import useHttpClient from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const UserPlaces = () => {
  const {error, clearError, sendRequest, isLoading} = useHttpClient();
  const [places, setPlaces] = useState([]);
  const userId = useParams().userId;

  const placeDeleteHandler = (deletedPlaceId) => {
    setPlaces(prevPlaces => 
      prevPlaces.filter(place => place.id !== deletedPlaceId)
      );
  };

  useEffect(()=>{
    const getData = async () => {
      const response = await sendRequest(`http://localhost:5000/api/places/user/${userId}`);
      setPlaces(response.places);
    };
    getData();
  },[sendRequest, userId])
  return (
  <>
  <ErrorModal error={error} onClear={clearError} />
  {isLoading && <LoadingSpinner asOverlay />}
  <PlaceList items={places} onDeletePlace={placeDeleteHandler} />;
  </>
  )
};

export default UserPlaces;
