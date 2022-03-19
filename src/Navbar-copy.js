import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import AddCircleOutlineIcon from "@material-ui/icons//AddCircleOutline";
import TwitterIcon from "@mui/icons-material/Twitter";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { NavLink } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Button from '@mui/material/Button';
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down("xs")]: {
      position: "fixed",
      bottom: "0",
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      padding: "15px",
    },
    [theme.breakpoints.up("sm")]: {
      height: "100%",
      paddingTop: "10px",
      paddingLeft: "12px",
      paddingRight: "12px",
      position: "fixed",
      borderRight: `1px solid ${theme.palette.divider}`,
      height: "100%",
      overflow: "auto",
      overflowX: "hidden",
    },
    [theme.breakpoints.up("lg")]: {
      width: "237px",
      paddingLeft: "24px"
    },
  },
  addTweetButton: {
    padding: "12px",
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.main,
  },
  menus: {
    position: "relative",
    zIndex: "1",
    backgroundColor: "rgba(255,255,255,1.00)",
    [theme.breakpoints.down("xs")]: {
      borderTop: "1px solid",
      borderColor: theme.palette.divider,
    },
    [theme.breakpoints.up("sm")]: {
      marginBottom: "17px",
    },
  },
  activeLink: {
    fontSize: "20px",
    color: theme.palette.action.active,
    textDecoration: "none",
    fontWeight: "700",
  },
  nonActiveLink: {
    fontSize: "20px",
    textDecoration: "none",
    color: "rgb(140, 140, 140)",
    opacity: "1",
    fontWeight: "400",
    [theme.breakpoints.up("lg")]: {
      color: "black",
    },
  },
  twitterIcon: {
    color: theme.palette.primary.main,
  },
  avatar: {
    marginTop: "40px",
    paddingBottom: "30px",
  },
  navbar: {
    height: "100%",
  },
  addButtonContainer: {
    [theme.breakpoints.up("lg")]: {
      marginLeft: "-22px",
    },
  },
  menuName: {
    marginBottom: "6px",
  },
  tweetButton: {
    width: "225px",
    height: "50px",
    borderRadius: "30px !important",
    lineHeight: "1.8 !important",
    textTransform: "none !important",
    backgroundColor: `${theme.palette.primary.main} !important`,
    fontWeight: "700 !important",
    padding: "25px 20px",
    fontSize: "17px !important",
  },
  addTweetButtonContainer: {
    [theme.breakpoints.down("xs")]: {
      marginRight: "10px",
    },
  },  
  name: {
    fontWeight: "700",
  },
  username: {
    color: theme.palette.text.secondary,
    lineHeight: "1.85",
  },
}));

