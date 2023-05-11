import React, { useState, useEffect, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "./Navbar.scss";

//components
import CartProduct from "../CartProduct/CartProduct";
//assets
import logo from "../../assets/logo.png";
import bimg from "../../assets/login_background.jpg";

//others
import Cookies from "universal-cookie";
//metamask
import Web3 from "web3";
import { detectEthereumProvider } from "@metamask/detect-provider";
import { ethers } from "ethers";
import { Nav, Button, Container } from "react-bootstrap";
import Navigation from "./Navbar";
//mui
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

//redux ,api
import { logout } from "../../actions/auth";
import { getCurrentCart } from "../../actions/cart";
import { createCart } from "../../actions/cart";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#ffffff",
  border: "1px solid #ff5e00",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#ff5e00",
  fontFamily: "Inter",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const admin = useSelector((state) => state.admin);

  const cart = useSelector((state) => state.cart.cart);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isloading = useSelector((state) => state.auth.loading);
  const path = window.location.pathname;
  let navhide = "";
  if (path === "/login" || path === "/signup" || path === "/termconditions") {
    navhide = true;
  }

  const [totalPrice, settotalPrice] = useState(0);

  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  let primarycolor = useState(
    getComputedStyle(document.documentElement).getPropertyValue(`--primary`) //getting value of primary var from css
  );
  const handleClose = () => setOpen(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const handleLogout = () => {
    handleClose();
    handleMobileMenuClose();
    navigate("/login");
  };
  const AuthLogout = () => {
    handleMenuClose();
    dispatch(logout());
  };
  const handleSignout = () => {
    handleClose();
    handleMobileMenuClose();
    navigate("/signup");
  };
  //----------------------------------------MetaMask Connect
  // MetaMask Login/Connect
  const [account, setAccount] = useState(null);
  const [data, setdata] = useState({
    address: "", // Stores address
    Balance: null, // Stores balance
  });
  const ownhandler = () => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_requestAccounts" }).then((res) => {
        // Return the address of the wallet
        console.log(res);
      });
    } else {
      alert("install metamask extension!!");
    }
    window.ethereum
      .request({
        method: "eth_getBalance",
        params: [data.address, "latest"],
      })
      .then((balance) => {
        // Return string value to convert it into int balance
        console.log(balance);

        // Yarn add ethers for using ethers utils or
        // npm install ethers
        console.log(ethers.utils.formatEther(balance));
        // Format the string into main latest balance
      });
  };
  const web3Handler = async () => {
    /*  window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(() => {
        // User has authorized the connection
        // You can now interact with their wallet
      })
      .catch((err) => {
        // User has rejected the connection request
        console.error(err);
      }); */
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Set signer
    const signer = provider.getSigner();

    window.ethereum.on("chainChanged", (chainId) => {
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", async function (accounts) {
      setAccount(accounts[0]);
      await web3Handler();
    });
    // loadContracts(signer);
  };

  //----------------------------------------MetaMask Connect
  useEffect(() => {
    if (isAuthenticated && auth.loading === false) {
      dispatch(getCurrentCart());
    }
    if (isAuthenticated && auth.loading === false && !cart) {
      dispatch(createCart());
    }
  }, [auth]);
  useEffect(() => {
    let price = 0;
    if (cart) {
      cart.items.forEach((element) => {
        price = price + element.productprice * element.productquantity;
      });
    }

    settotalPrice(price);
  }, [cart]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "35%",
    height: "auto",
    maxHeight: "600px",
    background: "#ffffff",
    border: `2px solid ${primarycolor[0]}`,
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    padding: "15px",
    overflowY: "auto",
    overflowX: "hidden",
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      style={{ zIndex: "10000" }}
    >
      <MenuItem
        onClick={() => {
          handleMenuClose();
          handleMobileMenuClose();
          navigate("/profile");
        }}
        style={{ fontFamily: "Inter" }}
      >
        Profile
      </MenuItem>
      <MenuItem style={{ fontFamily: "Inter" }} onClick={AuthLogout}>
        Log Out
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenuAuth = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle className="navicons" sx={{ fontSize: "30px" }} />
        </IconButton>
        <p style={{ fontFamily: "Inter", fontSize: "20px", margin: "0" }}>
          Profile
        </p>
      </MenuItem>

      <MenuItem
        style={{ display: `${!isAuthenticated ? "none" : ""}` }}
        onClick={handleOpen}
      >
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <ShoppingCartIcon className="navicons" sx={{ fontSize: "30px" }} />
        </IconButton>
        <p style={{ fontFamily: "Inter", fontSize: "20px", margin: "0" }}>
          Cart
        </p>
      </MenuItem>
    </Menu>
  );
  const renderMobileMenuGuest = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleSignout}>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <PersonAddAlt1Icon className="navicons" sx={{ fontSize: "30px" }} />
        </IconButton>
        <p style={{ fontFamily: "Inter", fontSize: "20px", margin: "0" }}>
          Sign up
        </p>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <LoginIcon className="navicons" sx={{ fontSize: "30px" }} />
        </IconButton>
        <p style={{ fontFamily: "Inter", fontSize: "20px", margin: "0" }}>
          Log in
        </p>
      </MenuItem>
      <MenuItem
        style={{
          display: `${navhide ? "none" : ""}`,
          display: `${!isAuthenticated ? "none" : ""}`,
        }}
        onClick={handleOpen}
      >
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <ShoppingCartIcon className="navicons" sx={{ fontSize: "30px" }} />
        </IconButton>
        <p style={{ fontFamily: "Inter", fontSize: "20px", margin: "0" }}>
          Cart
        </p>
      </MenuItem>
    </Menu>
  );
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", () =>
        setScroll(window.pageYOffset > 10)
      );
    }
  }, []);

  //Redirect if logged in
  const checkAuth = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      handleClose();
      handleMobileMenuClose();
      navigate("/checkout/false");
    } else {
      handleLogout();
    }
  };

  const AuthLinks = (
    <Box sx={{ display: { xs: "none", md: "flex" } }}>
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
        color="inherit"
      >
        <AccountCircle
          className="navicons"
          sx={{ fontSize: "30px", marginRight: "10px" }}
        />
      </IconButton>

      <Nav>
        {account ? (
          <Nav.Link
            href={`https://etherscan.io/address/${account}`}
            target="_blank"
            rel="noopener noreferrer"
            className="button nav-button btn-sm mx-4"
          >
            <Button className="navbarwalletaddressbtn" variant="outline-light">
              {account.slice(0, 5) + "..." + account.slice(38, 42)}
            </Button>
          </Nav.Link>
        ) : (
          /*  <Button onClick={web3Handler} variant="outline-light">
            Connect Wallet
          </Button> */
          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
            onClick={web3Handler}
          >
            <AccountBalanceWalletIcon
              className="navicons"
              sx={{ fontSize: "30px" }}
            />
          </IconButton>
        )}
      </Nav>
      <IconButton size="large" aria-label="show 4 new mails" color="inherit">
        <ShoppingCartIcon
          className="navicons"
          sx={{ fontSize: "30px" }}
          onClick={handleOpen}
        />
      </IconButton>
      <Modal open={open} onClose={handleClose}>
        <Box className="CartBox" sx={style}>
          <h1 className="CartBoxh1">Cart</h1>
          {cart ? (
            cart.items.map((item, index) => (
              <CartProduct item={item} key={item._id} />
            ))
          ) : (
            <p className="cartproductp3">No Items in Cart</p>
          )}
          <div className="cartproductd3">
            <p className="cartproductp2">Total </p>
            <p className="cartproductp3">${totalPrice}</p>
          </div>
          <Link onClick={checkAuth} style={{ textAlign: "center" }}>
            <button className="cartcheckoutbtn">CheckOut</button>
          </Link>
        </Box>
      </Modal>
    </Box>
  );

  const GuestLinks = (
    <Box className="NavBox" sx={{ display: { xs: "none", md: "flex" } }}>
      <Link to="/login" className="NavBoxlog">
        Log in
      </Link>
      <Link to="/signup" className="NavBoxsign">
        Sign up
      </Link>
      {/*       <IconButton
        style={{
          display: `${navhide ? "none" : ""}`,
        }}
        size="large"
        aria-label="show 4 new mails"
        color="inherit"
      >
        <ShoppingCartIcon
          className="navicons"
          sx={{ fontSize: "30px" }}
          onClick={handleOpen}
        />
      </IconButton> */}
      <Modal open={open} onClose={handleClose}>
        <Box className="CartBox" sx={style}>
          <h1 className="CartBoxh1">Cart</h1>
          {/*     {cart.cart.map((item, index) => (
            <CartProduct item={item} key={index} />
          ))} */}
          <div className="cartproductd3">
            <p className="cartproductp2">Total </p>
            <p className="cartproductp3">${totalPrice}</p>
          </div>
          <Link onClick={checkAuth} style={{ textAlign: "center" }}>
            <button className="cartcheckoutbtn">CheckOut</button>
          </Link>
        </Box>
      </Modal>
    </Box>
  );
  useEffect(() => {
    if (isAuthenticated && auth.user && auth.loading === false && admin.admin) {
      for (let i = 0; i < admin.admin.length; i++) {
        if (
          auth.user.email === admin.admin[i].email &&
          auth.user.registeration === admin.admin[i].registeration
        ) {
          navigate("/admin/products");
        }
      }
    }
  }, [path]);
  return (
    <>
      <div
        className="Navbar"
        style={{
          boxShadow: `${scroll ? "0px 3px 19px rgba(0, 0, 0, 0.25)" : ""}`,
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <AppBar
            style={{
              backgroundImage: `${navhide ? `url(${bimg})` : ""}`,
              boxShadow: `${navhide ? "0px 3px 19px rgba(0, 0, 0, 0.25)" : ""}`,
            }}
            position="static"
          >
            <Toolbar>
              <Link to="/home">
                <img
                  style={{ width: "120px", height: "40px" }}
                  src={logo}
                  alt=""
                />
              </Link>

              <Search
                style={{
                  display: `${navhide ? "none" : ""}`,
                }}
              >
                <SearchIconWrapper>
                  <SearchIcon className="navicons" />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
              <Box sx={{ flexGrow: 1 }} />

              {!isloading && (
                <Fragment>{isAuthenticated ? AuthLinks : GuestLinks}</Fragment>
              )}
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MenuIcon className="navicons" sx={{ fontSize: "30px" }} />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>

          {!isloading && (
            <Fragment>
              {isAuthenticated ? renderMobileMenuAuth : renderMobileMenuGuest}
            </Fragment>
          )}

          {renderMenu}
        </Box>
      </div>
    </>
  );
};

export default Navbar;
