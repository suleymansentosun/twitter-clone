import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Typography } from "@material-ui/core";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  trendTopic: {
    width: "auto",
  },
  topicName: {
    fontWeight: "700",
    fontSize: "15px",
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
  moreButtonIcon: {    
    marginTop: "-10px !important",
    "&:hover": {
      backgroundColor: "#E1EEF6 !important",
      transitionProperty: "background-color",
      transitionDuration: "0.2s",
    },
  },
  moreIcon: {
    "&:hover": {
      color: `${theme.palette.primary.main} !important`,
    },
  },
}));

function TrendTopic(props) {
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
    >
      <Grid item container direction="column" className={classes.trendTopic}>
        <Grid item>
          <Typography variant="body1" className={classes.topicName}>
            {props.topicName}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2" className={classes.tweetCount}>
            {props.tweetCount} Tweets
          </Typography>
        </Grid>
      </Grid>
      <Grid item>
        <IconButton
          className={classes.moreButtonIcon}
          sx={{ color: "rgb(83, 100, 113)" }}
          classes={{ root: classes.moreIcon }}
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      </Grid>
    </Grid>
  );
}

export default TrendTopic;
