import React, { useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "./StoreContext";

const Logout = () => {
  const { setLoggedIn } = useContext(StoreContext);
  let redirect = useNavigate();
  const userLogout = async () => {
    await fetch("/signout");
    setLoggedIn(false);
    redirect("/");
    window.location.reload();
  };

  const handleLogout = () => {
    userLogout();
  };
  return (
    <Container>
      <Button
        onClick={() => {
          handleLogout();
        }}
      >
        Sign out
      </Button>
    </Container>
  );
};

const Button = styled.button`
  width: 100px;
  color: white;
  margin-left: 20px;
`;

const Container = styled.div``;

export default Logout;
