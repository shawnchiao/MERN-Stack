import React, { useState } from 'react';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
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

  const placeSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs); // send this to the backend!
  };

  const switchModeHandler = () => {
    if (!isLoginMode) {
      delete formState.inputs.name;
      setFormData({...formState.inputs}, formState.inputs.email.isValid && formState.inputs.password.isValid);
    } else {
      setFormData({...formState.inputs, name: {value:'', isValid:false}}, false);
    }
    setIsLoginMode((prev)=>!prev);
  };
  console.log(isLoginMode);
  console.log(formState)
  return (
    <Card className="authentication">
      <header>
        <h2>Login Required</h2>
        <hr />
      </header>
      <form onSubmit={placeSubmitHandler}>
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

        <Button type="submit" disabled={!formState.isValid}>
          LOGIN
        </Button>
        <Button inverse type="button" onClick={switchModeHandler} >
          SWITCH TO LOGIN
        </Button>
      </form>
    </Card>
  )

};


export default Auth;