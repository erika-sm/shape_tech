import { CircularProgress } from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { StoreContext } from "./StoreContext";
import AddToCartButton from "./AddToCartButton";
import { useNavigate } from "react-router-dom";
import Lifestyle from "../Images/Lifestyle.jpg";
import Pets from "../Images/Animals.jpg";
import Fitness from "../Images/Fitness.jpg";
import Medical from "../Images/Medical.jpg";
import Industrial from "../Images/Industrial.jpg";
import Gaming from "../Images/Gaming.jpg";
import Entertainment from "../Images/Entertainment.jpg";

const CategoryPage = () => {
  const { id } = useParams();
  let imgSrc;
  if (id === "Lifestyle") {
    imgSrc = Lifestyle;
  } else if (id === "Pets and Animals") {
    imgSrc = Pets;
  } else if (id === "Fitness") {
    imgSrc = Fitness;
  } else if (id === "Medical") {
    imgSrc = Medical;
  } else if (id === "Industrial") {
    imgSrc = Industrial;
  } else if (id === "Gaming") {
    imgSrc = Gaming;
  } else if (id === "Entertainment") {
    imgSrc = Entertainment;
  }

  const { cart, setCart, cartNum, setCartNum } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState({});
  let idArr = [];
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
  const handleRedirect = (e, _id) => {
    e.stopPropagation();
    redirect(`/product/${_id}`);
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

  const fetchProduct = async () => {
    setLoading(true);
    const fetchCategoryItems = await fetch(
      `/get-filtered-items?&category=${id}`
    );
    const categoryItems = await fetchCategoryItems.json();
    if (categoryItems.status === 200) {
      setItems(categoryItems.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, [id]);

  return (
    <ImageWrapper>
      {loading ? (
        <Loading>
          <CircularProgress />
        </Loading>
      ) : (
        <Container>
          <CategoryTitle className="categoryTitle">{id}</CategoryTitle>
          <Banner src={imgSrc} />
          {Object.keys(items).length > 0 && (
            <ProductWrapper>
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
                        // onClick={(e) => handleFilledCart(e, item)}
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
          )}
        </Container>
      )}
    </ImageWrapper>
  );
};

const Container = styled.div`
  display: flex;
  flex-flow: row wrap;
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

// const Wrapper = styled.div`
//   display: flex;
//   background-color: white;
// `;
const ImageWrapper = styled.div`
  width: 100vw;
  display: block;
  overflow: auto;
  height: 100vh;
  margin-top: 50px;
  align-content: center;
`;
const Image = styled.img`
  height: 150px;
  margin-bottom: 10px;
`;
const ProductWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
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

const Banner = styled.img`
  width: 100%;
  height: 60vh;
`;

const CategoryTitle = styled.h1`
  font-size: 50px;
  position: absolute;
  text-align: center;
  width: 100%;
  margin-top: -55px;
`;

const Loading = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
`;

export default CategoryPage;
