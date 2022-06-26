import React from 'react';

import Input from '../../shared/components/FormElements/Input.js'
import './NewPlace.css';

const newPlace = () => {
    return (
        <form className='place-form'>
            <Input element="input" type="text" label="Title" />
        </form>
    )
}

export default newPlace;