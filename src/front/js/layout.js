import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext, { Context } from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import Login from "./pages/login";
import Register from "./pages/register";
import Private from "./pages/private";

const Layout = () => {
  const { store } = useContext(Context);
  const basename = process.env.BASENAME || "";

  const isAuthenticated = () => {
    if (store.token) {
      return true;
    }
    return false;
  };

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          {isAuthenticated() == true && <Navbar />}
          <Routes>
            <Route
              element={
                isAuthenticated() ? (
                  <Navigate to="/private" />
                ) : (
                  <Navigate to="/login" />
                )
              }
              path="/"
            />
            <Route
              element={
                isAuthenticated() ? <Navigate to="/private" /> : <Login />
              }
              path="/login"
            />
            <Route
              element={
                isAuthenticated() ? <Navigate to="/private" /> : <Register />
              }
              path="/register"
            />
            <Route
              element={
                isAuthenticated() ? <Private /> : <Navigate to="/login" />
              }
              path="/private"
            />
            <Route element={<h1>Not found!</h1>} />
          </Routes>
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
