import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiShoppingCart, FiUser, FiHome } from "react-icons/fi";
import { StoreContext } from "./StoreContext";

import Logout from "./Logout";
import CategorySelection from "./CategorySelection";
import Logo from "../Images/Logo.png";

const Header = () => {
  const { cartNum, loggedIn } = useContext(StoreContext);

  return (
    <>
      <Container>
        <Link to="/products" className="home">
          <ShapeTechLogo src={Logo} />
        </Link>
        <CategoryContainer>
          <CategorySelection className="categorySelectionRenderRender" />
          <div class="dropdown">
            <button class="dropbtn">Categories</button>
            <div class="dropdown-content">
              <DropLink href="/category/Lifestyle">Lifestyle</DropLink>
              <DropLink href="/category/Fitness">Fitness</DropLink>
              <DropLink href="/category/Medical">Medical</DropLink>
              <DropLink href="/category/Entertainment">Entertainment</DropLink>
              <DropLink href="/category/Industrial">Industrial</DropLink>
              <DropLink href="/category/Pets and Animals">
                Pets and Animals
              </DropLink>
              <DropLink href="/category/Gaming">Gaming</DropLink>
            </div>
          </div>
        </CategoryContainer>
        <ListContainer>
          <Cart to="/cart">
            <FiShoppingCart color="black" /> {cartNum}
          </Cart>
          {!loggedIn ? (
            <LinksContainer>
              <SignInOut to="/signin">Sign in</SignInOut>
              <SignInOut to="/signup">Sign up</SignInOut>
            </LinksContainer>
          ) : (
            <UserContainer>
              <Profile>
                <Cart to="/account">
                  {" "}
                  <FiUser /> Profile
                </Cart>
                <Logout />
              </Profile>
            </UserContainer>
          )}
        </ListContainer>
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: solid 5px black;
  background-color: #7dccab;
`;

const ListContainer = styled.div`
  margin-left: auto;
  margin-right: 0;
  margin-top: 40px;
`;

const DropLink = styled.a`
  text-decoration: none;
  color: black;

  &:hover {
    cursor: pointer;
  }
`;

const CategoryContainer = styled.div``;

const ShapeTechLogo = styled.img`
  width: 130px;
  height: 130px;
`;

const Profile = styled.div`
  margin-top: 20px;
`;

const UserContainer = styled.div`
  margin-right: 20px;
  margin-bottom: 10px;
`;

const LinksContainer = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
`;

const Cart = styled(Link)`
  text-decoration: none;
  color: black;
  font-size: 25px;
  margin-left: 20px;
`;

const SignInOut = styled(Link)`
  text-decoration: none;
  color: black;
  font-size: 15px;
  font-family: "Lato", sans-serif;
  margin-right: 10px;

  &:hover {
    cursor: pointer;
  }
`;
export default Header;
