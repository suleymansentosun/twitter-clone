import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { InputAdornment } from "@material-ui/core";
import { Counter } from "./Counter";
import Link from "@material-ui/core/Link";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import "./SignupForm.css";
import SignInWithPhone from "./SignInWithPhone";
import Recaptcha from "./Recaptcha";
import Popup from "./Popup";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import db from "./firebase";
import 'moment-timezone';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const signUpStyles = makeStyles((theme) => ({
  createAccount: {
    fontWeight: "bold",
    fontSize: "23px",
    marginBottom: "1em",
  },
  helperText: {
    marginLeft: "7px",
  },
  submitButton: {
    marginTop: "30px",
    borderRadius: "30px",
    [theme.breakpoints.up("sm")]: {
      marginBottom: "25px",
    },
  },
  switchField: {
    display: "inline-block",
    marginTop: "20px",
    fontSize: "14px",
    cursor: "pointer",
  },
  birtDayHeader: {
    fontWeight: "bold",
    fontSize: "14px",
    marginTop: "25px",
  },
  inform: {
    fontSize: "14px",
    marginBottom: "12px",
  },
  formBody: {
    height: "%90",
  },
  root: {
    "& label.Mui-focused": {
      color: "rgb(29, 155, 240)",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "rgb(29, 155, 240)",
    },
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: "rgb(29, 155, 240)",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "rgb(29, 155, 240)",
      },
      "&.Mui-error fieldset": {
        borderColor: "red",
      },
    },
    "& label.Mui-error": {
      color: "#536471",
    },
  },
}));

