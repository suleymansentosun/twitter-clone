import React, { useState } from "react";
import "./SignInForm.css";
import { Typography } from "@material-ui/core";
import { useFormik } from "formik";
import * as yup from "yup";
import SignInWithPhone from "./SignInWithPhone";
import Recaptcha from "./Recaptcha";
import db from "./firebase";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import Popup from "./Popup";
import { signUpStyles } from "./SignupForm";

function SignInForm() {
  const classes = signUpStyles();
  const [selectedMembershipOption, setSelectedMembershipOption] =
    useState("email");
  const [recaptchaModalOpen, setRecaptchaModalOpen] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [phoneIsExists, setIsPhoneExists] = useState(false);
  const { setCurrentUser, login } = useAuth();
  const [emailIsExists, setIsEmailExists] = useState(false);
  const possibleMembershipOptions = ["phone", "email"];

  let navigate = useNavigate();

  async function checkIfRegistered(e, registeredInformation) {
    let isExist = null;
    let querySnapshot = await db.collection("users")
    .where(`${registeredInformation}`, "==", e.target.value)
    .get();

    querySnapshot.forEach((doc) => {

      if (registeredInformation == 'phone') {
        setIsPhoneExists(true);
      } else if (registeredInformation == 'email') {
        setIsEmailExists(true);
      }
      
      isExist = true;
    });

    if (isExist) {
      return;
    }

    if (registeredInformation == 'phone') {
      setIsPhoneExists(false);
    } else if (registeredInformation == 'email') {
      setIsEmailExists(false);
    }

    formik.handleBlur(e);
  }

  const formik = useFormik({
    initialValues: {
      phone: "",
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      dummy: yup.string(),
      phone: yup.string().when("dummy", {
        is: (value) => selectedMembershipOption === "phone",
        then: yup
          .string()
          .required("What's your phone number?")
          .min(10, "Phone number must have at least 10 characters"),
        otherwise: yup
          .string()
          .min(10, "Phone number must have at least 10 characters"),
      }),
      email: yup.string().when("dummy", {
        is: (value) => selectedMembershipOption === "email",
        then: yup.string().required("What's your email?").email(),
        otherwise: yup.string().email(),
      }),
      password: yup.string().when("dummy", {
        is: (value) => selectedMembershipOption === "email",
        then: yup
          .string()
          .required("Please type a password")
          .min(6, "Password is too short - should be 6 chars minimum."),
        otherwise: yup
          .string()
          .min(6, "Password is too short - should be 6 chars minimum."),
      }),
    }),
    onSubmit: async (values, setSubmitting) => {
      if (selectedMembershipOption == "phone") {
        setRecaptchaModalOpen(true);
      } else if (selectedMembershipOption == "email") {
        try {
          await login(values.email, values.password);
        } catch {}
      }
      setSubmitting(false);
    },
  });

  let optionalTextField;
  if (selectedMembershipOption == "phone") {
    optionalTextField = (
      <TextField
        id="phone"
        name="phone"
        placeholder="Must have country code without the + sign."
        type="tel"
        label="Phone"
        margin="normal"
        value={formik.values.phone}
        onChange={(e, val) => {
          checkIfRegistered(e, "phone");
          formik.setFieldValue("phone", e.target.value);
        }}
        onBlur={e => {
          checkIfRegistered(e, "phone");
        }}
        helperText={
          formik.values.phone && formik.touched.phone && !phoneIsExists
            ? "The phone has not been registered."
            : ""
        }
        error={ formik.values.phone && formik.touched.phone && !phoneIsExists }
        variant="outlined"
        fullWidth
        className={classes.root}
        InputLabelProps={{
          classes: {
            root: classes.label,
          },
        }}
      ></TextField>
    );
  } else {
    optionalTextField = (
      <TextField
        id="email"
        name="email"
        type="email"
        label="Email"
        margin="normal"
        value={formik.values.email}
        onChange={(e, val) => {
          checkIfRegistered(e, "email");
          formik.setFieldValue("email", e.target.value);
        }}
        onBlur={e => {
          checkIfRegistered(e, "email");
        }}
        helperText={
          formik.values.email && formik.touched.email && !emailIsExists
            ? "The email has not been registered."
            : ""
        }
        error={formik.values.email && formik.touched.email && !emailIsExists}
        variant="outlined"
        fullWidth
        className={classes.root}
        InputLabelProps={{
          classes: {
            root: classes.label,
          },
        }}
      ></TextField>
    );
  }

  return (
    <div className="form__container">
      <Typography variant="h5" component="h3" className={classes.createAccount}>
        Sign in to Twitter
      </Typography>
      <form onSubmit={formik.handleSubmit} className="form">
        <div className="form__body">
          {optionalTextField}
          {selectedMembershipOption == "email" && (
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              margin="normal"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={formik.touched.password ? formik.errors.password : ""}
              error={formik.touched.password && Boolean(formik.errors.password)}
              variant="outlined"
              fullWidth
              className={classes.root}
              InputLabelProps={{
                classes: {
                  root: classes.label,
                },
              }}
            ></TextField>
          )}
          <Link
            onClick={() => {
              setSelectedMembershipOption(
                possibleMembershipOptions.filter(function (x) {
                  return x !== selectedMembershipOption;
                })[0]
              );
              formik.values[selectedMembershipOption] = "";
              setIsPhoneExists(false);
              setIsEmailExists(false);
            }}
            color="primary"
            className={classes.switchField}
          >
            Use{" "}
            {
              possibleMembershipOptions.filter(function (x) {
                return x !== selectedMembershipOption;
              })[0]
            }{" "}
            instead
          </Link>
        </div>
        <Button
          className={classes.submitButton}
          id="sign-up-button"
          color="secondary"
          variant="contained"
          fullWidth
          size="large"
          type="submit"
          style={{ textTransform: "none" }}
          disabled={
            formik.values[selectedMembershipOption] == "" ? true : false ||
            selectedMembershipOption == 'phone' ? !phoneIsExists : selectedMembershipOption == 'email' ? !emailIsExists : false
          }
        >
          Sign in
        </Button>
      </form>
      <Popup
        openPopup={recaptchaModalOpen}
        isFullScreen={false}
        PaperProps={{
          style: {
            borderRadius: 15,
            width: 310,
            height: 255,
            paddingLeft: 4,
            paddingRight: 4,
            paddingTop: 8,
          },
        }}
        title={
          confirmationResult ? (
            <div>
              <h1 style={{ fontSize: "19px" }}>Verify phone</h1>
              <p
                style={{
                  fontSize: "14px",
                  marginTop: "4px",
                  color: "rgb(83, 100, 113)",
                  lineHeight: "1.5",
                }}
              >
                Enter it below to verify {formik.values.phone}
              </p>
            </div>
          ) : (
            <div>
              <h1 style={{ fontSize: "19px" }}>Verify phone</h1>
              <p
                style={{
                  fontSize: "14px",
                  marginTop: "4px",
                  color: "rgb(83, 100, 113)",
                  lineHeight: "1.5",
                }}
              >
                We'll text your verification code to {formik.values.phone}.
                Standard SMS fees may apply.
              </p>
            </div>
          )
        }
      >
        {confirmationResult ? (
          <SignInWithPhone
            confirmationResult={confirmationResult}
            formValues={formik.values}
          />
        ) : (
          <Recaptcha
            formValues={formik.values}
            setConfirmationResult={setConfirmationResult}
            setRecaptchaModalOpen={setRecaptchaModalOpen}
          />
        )}
      </Popup>
    </div>
  );
}

export default SignInForm;
