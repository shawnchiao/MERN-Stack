import React, { useState, useContext } from 'react';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './Auth.css';

const Auth = () => {
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: { value: '', isValid: false },
      password: { value: '', isValid: false }
    },
    false
  );

  const [isLoginMode, setIsLoginMode] = useState(true);

  const auth = useContext(AuthContext);

  const authSubmitHandler = async event => {
    event.preventDefault();
    if (isLoginMode) {

    } else {
      try {
        const response = await fetch('http://localhost:5000/api/users/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          })
        });
        
        const responseData = await response.json();
        console.log(responseData);
      } catch (err) {
        return console.log(err);
      };
    };

    auth.login();
  };

  const switchModeHandler = () => {
    if (!isLoginMode) {
      delete formState.inputs.name;
      setFormData({ ...formState.inputs }, formState.inputs.email.isValid && formState.inputs.password.isValid);
    } else {
      setFormData({ ...formState.inputs, name: { value: '', isValid: false } }, false);
    }
    setIsLoginMode((prev) => !prev);
  };

  return (
    <Card className="authentication">
      <header>
        <h2>Login Required</h2>
        <hr />
      </header>
      <form onSubmit={authSubmitHandler}>
        {!isLoginMode && <Input
          element="input"
          id="name"
          type="text"
          label="Your Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid name."
          onInput={inputHandler}
        />}
        <Input
          element="input"
          id="email"
          type="email"
          label="E-Mail"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
        <Input
          element="input"
          id="password"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid password, at least 5 characters."
          onInput={inputHandler}
        />

        <Button type='submmit' disabled={!formState.isValid} >
          {isLoginMode ? 'LOGIN' : 'SIGNUP'}
        </Button>


        <Button inverse type="button" onClick={switchModeHandler} >
          {isLoginMode ? 'SWITCH TO SIGNUP' : 'SWITCH TO LOGIN'}
        </Button>

      </form>
    </Card>
  )

};


export default Auth;