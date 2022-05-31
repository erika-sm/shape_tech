import React from "react";
import styled from "styled-components";
import { BsFacebook, BsInstagram, BsSnapchat, BsTwitter } from "react-icons/bs";

const Footer = () => {
  const styleFacebook = { color: "#4267B2" };
  const styleInstagram = { color: "#DD2A7B" };
  const styleSnapchat = { color: "#FFFC00" };
  const styleTwitter = { color: "#1DA1F2" };

  return (
    <>
      <List>
        <li>Home</li>
        <li>Services</li>
        <li>Terms</li>
        <li>About</li>
        <li>Privacy Policy</li>
      </List>
      <StyledFooter>
        <Icons>
          <BsFacebook style={styleFacebook} />
          <BsInstagram style={styleInstagram} />
          <BsSnapchat style={styleSnapchat} />
          <BsTwitter style={styleTwitter} />
        </Icons>
      </StyledFooter>
    </>
  );
};

const StyledFooter = styled.footer`
  padding: 40px 0;
  background-color: #ffffff;
  color: #4b4c4d;
  text-decoration: none;
  opacity: 0.8;
  height: 40px;
  position: fixed;
  bottom: 0%;
  width: 100%;
  background-color: #393838;
  opacity: 1;
`;
const Icons = styled.div`
  text-align: center;
  font-size: 25px;
`;
const List = styled.ul`
  display: flex;
  flex-direction: column;
  text-align: center;
  color: black;
  padding: 20px 20px;
  list-style: none;
  position: fixed;
  bottom: 0;
  right: 0;
  margin-bottom: 70px;
`;

export default Footer;
