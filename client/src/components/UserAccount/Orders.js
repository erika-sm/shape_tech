import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { StoreContext } from "../StoreContext";
import { CircularProgress } from "@mui/material";

const Orders = () => {
  const { loggedInUser } = useContext(StoreContext);

  const [pastOrders, setPastOrders] = useState({});
  const [loading, setLoading] = useState(false);

  const getOrders = async () => {
    setLoading(true);
    const fetchOrders = await fetch(`/get-pastorders/${loggedInUser.email}`);

    const pastOrdersJ = await fetchOrders.json();

    if (pastOrdersJ.status === 200) {
      setLoading(false);
      setPastOrders(pastOrdersJ.data);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <Wrapper>
      {loading ? (
        <Spinner>
          <CircularProgress />
        </Spinner>
      ) : Object.keys(pastOrders).length > 0 ? (
        pastOrders.map((order) => (
          <OrderWrapper>
            {order._id}
            <Header>Address Shipped To</Header>
            <div>
              {order.address}, {order.provState}, {order.postalZip}
            </div>
            <Header>Payment Method</Header>
            <div>Credit Card ***{order.creditCardNumber.slice(11, 15)}</div>
            <Header>Total Cost</Header>
            <div>
              {parseFloat(
                (parseFloat(order.total) + order.shipping) * (1 + order.tax)
              ).toFixed(2)}
            </div>
          </OrderWrapper>
        ))
      ) : (
        <div>You haven't placed your first order yet!</div>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Spinner = styled.div`
  position: absolute;
  top: 45%;
  left: 48%;
`;

const OrderWrapper = styled.div`
  border: solid;
  height: 25vh;
  width: 20vw;
  margin-top: 10px;
  margin-left: 250px;
`;

const Header = styled.div`
  margin-top: 10px;
`;

export default Orders;
