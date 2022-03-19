import React, { useState, useRef, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";
import "./Recaptcha.css";
import { auth } from "./firebase";
import { RecaptchaVerifier } from "firebase/auth";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useAuth } from "./AuthContext";

const useStyles = makeStyles((theme) => ({
  recaptchaButton: {
    marginBottom: "12px",
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: "18px",
    padding: "8px",
    "&:hover": {
      background: "#272C30",
      border: "none",
    },
  },
  editButton: {
    backgroundColor: "#fff",
    color: "#000",
    fontWeight: "bold",
    textTransform: "none",
    borderRadius: "18px",
    padding: "8px",
    boxShadow: "none",
    border: "1px solid #d3d3d3",
    "&:hover": {
      background: "#E7E7E8",
      border: "none",
    },
    "&:hover": {
      outline: "none",
    },
  },
}));

function Recaptcha(props) {
  const { setConfirmationResult, formValues, setRecaptchaModalOpen } = props;
  const classes = useStyles();
  const [recaptcha, setRecaptcha] = useState(null);
  const element = useRef(null);
  const { signupWithPhone } = useAuth();

  const phoneNumber = `+${formValues.phone}`;

  useEffect(() => {
    const recaptchaVerifier = new RecaptchaVerifier(
      element.current,
      {
        size: "invisible",
      },
      auth
    );

    recaptchaVerifier.verify().then(() => setRecaptcha(recaptchaVerifier));
  }, []);

  const signInWithPhoneNumber = async () => {
    setConfirmationResult(
      await signupWithPhone(phoneNumber, recaptcha, formValues)
    );
  };

  return (
    <>
      {recaptcha ? (
        <div className="button__container">
          <Button
            variant="contained"
            className={classes.recaptchaButton}
            id="sign-in-button"
            onClick={signInWithPhoneNumber}
          >
            Ok
          </Button>
          <Button variant="contained" className={classes.editButton}
          onClick={() => setRecaptchaModalOpen(false)}>
            Edit
          </Button>
        </div>
      ) : (
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <CircularProgress />
        </div>
      )}
      <div ref={element}></div>
    </>
  );
}

export default Recaptcha;
