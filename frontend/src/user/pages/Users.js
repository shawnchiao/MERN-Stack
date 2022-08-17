import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

const Users = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [loadedUsers, setLoadedUsers] = useState();

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/users');
                const responseData = await response.json();
                if (!response.ok) {
                    throw new Error(responseData.message);
                };
                console.log(responseData.users)
                setLoadedUsers(responseData.users);
            } catch (err) {
                setError(err);
            };
            setIsLoading(false);
        };
        getData();
    }, []);

    const errorHandler = () => {
        setError(null);
    };

    return (
        <>
            <ErrorModal error={error} onClear={errorHandler} />
            {isLoading && <LoadingSpinner asOverlay />}
            {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
        </>
    )
}

export default Users;