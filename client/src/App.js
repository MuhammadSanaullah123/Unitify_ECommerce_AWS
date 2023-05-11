import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.scss";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";

//USER
import Login from "./userPages/Login";
import SignUp from "./userPages/SignUp";
import TermConditions from "./userPages/TermsConditions";
import Home from "./userPages/Home";
import ProductList from "./userPages/ProductList";
import Product from "./userPages/Product";
import Checkout from "./userPages/Checkout";
import Thankyou from "./userPages/Thankyou";
import Profile from "./userPages/Profile";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import NotFound from "./userPages/NotFound";
//ADMIN
import Products from "./adminPages/Products";

//Redux
import { Provider } from "react-redux"; // connects react with redux by wrapping with provider
import store from "./store";
import Alert from "./components/Alert/Alert";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import PrivateRoute from "./components/routing/PrivateRoute";
import AdminRoute from "./components/routing/AdminRoute";
import { logout } from "./actions/auth";
import { loadAdmin } from "./actions/admin";
const NavLayout = () => (
  <>
    <Outlet />
    <Footer />
  </>
);

const App = () => {
  console.log("Initial state: ", store.getState());
  store.subscribe(() =>
    console.log("State after dispatch: ", store.getState())
  );

  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  useEffect(() => {
    // try to fetch a user, if no token or invalid token we
    store.dispatch(loadUser());
    store.dispatch(loadAdmin());

    // log user out from all tabs if they log out in one tab
    window.addEventListener("storage", () => {
      if (!localStorage.token) store.dispatch(logout());
    });
  }, []);

  return (
    <>
      <Provider store={store}>
        <Router>
          <Navbar />

          <Alert />
          <Routes>
            <Route path="/" element={<NavLayout />}>
              <Route exact path="/" element={<Navigate replace to="/home" />} />
              <Route
                exact
                path="/profile"
                element={<PrivateRoute component={Profile} />}
              />

              <Route exact path="/home" element={<Home />} />
              <Route
                exact
                path="/productlist/:type"
                element={<ProductList />}
              />

              <Route exact path="/product/:product_id" element={<Product />} />

              <Route exact path="/checkout/:check" element={<Checkout />} />
              {/*   <Route
                exact
                path="/checkout"
                element={<PrivateRoute component={Checkout} />}   
              /> */}
              {/*you will goto login page if u try to access checkout page
              and cannot go back even if you click previous page on browser */}
              <Route
                exact
                path="/thankyou"
                element={<PrivateRoute component={Thankyou} />}
              />
            </Route>
            {/*     </Route> */}

            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/termconditions" element={<TermConditions />} />
            <Route exact path="*" element={<NotFound />} />

            <Route
              exact
              path="/admin/products"
              element={<AdminRoute component={Products} />}
            />
            {/*   <Route exact path="/admin/products" element={<Products />} /> */}
          </Routes>
          {/* <Footer /> */}
        </Router>
      </Provider>
    </>
  );
};

export default App;
