import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ethers } from "ethers";
//web3
import Web3 from "web3";
//components

import CartProduct from "../components/CartProduct/CartProduct";

//assets
import plane from "./../assets/plane.svg";

//mui
import DeleteIcon from "@mui/icons-material/Delete";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
//redux,mui
import { addHistory } from "../actions/profile";
import { getCurrentProfile } from "../actions/profile";
import { sendEmail } from "../actions/profile";
import { makePayment } from "../actions/profile";
import { loadUser } from "../actions/auth";
const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [finalethersprice, setFinalEthersPrice] = useState("");

  const cart = useSelector((state) => state.cart.cart);
  //const items = useSelector((state) => state.cart.cart.items);

  const profile = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);

  const [totalPrice, settotalPrice] = useState(0);
  const [name, setName] = useState(
    !profile.loading && auth.isAuthenticated ? profile.profile.name : ""
  );
  const [email, setEmail] = useState(
    !profile.loading && auth.isAuthenticated ? profile.profile.email : ""
  );
  const [addresses, setAddresses] = useState([
    !profile.loading && auth.isAuthenticated ? profile.profile.address : "",
  ]);
  const [modaladdress, setmodalAddress] = useState();
  const [address, setAddress] = useState();
  const [ethersprice, setEthersPrice] = useState("0.1");

  const [FinalAddressIndex, setFinalAddressIndex] = useState();
  const [billing, setBilling] = useState("");
  const [cvc, setCvc] = useState("");
  const [crypto, setCrypto] = useState();
  console.log("Crypto is");
  console.log(crypto);

  const [open, setOpen] = useState(false);
  const [openaddress, setOpenAddress] = useState(false);

  const checkoutSubmit = () => {
    let items = cart.items;
    let userId = auth.user._id;
    if (crypto === "" && !cart) {
      alert("Select one payment method!");
    }
    if (crypto === false) {
      dispatch(makePayment({ items, userId }));
    }
    if (crypto === true) {
      handleCryptoCheckout();
    }
    if (crypto !== true && crypto !== false) {
      alert("Select one payment method!");
    }
  };
  const { check } = useParams();

  useEffect(() => {
    if (check === "true" && cart && profile.profile) {
      let items = cart.items;
      let { name, email, address } = profile.profile;
      dispatch(addHistory({ name, email, address, items }));
      setOpen(true);
      dispatch(sendEmail({ name, email }));
      redirect_Page();
    }
  }, [cart]);

  const handleOpenAddress = () => {
    setOpenAddress(true);
  };
  const handleClose = () => setOpen(false);
  const handleCloseAddress = () => setOpenAddress(false);

  let redirect_Page = () => {
    let tID = setTimeout(function () {
      window.location.href = "http://localhost:3000/thankyou";
      window.clearTimeout(tID); // clear time out.
    }, 3000);
  };
  const Submit = () => {
    setAddresses([...addresses, modaladdress]);
    handleCloseAddress();
  };
  const Remove = (index) => {
    var array = [...addresses];
    array.splice(index, 1);
    setAddresses(array);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "650px",
    height: "141px",
    borderRadius: "6px",
    paddingLeft: "15px",
    display: "flex",
    flexDirection: "column",
  };
  const styleaddress = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "650px",
    height: "200px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    padding: "10px",
  };
  useEffect(() => {
    let price = 0;
    if (cart) {
      cart.items.forEach((element) => {
        price = price + element.productprice * element.productquantity;
      });
    }

    settotalPrice(price);
  }, [cart]);
  useEffect(() => {
    dispatch(getCurrentProfile());
    /*  setEmail([
      !profile.loading && auth.isAuthenticated ? profile.profile.address : "",
    ]); */
  }, [profile.loading]);

  const web3 = new Web3(window.ethereum);

  const amount = web3.utils.toWei(
    (totalPrice / ethersprice).toString(),
    "ether"
  );
  const data = "0x";

  const handleCryptoCheckout = async (e) => {
    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      const txHash = await web3.eth.sendTransaction(
        {
          from: account,
          to: "0xbab7E3229ca5252fAb4Dd0dF6195289E2Cd4AF7b",
          value: amount,
          data: data,
        },
        (error, transactionHash) => {
          if (error) {
            console.error(error);
          } else {
            console.log(transactionHash);
          }
        }
      );

      console.log(`Transaction hash: ${txHash}`);
      // Listen for the transaction confirmation
      web3.eth.getTransactionReceipt(txHash.transactionHash, (err, receipt) => {
        if (err) {
          console.error(err);
          return;
        }

        // Transaction confirmed, do something with the receipt
        console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
        navigate("/checkout/true");
        window.location.reload();
      });
    } catch (error) {
      console.error(`Error: ${error.message}`);
      console.error(error.stack);
    }
  };
  useEffect(() => {
    console.log("INSIDEEEEEEEEEEE");
    async function fetchPrice() {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await response.json();
      setEthersPrice(data.ethereum.usd);
    }
    fetchPrice();
  }, []);
  console.log("ETHRES PRICE ");
  console.log(totalPrice);

  useEffect(() => {
    console.log("LSETE");
    let temp = totalPrice / ethersprice;
    temp = temp.toString().slice(0, 8);
    setFinalEthersPrice(temp);
  });

  return (
    <>
      <div className="Checkout">
        <div className="checkoutinfo">
          <h6 className="checkoutinfoh1">Required Info</h6>

          <div className="checkoutinfod1">
            <div className="checkoutinfod3">
              <p className="checkoutinfolabel">Name</p>
              <TextField
                className="filled-basic1"
                value={
                  !profile.loading &&
                  auth.isAuthenticated &&
                  profile.profile.name
                }
                onChange={(e) => setName(e.target.value)}
                variant="filled"
              />
            </div>
            <div className="checkoutinfoverl1"></div>
            <div className="checkoutinfod3">
              <p className="checkoutinfolabel">Email</p>

              <TextField
                className="filled-basic2"
                value={
                  !profile.loading &&
                  auth.isAuthenticated &&
                  profile.profile.email
                }
                onChange={(e) => setEmail(e.target.value)}
                variant="filled"
              />
            </div>
          </div>
          <h1 className="checkoutinfoh1">Select Address</h1>
          <div className="checkoutinfod2">
            <TextField
              className="filled-basic2"
              value={
                !profile.loading &&
                auth.isAuthenticated &&
                profile.profile.address
              }
              onChange={(e) => setAddress(e.target.value)}
              variant="filled"
            />
            {/*       {addresses.map((addrs, index) => (
              <>
                <p
                  style={{
                    width: "95%",
                    textAlign: "start",
                    marginTop: "0",
                  }}
                  className="checkoutinfolabel"
                >
                  Address #{index + 1}
                </p>
                <div
                  style={{
                    display: "flex",
                    margin: "0 0 10px 0",
                    alignItems: "center",
                  }}
                >
                  <button
                    className={`${
                      index === FinalAddressIndex
                        ? "addressreadonlybtnactive"
                        : "addressreadonlybtn"
                    }`}
                    onClick={(e) => {
                      setAddress(e.target.innerText);
                      setFinalAddressIndex(index);
                    }}
                  >
                    {addrs}
                  </button>

                  <DeleteIcon
                    onClick={() => Remove(index)}
                    className="deleteicon"
                  />
                </div>
              </>
            ))} */}

            {/* <span onClick={handleOpenAddress} className="checkoutinfod2s1">
              <AddCircleOutlineOutlinedIcon className="addicon" />
              <p className="checkoutinfod2p1">Add Address</p>
            </span> */}
            <Modal
              open={openaddress}
              onClose={handleCloseAddress}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="addressBox" sx={styleaddress}>
                <textarea
                  className="addressBoxinput"
                  placeholder="Write your address here..."
                  type="text"
                  value={modaladdress}
                  onChange={(e) => setmodalAddress(e.target.value)}
                />
                <button onClick={Submit} className="addressBoxbtn">
                  Submit
                </button>
              </Box>
            </Modal>
          </div>
          <h1
            style={{
              margin: "30px 0 10px 20px",
            }}
            className="checkoutinfoh1"
          >
            Choose Payment Method
          </h1>
          <div className="checkoutinfod1">
            <div className="checkoutinfod1radioparent">
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value="Visa"
                  checked={crypto === false ? true : false}
                  onClick={() => setCrypto(false)}
                  control={<Radio />}
                  label=""
                />
              </RadioGroup>
              <h1 className="checkoutinfod1radioparenth1">VISA</h1>
            </div>

            <div
              style={{
                width: "45%",
              }}
              className={`checkoutinfodr ${
                crypto ? "checkoutinfodisable" : ""
              }`}
            >
              <CreditCardIcon className="checkoutcardimg" />
              <p className="checkoutpaymentp1">Card</p>
            </div>

            {/*  <div
              style={{
                width: "45%",
              }}
              className={`checkoutinfodr ${
                crypto ? "checkoutinfodisable" : ""
              }`}
            >
              <p className="checkoutinfolabel">CVC #</p>
              <TextField
                className="filled-basic2"
                value={crypto === false ? cvc : ""}
                onChange={(e) => setCvc(e.target.value)}
                variant="filled"
              />
            </div> */}
          </div>
          <div className="checkoutinfod1">
            <div className="checkoutinfod1radioparent">
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                className="checkoutinfod1radio"
              >
                <FormControlLabel
                  value="Visa"
                  checked={crypto ? true : false}
                  onClick={() => setCrypto(true)}
                  control={<Radio />}
                  label=""
                />
              </RadioGroup>
              <h1 className="checkoutinfod1radioparenth1">Crypto</h1>
            </div>

            <div
              style={{
                width: "45%",
              }}
              className={`checkoutinfodr ${
                crypto === false ? "checkoutinfodisable" : ""
              }`}
            >
              <CurrencyBitcoinIcon className="checkoutcardimg" />
              <p className="checkoutpaymentp1">Crypto Coin</p>

              {/*     <TextField
                className="filled-basic1 backimgcrypto"
                value={crypto === true ? billing : ""}
                onChange={(e) => setBilling(e.target.value)}
                variant="filled"
              /> */}
            </div>

            {/* <div
              style={{
                width: "45%",
              }}
              className={`checkoutinfodr ${
                crypto === false ? "checkoutinfodisable" : ""
              }`}
            >
              <p className="checkoutinfolabel">CV #</p>
              <TextField
                className="filled-basic2"
                value={crypto === true ? cvc : ""}
                onChange={(e) => setCvc(e.target.value)}
                variant="filled"
              />
            </div> */}
          </div>
        </div>

        <div className="checkoutpay">
          <h6 className="checkoutpayh1">Payment </h6>
          <div className="checkoutpayd1">
            {cart ? (
              cart.items.map((item) => (
                <CartProduct item={item} key={item._id} />
              ))
            ) : (
              <p className="checkoutpayp3">No Items in Cart</p>
            )}
          </div>

          <div className="checkoutpayd2">
            <p className="checkoutpayp1">Total </p>
            {crypto ? (
              <p className="checkoutpayp2">ETH {finalethersprice}</p>
            ) : (
              <p className="checkoutpayp2">${totalPrice}</p>
            )}
          </div>
        </div>
      </div>
      <div className="checkoutbtndiv">
        <Link className="checkoutbtndivb1" onClick={checkoutSubmit}>
          Check Out
        </Link>
        {/* <button onClick={handleCryptoCheckout}>Checkout by Crypto</button> */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="confirmationBox" sx={style}>
            <img className="checkoutbtndivimg1" src={plane} alt="" />
            <p className="checkoutbtndivp1">
              Confirmation will be sent to your email address
            </p>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default Checkout;
