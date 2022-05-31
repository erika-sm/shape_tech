import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import Details from "./Details";
import Orders from "./Orders";
import Settings from "./Settings";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../StoreContext";
import { CircularProgress } from "@mui/material";
const UserAccount = () => {
  const [tab, setTab] = useState("details");
  const [loading, setLoading] = useState(false);

  let redirect = useNavigate();

  const { loggedIn } = useContext(StoreContext);

  useEffect(() => {
    setLoading(true);
    if (!loggedIn) {
      redirect("/signin");
    }
    setLoading(false);
  }, []);

  return (
    <Wrapper className="account">
      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          {" "}
          <SideBar className="sidebar">
            <TabSelect
              value="details"
              aria-selected
              onClick={(e) => {
                setTab(e.target.value);
              }}
            >
              My Details
            </TabSelect>
            <TabSelect
              value="orders"
              onClick={(e) => {
                setTab(e.target.value);
              }}
            >
              My Orders
            </TabSelect>
            <TabSelect
              value="settings"
              onClick={(e) => {
                setTab(e.target.value);
              }}
            >
              Account Settings
            </TabSelect>
          </SideBar>
          {tab === "details" ? (
            <Tab className="tab">
              <h3>My Details</h3>
              <Details />
            </Tab>
          ) : tab === "orders" ? (
            <Tab className="tab">
              My orders
              <Orders />
            </Tab>
          ) : (
            tab === "settings" && (
              <Tab className="tab">
                Account Settings
                <Settings />
              </Tab>
            )
          )}
        </div>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const TabSelect = styled.button`
  border: none;
  font-size: 15px;
  margin-bottom: 10px;
  width: 33.33333%;
  border-radius: 0;
  font-size: 12px;

  &:hover {
    cursor: pointer;
  }
`;
const SideBar = styled.div``;

const Tab = styled.div`
  background-color: #7dccab;
  border: solid;
  text-align: center;
  margin-top: 25px;
  display: block;
  overflow: auto;
`;

export default UserAccount;
