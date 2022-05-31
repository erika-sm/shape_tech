import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import styled from "styled-components";
import { useNavigate, NavLink } from "react-router-dom";
import { StoreContext } from "./StoreContext";
import AddToCartButton from "./AddToCartButton";

const ProductDescription = () => {
  const { randomizeArray, cart, setCart, cartNum, setCartNum } =
    useContext(StoreContext);

  const { _id } = useParams();
  const [itemDesc, setItemDesc] = useState({});
  const [loading, setLoading] = useState(false);
  const [relatedLocation, setRelatedLocation] = useState({});
  const [relatedCompany, setRelatedCompany] = useState({});
  const [quantityAvail, setQuantiyAvail] = useState();
  const [error, setError] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [inCart, setInCart] = useState(false);

  let redirect = useNavigate();

  let index;
  let initialIndex;

  if (inCart === true) {
    let mutatedCart = cart;

    initialIndex = mutatedCart
      .map((item) => item.itemDesc._id)
      .indexOf(itemDesc._id);
  }

  if (Object.keys(itemDesc).length > 1) {
    itemDesc.pr = parseFloat(itemDesc.price.replace("$", ""));
  }

  const fetchProduct = async () => {
    setInCart(false);
    try {
      setLoading(true);
      const fetchInfo = await fetch(`/get-product-info/${_id}`);
      const info = await fetchInfo.json();

      if (!info.status === 200) {
        setLoading(false);
        return (error = true);
      }

      const itemStock = info.data.numInStock;
      let quantity = [];

      for (let i = 1; i <= itemStock; i++) {
        quantity.push(i);
      }

      setQuantiyAvail(quantity);

      const fetchSimilarLoc = await fetch(
        `/get-filtered-items?&body_location=${info.data.body_location}`
      );

      const fetchSimilarComp = await fetch(
        `/get-filtered-items?&companyId=${info.data.companyId}`
      );

      const similarLoc = await fetchSimilarLoc.json();

      if (!similarLoc.status === 200) {
        setLoading(false);
        return (error = true);
      }

      const similarComp = await fetchSimilarComp.json();

      if (!similarComp.status === 200) {
        setLoading(false);
        return (error = true);
      }

      const randomLoc = [];
      const randomComp = [];

      let cartCopy = cart;

      index = cartCopy.map((item) => item.itemDesc._id).indexOf(info.data._id);

      if (index >= 0) {
        setInCart(true);
      }

      setRelatedLocation(randomizeArray(randomLoc, similarLoc.data));

      if (similarComp.data.length >= 10) {
        setRelatedCompany(randomizeArray(randomComp, similarComp.data));
      } else if (similarComp.data.length < 10 && similarComp.data.length > 1) {
        setRelatedCompany(similarComp.data);
      }

      if (
        info.status === 200 &&
        similarComp.status === 200 &&
        similarLoc.status === 200
      ) {
        setItemDesc(info.data);
        setLoading(false);
      } else {
        setLoading(false);
        setError(true);
      }
    } catch (err) {
      if (err) {
        setError(true);
        setLoading(false);
      }
    }
  };

  useEffect(async () => {
    setSelectedQuantity(1);
    await fetchProduct();
  }, [_id]);

  const handleProductRedirect = (_id) => {
    redirect(`/product/${_id}`);
  };

  const handleCart = async () => {
    if (inCart) {
      setCartNum(parseInt(cartNum) + parseInt(selectedQuantity));
      let cartCopy = cart;
      let cartItem = cart[initialIndex];
      cartItem.selectedQuantity =
        parseInt(selectedQuantity) + parseInt(cartItem.selectedQuantity);
      cartCopy[initialIndex] = cartItem;
      setCart(cartCopy);
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
    } else {
      setCartNum(parseInt(cartNum) + parseInt(selectedQuantity));

      setCart((cart) => [
        ...cart,
        { itemDesc: itemDesc, selectedQuantity: selectedQuantity },
      ]);

      const data = await fetch("/get-logged-in-user");

      const json = await data.json();

      setInCart(true);

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
      setInCart(true);
    }
  };

  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : !loading && !error && Object.keys(itemDesc).length > 0 ? (
        <div>
          <Header>
            <span>Category</span> &nbsp; - &nbsp;
            <NavLink
              to={`/category/${itemDesc.category}`}
              className="categorylink"
            >
              {itemDesc.category}
            </NavLink>
          </Header>
          <ItemWrapper>
            <img src={itemDesc.imageSrc} />
            <DescriptionBox>
              <ItemName>{itemDesc.name}</ItemName>
              <div>Price: {itemDesc.price}</div>
              {itemDesc.numInStock === 0 ? (
                <div>Out of stock</div>
              ) : (
                <PurchaseQuantity>
                  Quantity:
                  {selectedQuantity <= 1 ? (
                    <CounterButtonMinus disabled>-</CounterButtonMinus>
                  ) : (
                    <CounterButtonMinus
                      onClick={() => setSelectedQuantity(selectedQuantity - 1)}
                    >
                      -
                    </CounterButtonMinus>
                  )}
                  <Input disabled value={selectedQuantity} />
                  <CounterButtonPlus
                    onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                  >
                    +
                  </CounterButtonPlus>
                </PurchaseQuantity>
              )}
              {itemDesc.numInStock >= 1 ? (
                inCart ? (
                  <AddToCartButton handleFunction={handleCart} />
                ) : (
                  <AddToCartButton handleFunction={handleCart} />
                )
              ) : (
                ""
              )}
            </DescriptionBox>
          </ItemWrapper>

          {Object.keys(relatedLocation).length > 1 ? (
            <RelatedLocationDisplay>
              <div style={{ fontWeight: "bold" }}>Other users also bought:</div>
              <RelatedItemWrapper>
                {relatedLocation.map((location) => (
                  <RelatedItemBox
                    key={location._id}
                    onClick={() => handleProductRedirect(location._id)}
                  >
                    <RelatedItem src={location.imageSrc} />
                    <div>{location.name}</div>
                  </RelatedItemBox>
                ))}
              </RelatedItemWrapper>
            </RelatedLocationDisplay>
          ) : (
            ""
          )}

          {Object.keys(relatedCompany).length > 1 && (
            <RelatedCompanyDisplay>
              <div style={{ fontWeight: "bold" }}>
                Products from the same company:
              </div>
              <RelatedItemWrapper>
                {relatedCompany.map((company) => (
                  <RelatedItemBox
                    key={company._id}
                    onClick={() => handleProductRedirect(company._id)}
                  >
                    <RelatedItem src={company.imageSrc} />
                    <div>{company.name}</div>
                  </RelatedItemBox>
                ))}
              </RelatedItemWrapper>
            </RelatedCompanyDisplay>
          )}
        </div>
      ) : (
        <div>Something went wrong. Please refresh your page.</div>
      )}
    </div>
  );
};

