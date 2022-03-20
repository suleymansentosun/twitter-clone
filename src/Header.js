import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import { Typography } from "@material-ui/core";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import Avatar from "@material-ui/core/Avatar";
import { useAuth } from "./AuthContext";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import PostTweetForm from "./PostTweetForm";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import Popup from "./Popup";
import CloseIcon from "@material-ui/icons/Close";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import Divider from '@mui/material/Divider';
import Button from "@mui/material/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "15px",
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  homePage: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "17px",
    },
  },
  avatar: {
    [theme.breakpoints.down("xs")]: {
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  buttonContainer: {
    marginTop: "-7px !important",
  },
  icon: {
    "&:hover": {
      backgroundColor: "#DADADB !important",
    },
  },
  avatarIconButton: {
    padding: "0px !important",
    [theme.breakpoints.down("xs")]: {
      marginRight: "20px !important",
    },
  },
  avatarInSlideMenu: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  username: {
    color: theme.palette.text.secondary
  },
  credential: {
    textDecoration: "none",
  },
  name: {
    color: theme.palette.text.primary,
  },
  count: {
    marginRight: "3px",
    fontWeight: "700",
  },
  followInformation: {
    color: theme.palette.text.secondary
  },
  followInformationContainer: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
  sliderIcon: {
    marginRight: "7px",
  },
  sliderMenuItem: {
    marginTop: "1px",
    color: "rgb(45 42 42)",
  },
  menuItemLink: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
  logoutButton: {
    textTransform: "none !important",
    color: `${theme.palette.text.primary} !important`,
    fontSize: "15px !important",
    padding: "0px !important"
  }
}));

function Header() {
  const classes = useStyles();
  const smallScreen = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const extraSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const { currentUser, logout } = useAuth();
  const [openMenuPopup, setOpenMenuPopup] = useState(false);

  return (
    <header className={classes.root}>
      <Grid
        container
        justifyContent="flex-start"
        rowSpacing={2}
        alignItems={smallScreen ? "flex-start" : "initial"}
      >
        <Grid
          item
          container={smallScreen ? true : false}
          columnSpacing={2}
          xs="auto"
          sm={12}
          justifyContent="flex-start"
          order={{ xs: 1, sm: 3 }}
        >
          <Grid item sm="auto">
            <IconButton
              component={Link}
              to="/home"
              classes={{ root: classes.avatarIconButton }}
              onClick={extraSmallScreen ? () => setOpenMenuPopup(true) : ""}
            >
              <Avatar
                alt={currentUser.name}
                src=""
                className={classes.avatar}
              />
            </IconButton>
          </Grid>
          <Grid item sm display={{ xs: "none", sm: "flex" }}>
            <PostTweetForm placeholder="What's happening?" type="normal" repliedTweetId={null} repliedUserId={null} afterSubmitAction={null} />
          </Grid>
        </Grid>
        <Grid
          item
          direction={smallScreen ? "column" : "row"}
          container
          justifyContent="flex-start"
          xs
          alignItems={smallScreen ? "flex-start" : "center"}
          order={{ xs: 2, sm: 1 }}
        >
          <Grid item xs={8}>
            <Typography className={classes.homePage} variant="h1">
              Home
            </Typography>
          </Grid>
        </Grid>
        <Grid
          item
          xs="auto"
          sm={2}
          order={{ xs: 3, sm: 2 }}
          container
          justifyContent="flex-end"
          alignItems="center"
        >
          <Grid item className={classes.buttonContainer}>
            <IconButton className={classes.icon}>
              <LowPriorityIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Popup
        openPopup={openMenuPopup}
        setOpenPopup={setOpenMenuPopup}
        isFullScreen={false}
        maxWidth="sm"
        align="alignStart"
        justify="justifyStart"
        roundAmount="zeroPixel"
        marginAmount="zeroMargin"
        paddingAmount="zero"
        transition={true}
        widthAmount="twoHundredAndEightyPixel"
        title={
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h2">Account info</Typography>
            </Grid>
            <Grid item>
              <IconButton
                style={{ color: "black", padding: "0px", paddingBottom: "5px" }}
                onClick={() => setOpenMenuPopup(false)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
        }
      >
        <Grid container direction="column" spacing={2}>
          <Grid
            item
            component={Link}
            to="/explore"
            container
            direction="column"
            spacing={1}
            className={classes.credential}
          >
            <Grid item>
              <Avatar
                alt={currentUser.name}
                src=""
                className={classes.avatarInSlideMenu}
              />
            </Grid>
            <Grid item container direction="column">
              <Typography variant="h3" className={classes.name}>
                { currentUser.name }
              </Typography>
              <Typography variant="body1" className={classes.username}>
              { currentUser.username }
              </Typography>
            </Grid>
          </Grid>
          <Grid item container spacing={1}>
            <Grid
              item
              container
              component={Link}
              to="/explore"
              style={{ width: "auto" }}
              className={classes.followInformationContainer}
            >
              <Typography className={classes.count}>868</Typography>
              <Typography className={classes.followInformation}>
                Following
              </Typography>
            </Grid>
            <Grid
              item
              container
              component={Link}
              to="/explore"
              style={{ width: "auto" }}
              className={classes.followInformationContainer}
            >
              <Typography className={classes.count}>143</Typography>
              <Typography className={classes.followInformation}>
                Followers
              </Typography>
            </Grid>
          </Grid>
          <Grid item container spacing={2} direction="column">
            <Grid item container component={Link} to="/home" className={classes.menuItemLink}>
              <PermIdentityIcon fontSize="medium" className={classes.sliderIcon} />
              <Typography className={classes.sliderMenuItem}>Profile</Typography>
            </Grid>
            <Grid item container component={Link} to="/home" className={classes.menuItemLink}>
              <BookmarkBorderIcon fontSize="medium" className={classes.sliderIcon} />
              <Typography className={classes.sliderMenuItem}>Bookmarks</Typography>
            </Grid>
            <Divider />  
            <Grid item>
              <Button onClick={async() => {
                await logout();
              }} className={classes.logoutButton}>Log out</Button>
            </Grid>         
          </Grid>
        </Grid>
      </Popup>
    </header>
  );
}

export default Header;
