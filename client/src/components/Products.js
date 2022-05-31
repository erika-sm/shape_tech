import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "./StoreContext";
import MainFilter from "./MainFilter";
import AddToCartButton from "./AddToCartButton";

import BackgroundBanner from "../Images/productsPage.jpg";

const Products = () => {
  const { filter, setFilter, setCart, cart, setCartNum, cartNum, open } =
    useContext(StoreContext);
  let idArr = [];

  const [items, setItems] = useState({}); //items to be rendered
  const [isLoading, setIsLoading] = useState(false); //triggers loading spinner when data is being fetched

  const [errorMsg, setErrorMsg] = useState(); //contains data message sent from the backend if fetch fails

  const [sort, setSort] = useState(""); //handles state for sorting items

  //query used for fetch, updates to proper syntax whenever a fetch occurs
  let query = "";

  //for redirecting to product description page
  let redirect = useNavigate();

  if (cart.length > 0) {
    let copyCart = cart;

    idArr = copyCart.map((copy) => {
      return copy.itemDesc._id;
    });
  }

  if (Object.keys(items).length > 0) {
    items.map((item) => {
      if (item.price) {
        item.pr = parseFloat(item.price.replace("$", ""));
      }
      return item;
    });
  }

  //fetches items based on user's filter
  const fetchFilteredItems = async () => {
    setIsLoading(true);
    setErrorMsg();

    //converts filter to appropriate query syntax
    if (filter.body_location) {
      query += `&body_location=${filter.body_location}`;
    }
    if (filter.category) {
      query += `&category=${filter.category}`;
    }
    if (filter.companyId) {
      query += `&companyId=${filter.companyId}`;
    }
    if (filter.name) {
      query += `&name=${filter.name}`;
    }

    const getItems = await fetch(`get-filtered-items?${query}`);
    const filteredItems = await getItems.json();

    if (filteredItems.status === 200) {
      setItems(filteredItems.data);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setItems([]);
      setErrorMsg(filteredItems.message);
    }
  };

  //fetches filtered items every time a user changes their selection
  useEffect(() => {
    fetchFilteredItems();
  }, [filter]);

  //sets items to be rendered to match how the user wants it sorted
  const filtered = () => {
    if (sort === "priceHL") {
      items.sort((a, b) => b.pr - a.pr);
    } else if (sort === "priceLH") {
      items.sort((a, b) => a.pr - b.pr);
    } else if (sort === "nameAZ") {
      items.sort((a, b) => a._id - b._id);
    } else if (sort === "nameZA") {
      items.sort((a, b) => b._id - a._id);
    }
  };

  //fires the filtered function only if the sort state isn't empty
  if (sort.length > 0) {
    filtered();
  }

  const handleRedirect = (e, _id) => {
    e.stopPropagation();
    redirect(`/product/${_id}`);
    setFilter({
      body_location: "",
      category: "",
      companyId: "",
      name: "",
    });
  };

  const handleCart = async (e, item) => {
    e.stopPropagation();
    setCart((cart) => [...cart, { itemDesc: item, selectedQuantity: 1 }]);
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
  };

  const handleFilledCart = async (e, item) => {
    e.stopPropagation();
    let index = idArr.indexOf(item._id);
    let cartCopy = cart;
    let cartItem = cart[index];
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
  };

  return (
    <>
      <Banner src={BackgroundBanner} />
      <Wrapper>
        <MainFilter />
        <ImageWrapper>
          <Header>
            <Select
              defaultValue={"default"}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="nameAZ">Name: A to Z</option>
              <option value="nameZA">Name: Z to A</option>
              <option value="priceLH">Price: Low to High</option>
              <option value="priceHL">Price: High to Low</option>
            </Select>
            <Search
              onChange={(e) => {
                setFilter({ ...filter, name: e.target.value });
              }}
              type="text"
              placeholder="Enter product name"
            />
          </Header>

          {isLoading ? (
            <Spinner>
              <CircularProgress />
            </Spinner>
          ) : (
            Object.keys(items).length > 0 && (
              <ProductWrapper
                style={{ marginLeft: open === true ? "150px" : "0px" }}
              >
                {items.map((item) => (
                  <ImageBox
                    key={item._id}
                    onClick={(e) => handleRedirect(e, item._id)}
                    className="zoom"
                  >
                    <Image src={item.imageSrc} className="productImg" />
                    <div className="name_price">
                      {item.name} - {item.price}
                    </div>
                    {item.numInStock >= 1 ? (
                      idArr.length > 0 && idArr.includes(item._id) ? (
                        <AddToCartButton
                          handleFunction={handleFilledCart}
                          item={item}
                        />
                      ) : (
                        <AddToCartButton
                          // onClick={(e) => handleCart(e, item)}
                          handleFunction={handleCart}
                          item={item}
                        />
                      )
                    ) : (
                      item.numInStock == 0 && (
                        <OutOfStock>Out of stock</OutOfStock>
                      )
                    )}
                  </ImageBox>
                ))}
              </ProductWrapper>
            )
          )}
          {errorMsg && <div>{errorMsg}</div>}
        </ImageWrapper>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
`;

const ProductWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding: 20px;
  justify-content: center;
  background-color: white;
`;
const Image = styled.img`
  height: 150px;
  margin-bottom: 10px;
`;

const ImageWrapper = styled.div`
  display: block;
  overflow: auto;
  height: 100vh;
`;

const Spinner = styled.div`
  position: absolute;
  top: 90%;
  left: 50%;
`;

const Select = styled.select`
  width: 150px;
  margin-left: 100px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  height: 50px;
`;
const Search = styled.input`
  width: 150px;
  margin-left: 100px;
`;

const ImageBox = styled.div`
  border-radius: 5px;
  width: 300px;
  height: 225px;
  margin-bottom: 45px;

  padding: 10px;
  display: absolute;
  text-align: center;
  padding-top: 30px;
`;

const OutOfStock = styled.div`
  padding: 3px;
  background-color: #ff6666;
  border-radius: 10px;
  margin-top: 10px;
  width: 220px;
  height: 25px;
  margin-left: 30px;
`;

const Banner = styled.img`
  height: 60vh;
  width: 100%;
`;

export default Products;