const RelatedLocationDisplay = styled.div`
  width: 100vw;
  display: block;
  overflow: auto;
  height: 300px;
  margin-top: 50px;
  align-content: center;
  position: absolute;
  top: 50%;
`;

const RelatedCompanyDisplay = styled.div`
  width: 100vw;
  display: block;
  overflow: auto;
  height: 200px;
  margin-top: 100px;
  align-content: center;
  position: absolute;
  top: 90%;
  }
`;

const RelatedItemWrapper = styled.div`
  display: flex;
`;

const RelatedItemBox = styled.div`
  font-size: 15px;
  margin-left: 100px;
  top: 25px;
  transition: transform 0.2s;
  :hover {
    transform: scale(1.1);
    cursor: pointer;
  }
`;

const RelatedItem = styled.img`
  height: 150px;
`;

const DescriptionBox = styled.div`
  width: 200px;
  margin-left: 15px;
`;

const Header = styled.div``;

const ItemWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
`;

const ItemName = styled.div`
  font-weight: bold;
`;

const PurchaseQuantity = styled.div`
  display: flex;
  flex-direction: row;
  width: 30px;
`;

const Input = styled.input`
  text-align: center;
  width: 30px;
`;

const CounterButtonPlus = styled.button`
  width: 30px;
  border-radius: 0px;
  margin-top: 0;
  &:hover {
    color: green;
  }
`;

const CounterButtonMinus = styled.button`
  width: 30px;
  border-radius: 0px;
  margin-top: 0;
  margin-left: 10px;
  &:hover {
    color: red;
  }
`;

export default ProductDescription;
