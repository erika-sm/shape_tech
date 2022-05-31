import React, { createContext, useEffect, useState } from "react";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({});
  const [cart, setCart] = useState([]);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [guest, setGuest] = useState(false);
  const [open, setOpen] = useState(false);
  const [totalPriceWST, setTotalPriceWST] = useState();

  const [confirmedOrder, setConfirmedOrder] = useState({});

  const [cartNum, setCartNum] = useState(0);

  useEffect(async () => {
    const session = await fetch("/get-logged-in-user");

    const sessionData = await session.json();

    if (sessionData.status === 200) {
      setLoggedIn(true);
      setLoggedInUser(sessionData.data);
      const copy = sessionData;

      if (sessionData.data.cart.length > 0) {
        const data = copy.data.cart.map((item) => {
          return item.selectedQuantity;
        });

        const sum = data.reduce(
          (previousValue, currentValue) =>
            parseFloat(previousValue) + parseFloat(currentValue)
        );

        if (sessionData.status === 200) {
          setCart(sessionData.data.cart);

          setCartNum(sum);
        }
      }
    }
  }, []);
  const [filter, setFilter] = useState({
    body_location: "",
    category: "",
    companyId: "",
    name: "",
  }); //updates items to be displayed based on users' filter preference
  const [items, setItems] = useState([]);
  const [states, setStates] = useState([
    "AL",
    "AK",
    "AS",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DC",
    "DE",
    "FL",
    "GA",
    "GU",
    "HI",
    "IA",
    "ID",
    "IL",
    "IN",
    "KS",
    "KY",
    "LA",
    "MA",
    "MD",
    "ME",
    "MI",
    "MN",
    "MO",
    "MS",
    "MT",
    "NC",
    "ND",
    "NE",
    "NH",
    "NJ",
    "NM",
    "NV",
    "NY",
    "OH",
    "OK",
    "OR",
    "PA",
    "PR",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VA",
    "VI",
    "VT",
    "WA",
    "WI",
    "WV",
    "WY",
  ]);

  const [provinces, setProvinces] = useState([
    "AB",
    "BC",
    "MB",
    "NB",
    "NL",
    "NT",
    "NS",
    "NU",
    "ON",
    "PE",
    "QC",
    "SK",
    "YT",
  ]);

  const categoryObject = {
    bodyLocation: ["Wrist", "Neck", "Arms", "Hands", "Waist", "Head", "Feet"],
    category: [
      "Fitness",
      "Medical",
      "Lifestyle",
      "Entertainment",
      "Industrial",
      "Pets and Animals",
      "Gaming",
    ],
  };

  const randomizeArray = (randomArr, originalArr) => {
    let j;
    if (originalArr.length < 10) {
      j = originalArr.length;
    } else {
      j = 10;
    }
    for (let i = 0; i < j; i++) {
      let random = originalArr[Math.floor(Math.random() * originalArr.length)];
      if (!randomArr.includes(random)) {
        randomArr.push(random);
      }
    }
    return randomArr;
  };

  const getItems = async () => {
    const fetchItems = await fetch("/get-filtered-items");
    const convertingItems = await fetchItems.json();
    setItems(convertingItems.data);
  };
  return (
    <StoreContext.Provider
      value={{
        cart,
        setCart,
        filter,
        setFilter,
        categoryObject,
        randomizeArray,
        states,
        provinces,
        cartNum,
        setCartNum,
        loggedIn,
        setLoggedIn,
        orderProcessing,
        setOrderProcessing,
        confirmedOrder,
        setConfirmedOrder,
        guest,
        setGuest,
        open,
        setOpen,
        loggedInUser,
        setLoggedInUser,
        totalPriceWST,
        setTotalPriceWST,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
