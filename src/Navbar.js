import React, { useState } from "react";
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
import Button from "@mui/material/Button";
import { Typography } from "@material-ui/core";
import Popup from "./Popup";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import PostTweetForm from "./PostTweetForm";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useAuth } from "./AuthContext";


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
      paddingLeft: "24px",
    },
    zIndex: "1"
  },
  addTweetButton: {
    padding: "12px",
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.main,
  },
  menus: {
    position: "relative",
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
    [theme.breakpoints.up("lg")]: {
      display: "flex",
      width: "100%",
      "&:hover": {
        "& $link": {
          backgroundColor: theme.palette.gray.navigation,
        },
      },
    },
  },
  nonActiveLink: {
    fontSize: "20px",
    textDecoration: "none",
    color: "rgb(140, 140, 140)",
    opacity: "1",
    fontWeight: "400",
    [theme.breakpoints.up("lg")]: {
      color: "black",
      display: "flex",
      width: "100%",
      "&:hover": {
        "& $link": {
          backgroundColor: theme.palette.gray.navigation,
        },
      },
    },
  },
  twitterIcon: {
    color: theme.palette.primary.main,
    [theme.breakpoints.up("lg")]: {
      padding: "10px",
      borderRadius: "30px",
      marginLeft: "-6px",
      "&:hover": {
        backgroundColor: "#E8F5FD",
      },
      transitionProperty: "background-color",
      transitionDuration: "0.2s",
    },
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
    [theme.breakpoints.up("lg")]: {
      "&:hover": {
        backgroundColor: "#1A8CD8 !important",
      },
      transitionProperty: "background-color",
      transitionDuration: "0.2s",
    },
  },
  addTweetButtonContainer: {
    [theme.breakpoints.down("xs")]: {
      marginRight: "10px",
    },
  },
  name: {
    fontWeight: "700",
    fontSize: "14px !important"
  },
  username: {
    color: theme.palette.text.secondary,
    lineHeight: "1.85",
    fontSize: "14px !important"
  },
  link: {
    [theme.breakpoints.up("lg")]: {
      paddingTop: "4px",
      paddingRight: "24px",
      paddingLeft: "5px",
      borderRadius: "30px",
      width: "auto",
      transitionProperty: "background-color",
      transitionDuration: "0.2s",
    },
  },
  account: {
    [theme.breakpoints.up("lg")]: {
      paddingLeft: "5px",
      paddingRight: "5px",
      borderRadius: "50px",
    },
  },
  accounButton: {
    textTransform: "none !important",
  },
  accountButtonRoot: {
    color: "black !important",
    borderRadius: "50px !important",
    padding: "4x !important",
    "&:hover": {
      backgroundColor: "#E7E7E8 !important",
    },
  },
  logoutButton: {
    textTransform: "none !important",
    color: "black !important",
    fontSize: "15px !important",
  }
}));

function Navbar() {
  const classes = useStyles();
  const smallScreen = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const screenBetweenSmallAndMedium = useMediaQuery("(max-width:705px)");
  const largeScreen = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const [openPostingPopup, setOpenPostingPopup] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { logout, currentUser } = useAuth();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = async () => {
    setAnchorEl(null);
  };

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
            className={classes.account}
          >
            <Grid
              item
              container
              component={Button}
              id="account-button"
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              spacing={1}
              classes={{ root: classes.accountButtonRoot }}
              className={classes.accounButton}
            >
              <Grid
                item
                container
                alignItems="center"
                lg="auto"
                style={{ width: "auto" }}
              >
                <Avatar alt="" src="" />
              </Grid>
              {largeScreen && (
                <Grid
                  item
                  lg
                  container
                  alignItems="flex-start"
                  zeroMinWidth
                  style={{ width: "auto" }}
                  direction="column"
                >
                  <Grid component={Box} lg item style={{ marginTop: "3px" }}>
                    <Typography
                      variant="body1"
                      noWrap
                      component="div"
                      className={classes.name}
                    >
                      { currentUser.name }
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="body1"
                      component="div"
                      className={classes.username}
                    >
                      { currentUser.username }
                    </Typography>
                  </Grid>
                </Grid>
              )}
              {largeScreen && (
                <Grid
                  component={Box}
                  item
                  lg="auto"
                  container
                  alignItems="center"
                  style={{ width: "auto" }}
                  justifySelf="flex-end"
                >
                  <MoreHorizIcon fontSize="small" color="black" />
                </Grid>
              )}
            </Grid>
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
            justifyContent={
              largeScreen ? "flex-start" : smallScreen ? "center" : "flex-end"
            }
            item
            xs={{ xs: "3", lg: "12" }}
          >
            {largeScreen ? (
              <Button
                variant="contained"
                className={classes.tweetButton}
                onClick={() => setOpenPostingPopup(true)}
              >
                Tweet
              </Button>
            ) : (
              <div className={classes.addTweetButton}>
                <AddCircleOutlineIcon
                  style={{ color: "#fff" }}
                  fontSize="large"
                  onClick={() => setOpenPostingPopup(true)}
                />
              </div>
            )}
          </Grid>
        </Grid>
        <Grid
          component={Box}
          item
          container
          spacing={largeScreen ? 2 : 3}
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
              <Grid
                container
                spacing={2}
                alignItems="center"
                className={classes.link}
              >
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
              <Grid
                container
                spacing={2}
                alignItems="center"
                className={classes.link}
              >
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
              <Grid
                container
                spacing={2}
                alignItems="center"
                className={classes.link}
              >
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
              <Grid
                container
                spacing={2}
                alignItems="center"
                className={classes.link}
              >
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
              <Grid
                container
                spacing={2}
                alignItems="center"
                className={classes.link}
              >
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
              <Grid
                container
                spacing={2}
                alignItems="center"
                className={classes.link}
              >
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
              <Grid
                container
                spacing={2}
                alignItems="center"
                className={classes.link}
              >
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
              <Grid
                container
                spacing={2}
                alignItems="center"
                className={classes.link}
              >
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
      <Popup
        openPopup={openPostingPopup}
        setOpenPopup={setOpenPostingPopup}
        isFullScreen={screenBetweenSmallAndMedium ? true : false}
        maxWidth="sm"
        align="alignStart"
        roundAmount={!screenBetweenSmallAndMedium ? "twentyPixel" : null}
        title={
          <Grid container>
            <Grid item>
              <IconButton
                style={{ color: "black", padding: "0px" }}
                onClick={() => setOpenPostingPopup(false)}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        }
      >
        <Grid container xs="auto" sm={12} spacing={2}>
          <Grid item xs="auto">
            <Avatar alt="" src="" />
          </Grid>
          <Grid item xs>
            <PostTweetForm placeholder="What's happening?" type="normal" repliedTweetId={null} repliedUserId={null} afterSubmitAction={setOpenPostingPopup} alignAmountForSubmitButton="TwelvePixelRight" />
          </Grid>
        </Grid>
      </Popup>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "account-button",
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: -7,
            width: "250px",
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 50,
              right: 125,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        <MenuItem style={{ width: "100%", display: "block", padding: "5px" }} onClick={async() => {
            await logout();
          }}>
          <Button className={classes.logoutButton}>Log out</Button>
        </MenuItem>
      </Menu>
    </nav>
  );
}

export default Navbar;
