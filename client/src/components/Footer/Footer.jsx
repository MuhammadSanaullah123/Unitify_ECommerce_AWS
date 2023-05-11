import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.scss";

//assets
import logo from "../../assets/logo.png";
import footerfb from "../../assets/footerfb.svg";
import footerinsta from "../../assets/footerinsta.svg";
import footertwitter from "../../assets/footertwitter.svg";
//mui
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const Footer = () => {
  const [path] = useState(window.location.pathname);
  return (
    <>
      <div
        style={{
          marginTop: `${path === "/receipt" ? "0" : "100px"}`,
        }}
        className="Footer"
      >
        <div className="hline"></div>
        <div className="both_img_p">
          <img className="both_img_p_logo" src={logo} alt="" />
          <div className="footerd2">
            <div className="footerrespd1">
              <div className="footerd1">
                <h6 className="footerh6">Trending Searches</h6>
                <a className="footerp" href="!#">
                  Service Providers
                </a>
                <a className="footerp" href="!#">
                  Space Providers
                </a>
              </div>
              <div className="footerd1">
                <h6 className="footerh6">Services</h6>
                <a className="footerp" href="!#">
                  Service Providers
                </a>
                <a className="footerp" href="!#">
                  Space Providers
                </a>
              </div>
            </div>
            <div className="footerrespd2">
              <div className="footerd1">
                <h6 className="footerh6">About Us</h6>
                <Link to="/termconditions" className="footerp">
                  Terms & Conditions
                </Link>
                <a className="footerp" href="!#">
                  About Us
                </a>
              </div>
              <div className="footerd1">
                <h6 className="footerh6">Follow us:</h6>
                <div className="footerimgdiv">
                  <div className="imgcirclediv">
                    <img className="imgcircle" src={footerfb} alt="" />
                  </div>
                  <div className="imgcirclediv">
                    <img className="imgcircle" src={footerinsta} alt="" />
                  </div>
                  <div className="imgcirclediv">
                    <img className="imgcircle" src={footertwitter} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footermobile">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
              >
                <h6 className="footerh6">Trending Searches</h6>
              </AccordionSummary>
              <AccordionDetails className="footermobiled1">
                <a className="footermobilea" href="!#">
                  Service Providers
                </a>
                <a className="footermobilea" href="!#">
                  Space Providers
                </a>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
              >
                <h6 className="footerh6">Services</h6>
              </AccordionSummary>
              <AccordionDetails className="footermobiled1">
                <a className="footermobilea" href="!#">
                  Service Providers
                </a>
                <a className="footermobilea" href="!#">
                  Space Providers
                </a>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
              >
                <h6 className="footerh6">About Us</h6>
              </AccordionSummary>
              <AccordionDetails className="footermobiled1">
                <Link to="/termconditions" className="footermobilea">
                  Terms & Conditions
                </Link>
                <a className="footermobilea" href="!#">
                  About Us
                </a>
              </AccordionDetails>
            </Accordion>
            <div className="footermobilelastdiv">
              <h6 className="footerh6">Follow us:</h6>
              <div className="footerimgdiv">
                <div className="imgcirclediv">
                  <img className="imgcircle" src={footerfb} alt="" />
                </div>
                <div className="imgcirclediv">
                  <img className="imgcircle" src={footerinsta} alt="" />
                </div>
                <div className="imgcirclediv">
                  <img className="imgcircle" src={footertwitter} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
