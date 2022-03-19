import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { useFormik } from "formik";
import * as yup from "yup";
import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Alert from '@material-ui/lab/Alert';
import { fetchUserDocument } from "./firebase";
import { useAuth } from "./AuthContext";

const useStyles = makeStyles((theme) => ({
  submitButton: {
    marginTop: "15px",
    borderRadius: "30px",
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

function SignInWithPhone(props) {
  const classes = useStyles();
  const confirmationResult = props.confirmationResult;
  const formValues = props.formValues;
  const [error, setError] = useState(null);
  const { setCurrentUser } = useAuth();

  const formik = useFormik({
    initialValues: {
      verificationCode: "",
    },
    validationSchema: yup.object({
      verificationCode: yup.string(),
    }),
    onSubmit: (values, setSubmitting) => {
      verifyCode(values.verificationCode, formValues);
      setSubmitting(false);
    },
  });

  const verifyCode = async (code, values) => {
    try {
      let result = await confirmationResult.confirm(code);
      let user = result.user;
      const newUser = await fetchUserDocument(user, {values});
      setCurrentUser(newUser);
    } catch(error) {
      setError( {error} );
    }
  };

  if (error) {
    return <Alert severity="error">Incorrect verification code</Alert>
  }

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="form">
        <TextField
          value={formik.values.verificationCode}
          label="Verification code"
          id="verificationCode"
          name="verificationCode"
          type="text"
          size="small"
          error={false}
          variant="outlined"
          margin="normal"
          fullWidth
          autoFocus
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          FormHelperTextProps={{ classes: { root: classes.helperText } }}
          className={classes.root}
        />
        <Button
          className={classes.submitButton}
          id="send-verification"
          color="secondary"
          variant="contained"
          fullWidth
          size="medium"
          type="submit"
          style={{ textTransform: "none" }}
          disabled={
            formik.values.verificationCode == "" ? true : false
          }
        >
          Send
        </Button>
      </form>
    </div>
  );
}

export default SignInWithPhone;
