import React, { useState, useContext } from "react";
import styled from "styled-components";
import { StoreContext } from "./StoreContext";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [credentials, setCredentials] = useState({});
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState({
    email: "",
    password: "",
    confirmed: "",
  });

  let redirect = useNavigate();

  const { setLoggedIn, orderProcessing } = useContext(StoreContext);

  const handleSubmit = async (e) => {
    setError(false);
    e.preventDefault();

    const auth = await fetch("/signin", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: { "Content-Type": "application/json" },
    });

    const response = await auth.json();

    if (response.errors) {
      setError(true);
      setErrorMsg({
        ...errorMsg,
        email: response.errors.email,
        password: response.errors.password,
      });
    } else {
      setLoggedIn(true);
      if (orderProcessing) {
        redirect("/checkout");
      } else {
        redirect("/");
        window.location.reload();
      }
    }
  };

  return (
    <SignInContainer>
      <Form onSubmit={handleSubmit}>
        <Title>Sign In</Title>
        <div className="form-row">
          <label for="email" className="form-label">
            Email
          </label>
          <Input
            type="text"
            name="email"
            required
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            className="form-input"
          />
        </div>
        <div className="form-row">
          <label for="password" className="form-label">
            Password
          </label>
          <Input
            type="password"
            name="password"
            required
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            className="form-input"
          />
        </div>
        {error && (
          <ErrorContainer>
            <div>{errorMsg.email} </div> <div>{errorMsg.password}</div>{" "}
          </ErrorContainer>
        )}
        <Button className="plsWork">Sign in</Button>
      </Form>
    </SignInContainer>
  );
};

const Title = styled.h1`
  margin-top: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 30%;
  border: 5px solid black;
  width: 400px;
  height: 300px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 5px;
  background-color: #7dccab;
`;
const Input = styled.input`
  width: 250px;
  border: none;
  border-bottom: 2px solid black;
  background: transparent;
  margin-bottom: 15px;
  :focus {
    outline: none;
  }
`;

const Button = styled.button`
  margin-top: 25px;
  width: 250px;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SignInContainer = styled.div`
  border: 5px solid black;
  height: 100vh;
`;

export default Signin;
