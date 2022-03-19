import React from "react";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import SidebarPaper from "./SidebarPaper";
import { Button, IconButton } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  trendsHeader: {
    fontSize: "19px !important",
    fontWeight: "800 !important",
  },
  settingsIcon: {
    marginTop: "2px",
  },
  showMore: {
    color: theme.palette.primary.main,
    fontSize: "15px !important",
  },
  icon: {
    marginTop: "-12px !important",
    marginRight: "-12px !important",
    "&:hover": {
      backgroundColor: "#E0E2E3 !important",
      transitionProperty: "background-color",
      transitionDuration: "0.2s",
    },
  },
  showMoreTweets: {
    width: "100%",
    justifyContent: "flex-start",
    padding: "12px !important",
    textTransform: "none !important",
    fontSize: "15px !important",
    color: "rgb(29, 155, 240) !important",
    "&:hover": {
      backgroundColor: "#EFF1F1 !important",
      transitionProperty: "background-color",
      transitionDuration: "0.2s",
    },
  },
  buttonContainer: {
    padding: "0px !important",
  }
}));

function SidebarSection(props) {
  const classes = useStyles();
  return (
    <SidebarPaper>
      <Grid container direction="column" spacing={3}>
        <Grid item container justifyContent="space-between">
          <Grid item>
            <Typography variant="h1" className={classes.trendsHeader}>
              {props.header}
            </Typography>
          </Grid>
          <Grid item className={classes.settingsIcon}>
            {props.canBeSet ? <IconButton className={classes.icon}><SettingsIcon fontSize="small" /></IconButton> : ""}
          </Grid>
        </Grid>
        {props.children}
        <Grid item className={classes.buttonContainer}>
            <Button classes={{ root : classes.showMoreTweets }}>
              Show more
            </Button>
        </Grid>
      </Grid>
    </SidebarPaper>
  );
}

export default SidebarSection;
