import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const Homepage = () => {
  return (
    <>
      <WrapperHeader>
        <Overlay classname="overlay">
          <Header>shape_tech</Header>
          <SecondHeader>Thanks for stopping by!</SecondHeader>
          <Description>
            We are shape_tech! Shaping the minds and bodies of all our
            customers!
          </Description>
          <Link to="/products">
            <button>Come on in!</button>
          </Link>
        </Overlay>
      </WrapperHeader>
      <Footer />
    </>
  );
};

const WrapperHeader = styled.header`
  height: 900px;

  text-align: center;
  width: 100%;
  height: auto;
  background-size: cover;
  background-attachment: fixed;
  position: relative;
  overflow: hidden;
  border-radius: 0 0 85% 85% / 30%;
`;

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  padding: 50px;
  color: #fff;
  text-shadow: 1px 1px 1px #333;
  background-image: linear-gradient(135deg, #9f05ff69 10%, #fd5e086b 100%);
`;

const Header = styled.h1`
  font-family: "Montserrat", sans-serif;
  font-weight: 800;
  font-size: 80px;
  margin-bottom: 30px;
`;

const SecondHeader = styled.h3`
  font-family: "Open Sans", sans-serif;
  margin-bottom: 30px;
`;

const Description = styled.p`
  font-family: "Open Sans", sans-serif;
  margin-bottom: 30px;
`;

export default Homepage;