function SignupForm() {
  const classes = signUpStyles();

  const { signupWithEmail } = useAuth();

  let navigate = useNavigate();

  const [confirmationResult, setConfirmationResult] = useState(null);

  const [phoneIsExists, setIsPhoneExists] = useState(false);
  const [emailIsExists, setIsEmailExists] = useState(false);

  const [ageOlderThanEighteen, setAgeOlderThanEighteen] = useState(false);

  const possibleMembershipOptions = ["phone", "email"];
  const [selectedMembershipOption, setSelectedMembershipOption] =
    useState("phone");

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      date: null,
    },
    validationSchema: yup.object({
      dummy: yup.string(),
      name: yup.string().required("What's your name?").max(50),
      phone: yup.string().when("dummy", {
        is: (value) => selectedMembershipOption === "phone",
        then: yup
          .string()
          .required("What's your phone number?")
          .matches(phoneRegExp, "Please enter a valid phone number")
          .min(10, "Phone number must have at least 10 characters"),
        otherwise: yup
          .string()
          .matches(phoneRegExp, "Please enter a valid phone number")
          .min(10, "Phone number must have at least 10 characters"),
      }),
      email: yup.string().when("dummy", {
        is: (value) => selectedMembershipOption === "email",
        then: yup.string().required("What's your email?").email(),
        otherwise: yup.string().email(),
      }),
      password: yup.string().when("dummy", {
        is: (value) => selectedMembershipOption === "email",
        then: yup.string().required('Please type a password').min(6, 'Password is too short - should be 6 chars minimum.'),
        otherwise: yup.string().min(6, 'Password is too short - should be 6 chars minimum.')
      }),
      date: yup.date().required(),
    }),
    onSubmit: async (values, setSubmitting) => {
      if (selectedMembershipOption == 'phone') {
        setRecaptchaModalOpen(true);
      } else if (selectedMembershipOption == 'email') {
        try {
          await signupWithEmail(values);
        } catch (err) {
          console.log(err);
        }        
      }
      setSubmitting(false);
    },
  });

  const [hasChanged, setHasChanged] = React.useState(false);

  const [characterCount, setCharacterCount] = React.useState(0);
  const customHandleNameChange = (e, value, setFieldValue) => {
    if (e.target.value.length >= 51) {
      return;
    }
    setFieldValue("name", e.target.value);
    setHasChanged(true);
    setCharacterCount(e.target.value.length);
  };

  const customHandlePhoneChange = (e, value, setIsPhoneExists, setFieldValue) => {
    if (e.target.value.length < 10) {
      setFieldValue("phone", e.target.value);
      return;
    }

    // check if phone has been already saved

    db.collection("users")
      .where("phone", "==", e.target.value)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setIsPhoneExists(true);
          return;
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

      setIsPhoneExists(false);

    setFieldValue("phone", e.target.value);
  };

  const customHandleEmailChange = (e, value, setIsEmailExists, setFieldValue) => {
    db.collection("users")
      .where("email", "==", e.target.value)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setIsEmailExists(true);
          return;
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

      setIsEmailExists(false);

    setFieldValue("email", e.target.value);
  };

  const wasTypedAndDeleted = hasChanged && formik.values.name == "";

  const [recaptchaModalOpen, setRecaptchaModalOpen] = useState(false);

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
        onChange={(e, val) => customHandlePhoneChange(e, val, setIsPhoneExists, formik.setFieldValue)}
        onBlur={formik.handleBlur}
        helperText={phoneIsExists ? "Phone has already been registered." : formik.touched.phone ? formik.errors.phone : ""}
        error={formik.touched.phone && Boolean(formik.errors.phone) || phoneIsExists}
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
        onChange={(e, val) => customHandleEmailChange(e, val, setIsEmailExists, formik.setFieldValue)}
        onBlur={formik.handleBlur}
        helperText={formik.values.email && emailIsExists ? "Email has already been taken." : formik.touched.email ? formik.errors.email : ""}
        error={formik.values.email && emailIsExists ? "Email has already been taken." : formik.touched.email ? formik.errors.email : ""}
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
        Create your account
      </Typography>
      <form onSubmit={formik.handleSubmit} className="form">
        <div className="form__body">
          <TextField
            value={formik.values.name}
            label="Name"
            id="name"
            name="name"
            type="text"
            error={
              (hasChanged &&
                formik.touched.name &&
                Boolean(formik.errors.name)) ||
              wasTypedAndDeleted
                ? true
                : false
            }
            variant="outlined"
            margin="normal"
            fullWidth
            autoFocus
            onChange={(e, val) =>
              customHandleNameChange(e, val, formik.setFieldValue)
            }
            onBlur={formik.handleBlur}
            helperText={
              (hasChanged &&
                formik.touched.name &&
                Boolean(formik.errors.name)) ||
              wasTypedAndDeleted
                ? "What's your name?"
                : ""
            }
            FormHelperTextProps={{ classes: { root: classes.helperText } }}
            className={classes.root}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Counter count={characterCount} />
                </InputAdornment>
              ),
            }}
          />
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
          <div className="birth__day">
            <Typography variant="h6" className={classes.birtDayHeader}>
              Date of birth
            </Typography>
            <Typography component="p" className={classes.inform}>
              This will not be shown publicly. Confirm your own age, even if
              this account is for a business, a pet, or something else.
            </Typography>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                id="date"
                clearable
                placeholder="MM/DD/YYYY"
                disableFuture
                value={formik.values.date}
                onChange={(value) => {
                  if (value > new Date(new Date().setFullYear(new Date().getFullYear() - 18))) {
                    setAgeOlderThanEighteen(true);
                  }
                  formik.setFieldValue("date", value);
                }}
                onBlur={formik.handleBlur}
                format="MM/dd/yyyy"
                error={ageOlderThanEighteen}
                helperText={
                  ageOlderThanEighteen ?
                  "Sorry! You must be over 18." :
                  ""
                }
              />
            </MuiPickersUtilsProvider>
          </div>
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
            Object.keys(formik.errors).length !== 0 ||
            formik.values.date == "" ||
            formik.values[selectedMembershipOption] == "" ||
            phoneIsExists ||
            ageOlderThanEighteen ||
            emailIsExists
          }
        >
          Sign up
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
          <SignInWithPhone confirmationResult={confirmationResult} formValues={formik.values} />
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

export default SignupForm;
