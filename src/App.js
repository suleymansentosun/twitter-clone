import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import WelcomePage from "./WelcomePage";
import { AuthProvider } from "./AuthContext";
import RequireAuth from "./RequireAuth";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    common: {
      black: "rgb(39, 44, 48)",
      white: "rgb(255, 255, 255)"      
    },
    primary: {
      main: "rgb(29, 155, 240)",
      dark: "rgb(26, 140, 216)",
    },
    secondary: {
      main: "#878A8C",
    },
    divider: "rgb(239, 243, 244)",
    action: {
      active: "rgb(15, 20, 25)",
      disabled: "rgb(142, 205, 248)"
    },
    gray: {
      tweetHover: "rgb(247, 247, 247)",
      hashtag: "rgb(247, 249, 249)",
      hashtagHover: "rgb(239, 241, 241)",
      navigation: "rgb(231, 231, 232)",
      searchBar: "rgb(239, 243, 244)",
    },
    text: {
      primary: "rgb(15, 20, 25)",
      secondary: "rgb(83, 100, 113)"
    },
    background: {
      paper: "rgb(247, 249, 249)"
    }
  },
  typography: {
    htmlFontSize: "16",
    fontFamily: "Helvetica",
    fontSize: "15",
    h1: {
      fontWeight: "700",
      fontSize: "20px",
    },
    h2: {
      fontWeight: "700",
      fontSize: "17px",
    },
    h3: {
      fontWeight: "700",
      fontSize: "15px",
    },
    body1: {
      fontSize: "15px"
    },
    body2: {
      fontSize: "13px",
      color: "rgb(83, 100, 113)"
    },
    body3: {
      fontSize: "15px",
      color: "rgb(83, 100, 113)"
    }
  },
  overrides: {
    MuiOutlinedInput: {
      root: {
        "& $notchedOutline": {
          borderColor: "#CFD9DE",
        },
        "&:hover $notchedOutline": {
          borderColor: "#CFD9DE",
        },
      },
    },
    MuiSvgIcon: {
      fontSizeLarge: {
        fontSize: "1.9rem",
      },
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route
            path="/home"
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
