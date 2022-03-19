import React, { useEffect, useState } from "react";
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from '@mui/material/InputAdornment';
import Grid from "@material-ui/core/Grid";

const SearchTextField = styled((props) => (
  <TextField InputProps={{ disableUnderline: true }} {...props} />
))(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    overflow: "hidden",
    borderRadius: 60,
    backgroundColor: "rgb(239, 243, 244)",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    width: "100%",
    height: "45px",
    padding: "20px",
    "& fieldset": {
      borderWidth: "0px",
    },
    "&.Mui-focused": {
      backgroundColor: "transparent",
    },
    '&.Mui-focused fieldset': {
      border: "1px solid",
      borderColor: 'rgb(29, 155, 240)',
    },
    "& input::placeholder": {
      fontSize: "15px",
      color: "black",
      opacity: "0.7",
    }
  },
}));

function SearchInput() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Grid item md="auto">
      <Box component="form">
        <SearchTextField
          id="reddit-input"
          variant="outlined"
          placeholder="Search Twitter"
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: isFocused ? 'rgb(29, 155, 240)' : 'rgb(83, 100, 113)' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Grid>
  );
}

export default SearchInput;
