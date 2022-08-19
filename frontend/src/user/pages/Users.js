import React, { useEffect, useState } from 'react';

import useHttpClient from '../../shared/hooks/http-hook';
import UsersList from '../components/UsersList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

const Users = () => {
    const { error, isLoading, sendRequest, clearError } = useHttpClient();
    const [loadedUsers, setloadedUsers] = useState();

    useEffect(() => {
        const retreiveData = async () => {
            try {
                const responseData = await sendRequest('http://localhost:5000/api/users');
                setloadedUsers(responseData.users);
            } catch (err) {

            };
        };
        retreiveData();
    }, [sendRequest])

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner asOverlay />}
            {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
        </>
    )
}

export default Users;