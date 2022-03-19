import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";

const useStyles = makeStyles((theme) => ({
  personInfo: {
    width: "auto",
    "&:hover": {
      "& $name": {
        textDecoration: "underline",
      },
    },
    textDecoration: "none",
    color: `${theme.palette.common.black} !important`,
  },
  topicName: {
    fontWeight: "700",
    fontSize: "15px",
  },
  name: {
    fontWeight: "700",
  },
  username: {
    color: theme.palette.text.secondary,
    lineHeight: "1.85",
  },
  followButton: {
    textTransform: "none !important",
    backgroundColor: "black !important",
    fontWeight: "700 !important",
    padding: "4px 18px !important",
    borderRadius: "30px !important",
  },
  link: {
    textDecoration: "none",
    color: `${theme.palette.common.black} !important`,
    "&:hover": {
      backgroundColor: "#EFF1F1 !important",
    },
    transitionProperty: "background-color",
    transitionDuration: "0.2s",
  },
  unfollowButton: {
    textTransform: "none !important",
    borderRadius: "30px !important",
    padding: "4px 18px !important",
    backgroundColor: "transparent !important",
    color: "black !important",
    fontWeight: "700 !important",
    fontSize: "14px !important",
  },
}));

function PersonCanBeFollowed(props) {
  const classes = useStyles();
  return (
    <Grid
      item
      container
      component={Link}
      to="/home"
      className={classes.link}
      justifyContent="space-between"
      alignItems="flex-start"
      spacing={1}
    >
      <Grid
        item
        md={8}
        container
        spacing={1}
        justifyContent="flex-start"
        className={classes.personInfo}
      >
        <Grid item md="auto">
          <Avatar alt="" src="" />
        </Grid>
        <Grid
          item
          md={8}
          container
          component={Link}
          to="/explore"
          direction="column"
          className={classes.personInfo}
        >
          <Grid item md zeroMinWidth>
            <Typography
              variant="body1"
              component="div"
              noWrap
              className={classes.name}
            >
              {props.name}
            </Typography>
          </Grid>
          <Grid item md zeroMinWidth>
            <Typography
              variant="body1"
              component="div"
              noWrap
              className={classes.username}
            >
              {props.username}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item container md={3} justifyContent="flex-end">
        <Grid item>
          <FollowButton toBeFollowedUserId={props.userId} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default PersonCanBeFollowed;
