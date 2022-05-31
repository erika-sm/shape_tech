import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "./StoreContext";
import styled from "styled-components";
import moment from "moment";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
const SalesTax = require("sales-tax");

const Checkout = () => {
  const {
    cart,
    setCart,
    states,
    provinces,
    cartNum,
    orderProcessing,
    setConfirmedOrder,
    guest,
    setCartNum,
    setOrderProcessing,
    totalPriceWST,
  } = useContext(StoreContext);

  let redirect = useNavigate();

  const [user, setUser] = useState({});

  const [shipping, setShipping] = useState(9.99);
  const [tax, setTax] = useState();

  const [useSaved, setUseSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [loading, setLoading] = useState();

  const cartMap = cart;
  const [totalPrice, setTotalPrice] = useState();
  const [orderForm, setOrderForm] = useState({
    nameOnCard: "",
    creditCardNumber: "",
    creditExpYear: "",
    creditExpMonth: "",
    cvc: "",

    fullName: "",
    email: "",
    country: "",
    address: "",
    city: "",
    provState: "",
    postalZip: "",
    tax: "",
    items: cart,
    shipping: 9.99,
    total: totalPriceWST,
    saveData: false,
  });

  useEffect(() => {
    if (cart.length > 0) {
      const maniCart = cart;
      const priceArr = maniCart.map((item) => {
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

  useEffect(async () => {
    SalesTax.setTaxOriginCountry("CA", false);
    const tax = await SalesTax.getSalesTax(
      orderForm.country.toString(),
      orderForm.provState.toString()
    );

    setTax(tax.rate);
  }, [orderForm]);

  useEffect(() => {
    setOrderForm({ ...orderForm, tax: tax });
  }, [tax]);

  useEffect(async () => {
    const session = await fetch("/get-logged-in-user");

    const sessionData = await session.json();

    if (sessionData.status === 200) {
      setUser(sessionData.data);
      setOrderForm({ ...orderForm, email: sessionData.data.email });
    }
  }, []);

  useEffect(() => {
    if (useSaved === true) {
      setOrderForm({
        ...orderForm,

        nameOnCard: user.nameOnCard,
        creditCardNumber: user.creditCardNumber,
        creditExpYear: user.creditExpYear,
        creditExpMonth: user.creditExpMonth,
        cvc: user.cvc,

        fullName: user.fullName,
        email: user.email,
        country: user.country,
        address: user.address,
        city: user.city,
        provState: user.provState,
        postalZip: user.postalZip,
      });
    } else {
      if (useSaved === false && Object.keys(user).length > 1) {
        setOrderForm({
          ...orderForm,
          email: user.email,
          nameOnCard: "",
          creditCardNumber: "",
          creditExpYear: "",
          creditExpMonth: "",
          cvc: "",

          fullName: "",

          country: "",
          address: "",
          city: "",
          provState: "",
          postalZip: "",
        });
      }
    }
  }, [useSaved]);

  let monthArr = [];
  let yearArr = [];

  const currentYear = moment().format("YYYY");

  for (let i = currentYear; i <= parseInt(currentYear) + 10; i++) {
    yearArr.push(i);
  }

  for (let i = 1; i <= 12; i++) {
    monthArr.push(i);
  }

  const handleConfirmOrder = async (e) => {
    setLoading(true);
    e.preventDefault();
    const auth = await fetch("/place-order/", {
      method: "POST",
      body: JSON.stringify(orderForm),
      headers: { "Content-Type": "application/json" },
    });

    const json = await auth.json();

    if (json.status === 200) {
      setConfirmedOrder(json.data);

      setCartNum(0);
      redirect("/order-confirmation");
      setLoading(false);
      setCart([]);
      setOrderProcessing(false);
      if (Object.keys(user).length > 0) {
        await fetch("/update-cart/", {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email, cart: [] }),
        });
      }
    } else {
      setErrorMsg(json.message);
      setLoading(false);
    }
  };

  return (
    <div>
      {orderProcessing ? (
        <form onSubmit={handleConfirmOrder}>
          <div className="row">
            <div className="col-75">
              <div className="containerCheckout">
                <h2>Checkout</h2>

                <div className="col-25">
                  <div className="containerCheckout">
                    <h4>
                      Cart{" "}
                      <span className="price" style={{ color: "black" }}>
                        <span className="quantity">Quantity</span>
                        <i className="fa fa-shopping-cart"></i> <b>{cartNum}</b>
                      </span>
                    </h4>

                    {cartMap.map((item) => (
                      <p>
                        <a href="#">{item.itemDesc.name}</a> (
                        {item.selectedQuantity})
                        <span className="price">
                          {" "}
                          $
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
                        <b> ${shipping}</b>
                      </span>
                    </p>
                    <p>
                      Total before tax{" "}
                      <span className="price" style={{ color: "black" }}>
                        <b>
                          $
                          {parseFloat(
                            parseFloat(totalPrice) + parseFloat(shipping)
                          ).toFixed(2)}
                        </b>
                      </span>
                    </p>
                    {orderForm.country === "CA" ? (
                      <p>
                        Estimated GST/HST + PST/RST/QST{" "}
                        {orderForm.provState === " " ? (
                          <span className="price" style={{ color: "black" }}>
                            Select your province
                          </span>
                        ) : (
                          <span className="price" style={{ color: "black" }}>
                            {" "}
                            <b>
                              $
                              {(
                                (parseFloat(totalPrice) +
                                  parseFloat(shipping)) *
                                tax
                              ).toFixed(2)}
                            </b>
                          </span>
                        )}
                      </p>
                    ) : orderForm.country === "US" ? (
                      <p>
                        Sales tax:{" "}
                        {orderForm.provState === " " ? (
                          <span className="price" style={{ color: "black" }}>
                            Select your state
                          </span>
                        ) : (
                          <span className="price" style={{ color: "black" }}>
                            {" "}
                            <b>
                              $
                              {(
                                (parseFloat(totalPrice) +
                                  parseFloat(shipping)) *
                                tax
                              ).toFixed(2)}
                            </b>
                          </span>
                        )}
                      </p>
                    ) : (
                      <p>
                        Tax:{" "}
                        <span className="price" style={{ color: "black" }}>
                          Select a country and province/state
                        </span>
                      </p>
                    )}
                    <p>
                      Total{" "}
                      <span className="price" style={{ color: "black" }}>
                        <b>
                          ${" "}
                          {(
                            (parseFloat(totalPrice) + parseFloat(shipping)) *
                              tax +
                            parseFloat(totalPrice) +
                            parseFloat(shipping)
                          ).toFixed(2)}
                        </b>
                      </span>
                    </p>
                  </div>
                </div>

                <div className="col-50">
                  <h3>Payment</h3>

                  <label htmlFor="fname">Accepted Payments</label>
                  <div className="icon-containerCheckout">
                    <i className="fa fa-cc-visa" style={{ color: "navy" }}></i>{" "}
                    <i className="fa fa-cc-amex" style={{ color: "blue" }}></i>{" "}
                    <i
                      className="fa fa-cc-mastercard"
                      style={{ color: "red" }}
                    ></i>{" "}
                    <i
                      className="fa fa-cc-discover"
                      style={{ color: "orange" }}
                    ></i>{" "}
                    <i className="fa fa-apple" aria-hidden="true"></i>{" "}
                    {user.nameOnCard && (
                      <SavedInfo>
                        <label htmlFor="fname">
                          <input
                            onClick={() => setUseSaved(!useSaved)}
                            type="checkbox"
                          />
                          Use saved information
                        </label>
                      </SavedInfo>
                    )}
                  </div>

                  <label htmlFor="cname">Name on Card</label>
                  <input
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,

                        nameOnCard: e.target.value,
                      })
                    }
                    required
                    value={orderForm.nameOnCard}
                    type="text"
                    id="cname"
                    name="cardname"
                    className="orderForm"
                  />
                  <label htmlFor="ccnum">Credit card number</label>
                  <input
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        creditCardNumber: e.target.value,
                      })
                    }
                    required
                    value={orderForm.creditCardNumber}
                    type="number"
                    id="ccnum"
                    name="cardnumber"
                    className="orderFormNum"
                  />
                  <label htmlFor="expmonth">Exp Month</label>
                  <select
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        creditExpMonth: e.target.value,
                      })
                    }
                    required
                    className="location"
                    defaultValue={"default"}
                  >
                    {}
                    <option disabled value={"default"}>
                      Select one
                    </option>
                    {monthArr.map((month) => (
                      <option
                        selected={
                          parseInt(orderForm.creditExpMonth) ===
                            parseInt(month) && true
                        }
                        key={month}
                      >
                        {month}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="expyear">Exp Year</label>
                  <select
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        creditExpYear: e.target.value,
                      })
                    }
                    required
                    className="location"
                    defaultValue={"default"}
                  >
                    <option disabled value="default">
                      Year
                    </option>
                    {yearArr.map((year) => (
                      <option
                        selected={
                          parseInt(orderForm.creditExpYear) ===
                            parseInt(year) && true
                        }
                        key={year}
                      >
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-50">
                  <label htmlFor="cvc">CVC</label>
                  <input
                    onChange={(e) =>
                      setOrderForm({ ...orderForm, cvc: e.target.value })
                    }
                    required
                    className="orderFormNum"
                    type="number"
                    id="cvc"
                    name="cvc"
                    value={orderForm.cvc}
                    min="100"
                    max="999"
                  ></input>
                </div>
                <h3>Billing Address</h3>
                <label htmlFor="fname">
                  <i className="fa fa-user"></i> Full Name
                </label>
                <input
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, fullName: e.target.value })
                  }
                  required
                  type="text"
                  id="fname"
                  name="firstname"
                  value={orderForm.fullName}
                  className="orderForm"
                />
                <label htmlFor="email">
                  <i className="fa fa-envelope"></i> Email
                </label>
                {Object.keys(user).length > 0 ? (
                  <input
                    disabled
                    type="text"
                    id="email"
                    name="email"
                    value={user.email}
                    className="orderForm"
                  />
                ) : (
                  <input
                    onChange={(e) =>
                      setOrderForm({ ...orderForm, email: e.target.value })
                    }
                    required
                    type="text"
                    id="email"
                    name="email"
                    className="orderForm"
                  />
                )}

                <label htmlFor="country">
                  <i className="fa fa-globe" aria-hidden="true"></i> Country
                </label>
                <Country
                  required
                  defaultValue={"default"}
                  className="location"
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, country: e.target.value })
                  }
                >
                  <option disabled value={"default"}>
                    Select one
                  </option>
                  <option
                    value={"CA"}
                    selected={orderForm.country.toString() === "CA" && true}
                  >
                    {" "}
                    Canada
                  </option>
                  <option
                    value="US"
                    selected={orderForm.country.toString() === "US" && true}
                  >
                    USA
                  </option>
                </Country>
                <label htmlFor="adr">
                  <i className="fa fa-address-card-o"></i> Address
                </label>
                <input
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, address: e.target.value })
                  }
                  required
                  type="text"
                  id="adr"
                  name="address"
                  value={orderForm.address}
                  className="orderForm"
                />
                <label htmlFor="city">
                  <i className="fa fa-institution"></i> City
                </label>
                <input
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, city: e.target.value })
                  }
                  required
                  type="text"
                  id="city"
                  name="city"
                  className="orderForm"
                  value={orderForm.city}
                />

                {orderForm.country === "US" ? (
                  <div className="row">
                    <div className="col-50">
                      <label htmlFor="state">State</label>
                      <select
                        required
                        className="location"
                        defaultValue={"default"}
                        onChange={(e) =>
                          setOrderForm({
                            ...orderForm,
                            provState: e.target.value,
                          })
                        }
                      >
                        <option disabled value={"default"}>
                          Select one
                        </option>
                        {states.map((state) =>
                          orderForm.provState === state ? (
                            <option key={state} value={state} selected>
                              {state}
                            </option>
                          ) : (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div className="col-50">
                      <label htmlFor="zip">Zip Code</label>
                      <input
                        onChange={(e) =>
                          setOrderForm({
                            ...orderForm,
                            postalZip: e.target.value,
                          })
                        }
                        required
                        type="number"
                        id="zip"
                        name="zip"
                        value={orderForm.postalZip}
                        className="orderForm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    <div className="col-50">
                      <label htmlFor="state">Province</label>
                      <select
                        required
                        className="location"
                        defaultValue={"default"}
                        onChange={(e) =>
                          setOrderForm({
                            ...orderForm,
                            provState: e.target.value,
                            tax: tax,
                          })
                        }
                      >
                        <option disabled value={"default"}>
                          Select one
                        </option>
                        {provinces.map((province) =>
                          orderForm.provState === province ? (
                            <option key={province} value={province} selected>
                              {province}
                            </option>
                          ) : (
                            <option key={province} value={province}>
                              {province}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div className="col-50">
                      <label htmlFor="zip">Postal Code</label>
                      <input
                        onChange={(e) =>
                          setOrderForm({
                            ...orderForm,
                            postalZip: e.target.value,
                          })
                        }
                        required
                        className="orderForm"
                        type="text"
                        id="postal"
                        name="postal"
                        placeholder="HHH 123"
                      />
                    </div>
                  </div>
                )}
                {guest === false && (
                  <SaveInfo>
                    <label htmlFor="fname">
                      <input
                        onClick={() =>
                          setOrderForm({
                            ...orderForm,
                            saveData: !orderForm.saveData,
                          })
                        }
                        type="checkbox"
                      />
                      Save your information
                    </label>
                  </SaveInfo>
                )}

                {loading ? (
                  <button disabled>
                    <CircularProgress />
                  </button>
                ) : (
                  <button>Place order</button>
                )}
                <div>{errorMsg}</div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div>nothing to see here</div>
      )}
    </div>
  );
};

const Country = styled.select``;

const SavedInfo = styled.div`
  font-size: 20px;
  margin-top: 20px;
`;

const SaveInfo = styled.div``;
export default Checkout;
