import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import CategoryPage from "./CategoryPage";
import Header from "./Header";
import Products from "./Products";
import ProductDescription from "./ProductDescription";
import UserAccount from "./UserAccount";
import Cart from "./Cart";
import Signup from "./Signup";
import Signin from "./Signin";
import PreCheckout from "./PreCheckout";
import Checkout from "./Checkout";
import GlobalStylesGeneral from "./GlobalStylesGeneral";
import GlobalStylesButtons from "./GlobalStylesButtons";
import GlobalStylesHeader from "./GlobalStylesHeader";
import OrderConfirmation from "./OrderConfirmation";
import Homepage from "./Homepage";
import { Fragment } from "react";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <GlobalStylesGeneral />
        <GlobalStylesButtons />
        <GlobalStylesHeader />
        <Header />

        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Fragment>
            <Route exact path="/products" element={<Products />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/product/:_id" element={<ProductDescription />} />
            <Route path="/account" element={<UserAccount />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/account-check" element={<PreCheckout />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
          </Fragment>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
