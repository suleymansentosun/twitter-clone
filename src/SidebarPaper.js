import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  customPaper: {
    backgroundColor: "rgb(247, 249, 249) !important",
    borderRadius: "16px !important",
    padding: "15px"
  },
}));

function SidebarPaper(props) {
  const classes = useStyles();
  return (
    <Grid item md={12} container>
      <Grid item md={12}>
        <Paper elevation={0} md={12} classes={{root: classes.customPaper}}>
            {props.children}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default SidebarPaper;
