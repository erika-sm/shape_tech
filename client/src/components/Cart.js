import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "./StoreContext";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cart,
    setCart,
    cartNum,
    setCartNum,
    setOrderProcessing,
    totalPriceWST,
    setTotalPriceWST,
  } = useContext(StoreContext);

  const [fetchError, setFetchError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stockError, setStockError] = useState([]);

  let copyCart = cart;
  let cartCopy = cart;

  let redirect = useNavigate();

  let idArr = [];

  if (cart.length > 0) {
    let copyCart = cart;

    idArr = copyCart.map((copy) => {
      return copy.itemDesc._id;
    });
  }

  const handleCounter = async (item, count) => {
    let index = idArr.indexOf(item.itemDesc._id);

    let cartCopy = cart;
    let cartItem = cart[index];
    if (count === "plus") {
      cartItem.selectedQuantity = parseInt(cartItem.selectedQuantity) + 1;
      cartCopy[index] = cartItem;
      setCart(cartCopy);
      setCartNum(cartNum + 1);

      const data = await fetch("/get-logged-in-user");

      const json = await data.json();

      if (json.status === 200) {
        await fetch("/update-cart/", {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: json.data.email, cart: cart }),
        });
      }
    } else if (count === "minus") {
      cartItem.selectedQuantity = parseInt(cartItem.selectedQuantity) - 1;
      cartCopy[index] = cartItem;
      setCart(cartCopy);
      setCartNum(cartNum - 1);

      const data = await fetch("/get-logged-in-user");

      const json = await data.json();

      if (json.status === 200) {
        await fetch("/update-cart/", {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: json.data.email, cart: cart }),
        });
      }
    }
  };

  useEffect(() => {
    if (cart.length > 0) {
      const priceArr = copyCart.map((item) => {
        return parseFloat(
          parseFloat(item.itemDesc.pr) * parseFloat(item.selectedQuantity)
        ).toFixed(2);
      });

      const sum = priceArr.reduce(
        (previousValue, currentValue) =>
          parseFloat(previousValue) + parseFloat(currentValue)
      );

      setTotalPriceWST(parseFloat(sum).toFixed(2));
    }
  }, [cartNum]);

  const handleCheckout = async () => {
    const data = await fetch("/get-logged-in-user");

    const json = await data.json();

    setStockError([]);
    setFetchError(false);
    setLoading(true);

    const error = await Promise.all(
      cartCopy.map(async (item) => {
        const stock = await fetch(`/get-product-info/${item.itemDesc._id}`);
        const json = await stock.json();

        if (json.status === 200) {
          if (item.selectedQuantity > json.data.numInStock) {
            {
              return {
                [item.itemDesc
                  ._id]: `This item's purchase limit is ${item.itemDesc.numInStock}`,
              };
            }
          }
        } else {
          setFetchError(true);
          setLoading(false);
        }
      })
    );

    setStockError(error);

    if (error.every((err) => err === undefined)) {
      if (json.status === 200) {
        redirect("/checkout");
        setOrderProcessing(true);
      } else {
        redirect("/account-check");
        setOrderProcessing(true);
      }
    }

    setLoading(false);
  };

  const handleRemoveFromCart = async (item) => {
    const index = cart.indexOf(item);

    cart.splice(index, 1);
    setCartNum(cartNum - item.selectedQuantity);

    const data = await fetch("/get-logged-in-user");

    const json = await data.json();

    if (json.status === 200) {
      await fetch("/update-cart/", {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: json.data.email, cart: cart }),
      });
    }
  };

  const handleEmptyCart = async () => {
    setCart([]);
    setCartNum(0);

    const data = await fetch("/get-logged-in-user");

    const json = await data.json();

    if (json.status === 200) {
      const fet = await fetch("/update-cart/", {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: json.data.email, cart: [] }),
      });
    }
  };

  return (
    <Container>
      <h2>Your Cart</h2>

      {cart.length > 0 ? (
        <table>
          <tr>
            <Title>Description</Title>
            <Title>Price</Title>
            <Title>Quantity</Title>
            <Title>Total</Title>
            <th>
              <EmptyCart onClick={handleEmptyCart}>Empty Cart</EmptyCart>
            </th>
          </tr>
          {cart.map((item) => (
            <tr key={item.itemDesc._id}>
              {" "}
              <Cell>
                <ProductDescription>
                  <Image key={item.itemDesc._id} src={item.itemDesc.imageSrc} />
                  {item.itemDesc.name}
                </ProductDescription>
              </Cell>
              <Cell>{item.itemDesc.price}</Cell>
              <Cell>
                <Counter>
                  {" "}
                  <CounterButtonPlus
                    value={item.selectedQuantity}
                    onClick={() => {
                      handleCounter(item, "plus");
                    }}
                  >
                    +
                  </CounterButtonPlus>{" "}
                  <Input value={item.selectedQuantity} disabled />
                  {item.selectedQuantity <= 1 ? (
                    <CounterButtonMinus disabled>-</CounterButtonMinus>
                  ) : (
                    <CounterButtonMinus
                      onClick={() => {
                        handleCounter(item, "minus");
                      }}
                    >
                      -
                    </CounterButtonMinus>
                  )}
                </Counter>
              </Cell>
              <Cell>
                $
                {(
                  parseFloat(item.itemDesc.pr) *
                  parseFloat(item.selectedQuantity)
                ).toFixed(2)}
              </Cell>
              <td>
                <RemoveItem onClick={() => handleRemoveFromCart(item)}>
                  X
                </RemoveItem>
              </td>
              <td>
                {stockError.length > 0 &&
                  stockError.map((error) =>
                    error === undefined ? (
                      <div></div>
                    ) : (
                      Object.keys(error)[0] ===
                        item.itemDesc._id.toString() && (
                        <ErrorContainer ket={error}>
                          {Object.values(error)[0]}
                        </ErrorContainer>
                      )
                    )
                  )}
              </td>
            </tr>
          ))}
          <tr>
            <td></td>
            <td></td>
            <td>Total before taxes </td>
            <Total>${totalPriceWST}</Total>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>Shipping </td>
            <Cost>$9.99</Cost>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>Taxes </td>
            <Cost>Calculated at checkout</Cost>

            <td>
              {loading ? (
                <button disabled>
                  <CircularProgress />
                </button>
              ) : (
                <CheckoutButton onClick={handleCheckout}>
                  Checkout
                </CheckoutButton>
              )}
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>
              {" "}
              {fetchError && (
                <div>Something went wrong, please try again. </div>
              )}
            </td>
          </tr>
        </table>
      ) : (
        <div>Your cart is empty</div>
      )}
    </Container>
  );
};

