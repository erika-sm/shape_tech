import React, { useState, useContext } from "react";
import styled from "styled-components";
import { StoreContext } from "./StoreContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [credentials, setCredentials] = useState({});
  const [confirmPassword, setConfirmPassword] = useState();
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

    if (credentials.password !== confirmPassword) {
      setError(true);
      setErrorMsg({ ...errorMsg, confirmed: "Passwords do not match" });
    } else {
      const auth = await fetch("/signup", {
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
    }
  };

  return (
    <SignUpContainer>
      <Form onSubmit={handleSubmit}>
        <Title>Sign Up</Title>
        <label for="email">Email</label>
        <Input
          type="text"
          name="email"
          required
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
        />
        <label for="password">Password</label>
        <Input
          type="password"
          name="passwrd"
          required
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />
        <label for="confirmPassword">Confirm password</label>
        <Input
          type="password"
          name="confirmPasswrd"
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && (
          <ErrorContainer>
            <div>{errorMsg.email} </div> <div>{errorMsg.password}</div>{" "}
            <div>{errorMsg.confirmed}</div>
          </ErrorContainer>
        )}
        <Button>Sign up</Button>
      </Form>
    </SignUpContainer>
  );
};

const Error = styled.div``;

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

const Title = styled.h1`
  margin-top: 0;
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
  width: 250px;
  margin-top: 5px;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SignUpContainer = styled.div`
  border: 5px solid black;
  height: 100vh;
`;

export default Signup;
