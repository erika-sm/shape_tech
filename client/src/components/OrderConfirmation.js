import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { StoreContext } from "./StoreContext";

const OrderConfirmation = () => {
  const { confirmedOrder } = useContext(StoreContext);
  const [totalPrice, setTotalPrice] = useState();

  useEffect(() => {
    if (Object.keys(confirmedOrder).length > 0) {
      const items = confirmedOrder.items;
      const priceArr = items.map((item) => {
        return parseFloat(
          parseFloat(item.itemDesc.pr) * parseFloat(item.selectedQuantity)
        ).toFixed(2);
      });

      const sum = priceArr.reduce(
        (previousValue, currentValue) =>
          parseFloat(previousValue) + parseFloat(currentValue)
      );

      setTotalPrice(parseFloat(sum).toFixed(2));
    }
  }, []);

  return (
    <Container>
      {Object.keys(confirmedOrder).length > 0 ? (
        <>
          <div className="col-75">
            <OrderConfirm>Order successfully placed!</OrderConfirm>
            <ThankYou className="col-50">
              Thank you for shopping at shape_tech. We have received your order
              and will contact you when your parcel is shipped. Below is your
              order information
            </ThankYou>
          </div>
          <Details className="col-75"> YOUR DETAILS</Details>
          <OrderFlexBox className="row">
            <Payment className="col-25">
              <div>
                <h3>Order Number</h3>
                <TextBox> {confirmedOrder._id}</TextBox>

                <h3>Name</h3>
                <TextBox> {confirmedOrder.fullName}</TextBox>

                <h3>Email</h3>
                <TextBox>{confirmedOrder.email}</TextBox>

                <h3>Payment Method</h3>
                <TextBox>
                  {" "}
                  Credit Card ************
                  {confirmedOrder.creditCardNumber.slice(11, 15)}
                </TextBox>
              </div>
            </Payment>
            <Address className="col-25">
              <div>
                <h3>Shipping Address</h3>
                <TextBox> {confirmedOrder.name}</TextBox>
                <TextBox> {confirmedOrder.address}</TextBox>
                <TextBox>
                  {" "}
                  {confirmedOrder.city}, {confirmedOrder.provState},{" "}
                  {confirmedOrder.postalZip}
                </TextBox>

                <h3>Shipping Method</h3>
                <TextBox> Standard</TextBox>
              </div>
            </Address>
          </OrderFlexBox>
          <div className="row">
            <div className="col-75">
              <Details className="col-50"> ORDER SUMMARY</Details>

              <div className="col-25">
                <OrderData>
                  <h4>
                    Purchased
                    <span className="price" style={{ color: "black" }}>
                      <span className="quantity">Quantity</span>
                      <i className="fa fa-shopping-cart"></i>{" "}
                      <b>{confirmedOrder.items.length}</b>
                    </span>
                  </h4>

                  {confirmedOrder.items.map((item) => (
                    <p>
                      <a href="#">{item.itemDesc.name}</a> (
                      {item.selectedQuantity})
                      <span className="price">
                        ${" "}
                        {(
                          parseFloat(item.itemDesc.pr) *
                          parseFloat(item.selectedQuantity)
                        ).toFixed(2)}
                      </span>
                    </p>
                  ))}
                  <hr />
                  <p>
                    Items{" "}
                    <span className="price" style={{ color: "black" }}>
                      <b> ${totalPrice}</b>
                    </span>
                  </p>
                  <p>
                    Shipping and Handling{" "}
                    <span className="price" style={{ color: "black" }}>
                      ${confirmedOrder.shipping}
                    </span>
                  </p>
                  <p>
                    Total before tax{" "}
                    <span className="price" style={{ color: "black" }}>
                      <b>
                        $
                        {parseFloat(
                          parseFloat(totalPrice) +
                            parseFloat(confirmedOrder.shipping)
                        ).toFixed(2)}
                      </b>
                    </span>
                  </p>

                  <p>
                    Sales tax:{" "}
                    <span className="price" style={{ color: "black" }}>
                      {" "}
                      <b>
                        $
                        {(
                          (parseFloat(totalPrice) +
                            parseFloat(confirmedOrder.shipping)) *
                          confirmedOrder.tax
                        ).toFixed(2)}
                      </b>
                    </span>
                  </p>

                  <p>
                    Total{" "}
                    <span className="price" style={{ color: "black" }}>
                      <b>
                        ${" "}
                        {(
                          (parseFloat(totalPrice) +
                            parseFloat(confirmedOrder.shipping)) *
                            confirmedOrder.tax +
                          parseFloat(totalPrice) +
                          parseFloat(confirmedOrder.shipping)
                        ).toFixed(2)}
                      </b>
                    </span>
                  </p>
                </OrderData>
              </div>
            </div>
          </div>{" "}
        </>
      ) : (
        <div>Nothing to see here</div>
      )}
    </Container>
  );
};

const Address = styled.div`
  margin-left: 10px;
`;

const OrderData = styled.div`
  margin-left: 10px;
  margin-right: 10px;
`;
const Payment = styled.div`
  margin-left: 10px;
`;
const OrderFlexBox = styled.div``;

const TextBox = styled.div`
  margin-top: -10px;
  margin-bottom: 10px;
`;

const Details = styled.div`
  background-color: black;

  height: 50px;
  font-weight: bold;
  font-size: 20px;
  width: 100vw;
  line-height: 2.5em;
  margin-top: 10px;
  color: #7dccab;
`;

const OrderConfirm = styled.h1`
  font-weight: bold;
  text-align: center;
`;

const ThankYou = styled.div`
  display: flex;
  justify-content: center;
  line-height: 1.5em;
  text-align: center;
`;

const Container = styled.div``;

export default OrderConfirmation;
