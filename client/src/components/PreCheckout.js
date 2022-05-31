import React, { useContext, useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { StoreContext } from "./StoreContext";

const PreCheckout = () => {
  const { setGuest } = useContext(StoreContext);
  return (
    <Wrapper>
      <GuestInfo>
        Already have an account?{" "}
        <button>
          <StyledLink to="/signin">Sign in</StyledLink>
        </button>{" "}
      </GuestInfo>
      <GuestInfo>
        Don't have an account?{" "}
        <button>
          <StyledLink to="/signup">Register</StyledLink>
        </button>
      </GuestInfo>
      <GuestInfo>
        {" "}
        <button>
          <StyledLink onClick={() => setGuest(true)} to="/checkout">
            {" "}
            Checkout as a guest
          </StyledLink>
        </button>
      </GuestInfo>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 155px;
  border: 5px solid black;
  width: 400px;
  height: 300px;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  border-radius: 20px;
  background-color: #7dccab;
`;

const GuestInfo = styled.div`
  font-size: 20px;
  text-align: center;
  margin-top: 25px;
`;

const StyledLink = styled(NavLink)`
  text-decoration: none;
  font-weight: 700;
  color: white;
  font-style: italic;
  text-transform: uppercase;
`;

export default PreCheckout;
