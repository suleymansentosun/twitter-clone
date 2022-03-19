import React, { useState } from "react";
import "./WelcomePage.css";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { useMediaQuery } from "@material-ui/core";
import Popup from "./Popup";
import SignupForm from "./SignupForm";
import SignInForm from "./SignInForm";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import TwitterIcon from "@material-ui/icons/Twitter";

const useStyles = makeStyles({
  customButton: {
    fontWeight: "bold",
    textTransform: "none",
    borderRadius: "30px",
    width: "300px",
  },
  signInButton: {
    backgroundColor: "#fff",
    color: "#1D9BF0",
    marginBottom: "20px",
    "&:hover": {
      backgroundColor: "#E8F5FD",
    },
  },
  signUpButton: {
    backgroundColor: "#1D9BF0",
    color: "#fff",
    marginBottom: "40px",
    "&:hover": {
      backgroundColor: "#1A8CD8",
    },
  },
  signInWithGoogleButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "300px",
    backgroundColor: "#fff",
    color: "#000",
    "&:hover": {
      backgroundColor: "#E8F5FD",
    },
  },
  twitter_icon: {
    color: "#1D9BF0", 
    fontSize: "38px", 
    position: "absolute", 
    left: "50%", 
    transform: "translateX(-50%)",
    top: "-8px",
  }
});

function WelcomePage() {
  const { currentUser, loginWithGoogle, setCurrentUser } = useAuth();
  const [error, setError] = useState("");
  const classes = useStyles();
  let navigate = useNavigate();
  const [openSignupPopup, setOpenSignupPopup] = useState(false);
  const [openSignInPopup, setOpenSignInPopup] = useState(false);

  if (currentUser) {
    navigate("/home");
  }

  const isLargeScreen = useMediaQuery("(min-width:1000px)");
  const isSmallScreen = useMediaQuery("(max-width:705px)");

  const buttonSize = {
    size: isLargeScreen ? "large" : "medium",
  };

  async function handleSubmit(e) {
    try {
      await loginWithGoogle();
    } catch {
      setError("Failed to log in");
    }
  }

  return (
    <div className="container">
      <div className="main__part">
        <div className="tableau">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="logo">
            <g>
              <path
                fill="#fff"
                d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"
              ></path>
            </g>
          </svg>
        </div>
        <div className="entry__part">
          <div className="entry__operations">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="logo__entryPart"
            >
              <g>
                <path
                  fill="#1D9BF0"
                  d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"
                ></path>
              </g>
            </svg>
            <span className="slogan">Happening now</span>
            <span className="encouragement">Join Twitter today</span>
            <Button
              variant="contained"
              {...buttonSize}
              className={`${classes.customButton} ${classes.signUpButton}`}
              onClick={() => setOpenSignupPopup(true)}
            >
              Sign up with phone or email
            </Button>
            <div className="sign__in">
              <Typography
                style={{
                  fontWeight: 600,
                  fontSize: "17px",
                  marginBottom: "20px",
                }}
              >
                Already have an account?
              </Typography>
              <Button
                variant="contained"
                {...buttonSize}
                className={`${classes.customButton} ${classes.signInButton}`}
                onClick={() => setOpenSignInPopup(true)}
              >
                Sign in with phone or email
              </Button>
              <div className="or__line">
                <div className="line"></div>
                <span style={{ marginBottom: "5px" }}>or</span>
                <div className="line"></div>
              </div>
              <div className="signIn__google">
                <Button
                  variant="contained"
                  {...buttonSize}
                  className={`${classes.signInWithGoogleButton} ${classes.customButton}`}
                  onClick={() => handleSubmit()}
                >
                  <span style={{ marginRight: "10px" }}>
                    <img
                      style={{ width: "20px", marginTop: "6px" }}
                      src="https://image.similarpng.com/very-thumbnail/2020/12/Flat-design-Google-logo-design-Vector-PNG.png"
                      alt=""
                    />
                  </span>
                  <span>Sign in with Google</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="nav__part">
        <ul>
          <li>About</li>
          <li>Help Center</li>
          <li>Terms of Service</li>
          <li>Privacy Policy</li>
          <li>Cookie Policy</li>
          <li>Imprint</li>
          <li>Accessibility</li>
          <li>Ads Info</li>
          <li>Blog</li>
          <li>Status</li>
          <li>Careers</li>
          <li>Brand Resources</li>
          <li>Advertising</li>
          <li>Marketing</li>
          <li>Twitter for Business</li>
          <li>Developers</li>
          <li>Directory</li>
          <li>Settings</li>
          <li>2021 Twitter, Inc.</li>
        </ul>
      </div>
      <Popup
        openPopup={openSignupPopup}
        setOpenPopup={setOpenSignupPopup}
        isFullScreen={isSmallScreen ? true : false}
        title={
          <div className="dialog__header">
            <IconButton style={{ color: "black", padding: "0px" }} onClick={() => setOpenSignupPopup(false)}>
              <CloseIcon />
            </IconButton>
            <TwitterIcon className={classes.twitter_icon} />
          </div>
        }
      >
        <SignupForm />
      </Popup>
      <Popup
        openPopup={openSignInPopup}
        setOpenPopup={setOpenSignInPopup}
        isFullScreen={isSmallScreen ? true : false}
        title={
          <div className="dialog__header">
            <IconButton style={{ color: "black", padding: "0px" }} onClick={() => setOpenSignInPopup(false)}>
              <CloseIcon />
            </IconButton>
            <TwitterIcon className={classes.twitter_icon} />
          </div>
        }
      >
        <SignInForm />
      </Popup>
    </div>
  );
}

export default WelcomePage;