function Navbar() {
  const classes = useStyles();
  const smallScreen = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const largeScreen = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  return (
    <nav className={classes.root}>
      <Grid
        className={classes.navbar}
        wrap="nowrap"
        alignItems="center"
        justifyContent="flex-end"
        container
        direction={smallScreen ? "column-reverse" : "column"}
        spacing={smallScreen ? 0 : 4}
      >
        <Grid
          component={Box}
          container
          justifyContent={largeScreen ? "flex-start" : "center"}
          alignItems="flex-end"
          className={classes.avatar}
          item
          sm
          display={{ xs: "none", sm: "flex" }}
        >
          <Grid
            item
            container
            spacing={2}
            justifyContent={largeScreen ? "flex-start" : "center"}
          >
            <Grid item container alignItems="center" lg="auto" style={{ width: "auto" }}>
              <Avatar alt="" src="" />
            </Grid>
            {largeScreen && (
              <Grid item lg container style={{ width: "auto" }} direction="column">
                <Grid component={Box} item style={{ marginTop: "3px" }}>
                  <Typography
                    variant="body1"
                    component="a"
                    className={classes.name}
                  >
                    Süleyman Şentosun
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    variant="body1"
                    component="div"
                    className={classes.username}
                  >
                    @Ssentosun
                  </Typography>
                </Grid>
              </Grid>
            )}
            {largeScreen && <Grid component={Box} item lg="auto" container alignItems="center" style={{ width: "auto" }} justifySelf="flex-end">
              <MoreHorizIcon fontSize="small" color="black" />
            </Grid>}
          </Grid>
        </Grid>
        <Grid
          item
          container
          justifyContent={
            largeScreen ? "flex-start" : smallScreen ? "center" : "flex-end"
          }
          className={classes.addButtonContainer}
        >
          <Grid
            component={Box}
            className={classes.addTweetButtonContainer}
            container
            justifyContent={largeScreen ? "flex-start" : "flex-end"}
            item
            xs={{ xs: "3", lg: "12" }}
          >
            {largeScreen ? (
              <Button variant="contained" className={classes.tweetButton}>
                Tweet
              </Button>
            ) : (
              <div className={classes.addTweetButton}>
                <AddCircleOutlineIcon
                  style={{ color: "#fff" }}
                  fontSize="large"
                />
              </div>
            )}
          </Grid>
        </Grid>
        <Grid
          component={Box}
          item
          container
          spacing={3}
          className={classes.menus}
          direction={smallScreen ? "column" : "row"}
          alignItems={smallScreen ? "center" : "initial"}
        >
          <Grid
            component={Box}
            container
            justifyContent={largeScreen ? "flex-start" : "center"}
            sm
            item
            display={{ xs: "none", sm: "flex" }}
          >
            <NavLink to={"/home"} className={classes.twitterIcon}>
              <TwitterIcon fontSize="large" />
            </NavLink>
          </Grid>
          <Grid
            container
            justifyContent={largeScreen ? "flex-start" : "center"}
            item
            xs={3}
            sm
          >
            <NavLink
              to={"/home"}
              className={({ isActive }) =>
                isActive ? classes.activeLink : classes.nonActiveLink
              }
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <HomeIcon fontSize="large" />
                </Grid>
                <Grid
                  component={Box}
                  item
                  display={{ xs: "none", lg: "flex" }}
                  className={classes.menuName}
                >
                  Home
                </Grid>
              </Grid>
            </NavLink>
          </Grid>
          <Grid
            container
            justifyContent={largeScreen ? "flex-start" : "center"}
            item
            xs={3}
            sm
          >
            <NavLink
              to={"/explore"}
              className={({ isActive }) =>
                isActive ? classes.activeLink : classes.nonActiveLink
              }
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <SearchIcon fontSize="large" />
                </Grid>
                <Grid
                  component={Box}
                  item
                  display={{ xs: "none", lg: "flex" }}
                  className={classes.menuName}
                >
                  Explore
                </Grid>
              </Grid>
            </NavLink>
          </Grid>
          <Grid
            container
            justifyContent={largeScreen ? "flex-start" : "center"}
            item
            xs={3}
            sm
          >
            <NavLink
              to={"/notifications"}
              className={({ isActive }) =>
                isActive ? classes.activeLink : classes.nonActiveLink
              }
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <NotificationsNoneIcon fontSize="large" />
                </Grid>
                <Grid
                  component={Box}
                  item
                  display={{ xs: "none", lg: "flex" }}
                  className={classes.menuName}
                >
                  Notifications
                </Grid>
              </Grid>
            </NavLink>
          </Grid>
          <Grid
            container
            justifyContent={largeScreen ? "flex-start" : "center"}
            item
            xs={3}
            sm
          >
            <NavLink
              to={"/messages"}
              className={({ isActive }) =>
                isActive ? classes.activeLink : classes.nonActiveLink
              }
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <MailOutlineIcon fontSize="large" />
                </Grid>
                <Grid
                  component={Box}
                  item
                  display={{ xs: "none", lg: "flex" }}
                  className={classes.menuName}
                >
                  Messages
                </Grid>
              </Grid>
            </NavLink>
          </Grid>
          <Grid
            component={Box}
            container
            sm
            justifyContent={largeScreen ? "flex-start" : "center"}
            item
            display={{ xs: "none", sm: "flex" }}
          >
            <NavLink
              to={"/bookmarks"}
              className={({ isActive }) =>
                isActive ? classes.activeLink : classes.nonActiveLink
              }
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <BookmarkBorderIcon fontSize="large" />
                </Grid>
                <Grid
                  component={Box}
                  item
                  display={{ xs: "none", lg: "flex" }}
                  className={classes.menuName}
                >
                  Bookmarks
                </Grid>
              </Grid>
            </NavLink>
          </Grid>
          <Grid
            component={Box}
            container
            justifyContent={largeScreen ? "flex-start" : "center"}
            sm
            item
            display={{ xs: "none", sm: "flex" }}
          >
            <NavLink
              to={"/lists"}
              className={({ isActive }) =>
                isActive ? classes.activeLink : classes.nonActiveLink
              }
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <ListAltIcon fontSize="large" />
                </Grid>
                <Grid
                  component={Box}
                  item
                  display={{ xs: "none", lg: "flex" }}
                  className={classes.menuName}
                >
                  Lists
                </Grid>
              </Grid>
            </NavLink>
          </Grid>
          <Grid
            component={Box}
            container
            justifyContent={largeScreen ? "flex-start" : "center"}
            sm
            item
            display={{ xs: "none", sm: "flex" }}
          >
            <NavLink
              to={"/profile"}
              className={({ isActive }) =>
                isActive ? classes.activeLink : classes.nonActiveLink
              }
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <PermIdentityIcon fontSize="large" />
                </Grid>
                <Grid
                  component={Box}
                  item
                  display={{ xs: "none", lg: "flex" }}
                  className={classes.menuName}
                >
                  Profile
                </Grid>
              </Grid>
            </NavLink>
          </Grid>
          <Grid
            component={Box}
            container
            justifyContent={largeScreen ? "flex-start" : "center"}
            sm
            item
            display={{ xs: "none", sm: "flex" }}
          >
            <NavLink
              to={"/more"}
              className={({ isActive }) =>
                isActive ? classes.activeLink : classes.nonActiveLink
              }
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <MoreHorizIcon fontSize="large" />
                </Grid>
                <Grid
                  component={Box}
                  item
                  display={{ xs: "none", lg: "flex" }}
                  className={classes.menuName}
                >
                  More
                </Grid>
              </Grid>
            </NavLink>
          </Grid>
        </Grid>
      </Grid>
    </nav>
  );
}

export default Navbar;