const Container = styled.div`
  margin-left: 20px;
`;
const Image = styled.img`
  height: 100px;
`;

const ProductDescription = styled.div`
  width: 400px;
  font-size: 15px;
  display: flex;
  justify-content: center;
`;

const Counter = styled.div`
  display: flex;
  flex-direction: column;
  width: 30px;
  margin: auto;
`;

const CounterButtonMinus = styled.button`
  width: 30px;
  border-radius: 0px;
  &:hover {
    color: red;
  }
`;

const CounterButtonPlus = styled.button`
  width: 30px;
  border-radius: 0px;
  margin-bottom: 10px;
  &:hover {
    color: green;
  }
`;

const Input = styled.input`
  text-align: center;
`;

const Title = styled.th`
  border-top: solid;
`;

const CheckoutButton = styled.button`
  font-size: 18px;
`;

const Cell = styled.td`
  margin-left: 15px;
  margin-right: 5px;
  text-align: center;
`;

const Total = styled.td`
  border-top: solid;
  text-align: center;
`;

const Cost = styled.td`
  text-align: center;
`;

const ErrorContainer = styled.div`
  color: darkred;
`;

const EmptyCart = styled.button`
  margin-left: -5px;
  width: 100px;
`;

const RemoveItem = styled.button`
  background-color: none;
  border: none;
  width: 50px;

  &:hover {
    color: red;
    cursor: pointer;
  }
`;

export default Cart;
