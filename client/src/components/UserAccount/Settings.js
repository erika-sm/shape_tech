import React, { useContext } from "react";
import styled from "styled-components";
import { StoreContext } from "../StoreContext";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { setLoggedIn, loggedInUser } = useContext(StoreContext);

  let redirect = useNavigate();

  const handleDelete = async () => {
    await fetch(`/delete-user/${loggedInUser._id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await fetch("/signout");
    setLoggedIn(false);
    redirect("/");
    window.location.reload();
  };
  return (
    <Wrapper>
      <button onClick={handleDelete}>Delete my account</button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;

  justify-content: center;
`;

export default Settings;
