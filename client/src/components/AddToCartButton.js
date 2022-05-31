import React, { useState } from "react";
import styled from "styled-components";

const AddToCartButton = ({ handleFunction, item }) => {
  const [addToCart, setAddToCart] = useState("Add to Cart");

  return (
    <>
      <Wrapper>
        <AddCartButton
          className="addToCart"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleFunction(e, item);
            setAddToCart("Added to Cart!");
            setTimeout(() => {
              setAddToCart("Add to Cart");
            }, 2000);
          }}
        >
          {addToCart}
        </AddCartButton>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div``;
const AddCartButton = styled.button``;

export default AddToCartButton;
