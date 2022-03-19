import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  alignStartScrollPaper: {
    alignItems: "flex-start",
  },
  alignEndScrollPaper: {
    alignItems: "flex-end",
  },
  justifyStartScrollPaper: {
    justifyContent: "flex-start",
  },
  twentyPixelRounded: {
    "& .MuiPaper-rounded": {
      borderRadius: "20px",
    },
  },
  zeroPixelRounded: {
    "& .MuiPaper-rounded": {
      borderRadius: "0px",
    },
  },
  thirtyPixelRounded: {
    "& .MuiPaper-rounded": {
      borderTopRightRadius: "30px",
      borderTopLeftRadius: "30px",
      borderBottomRightRadius: "0px",
      borderBottomLeftRadius: "0px",
    },
  },
  zeroMarginPaper: {
    margin: "0px",
  },
  twoHundredAndEightyPixelWidth: {
    width: "280px",
  },
  oneHundredPercentWidth: {
    width: "100%",
  },
  zeroPaddingAmount: {
    padding: "11px 15px",
  },
  zeroPixelPaddingAmount: {
    padding: "0px",
  }
}));

function Popup(props) {
  const Title = props.title;
  const {
    isFullScreen,
    children,
    openPopup,
    PaperProps,
    maxWidth,
    align,
    justify,
    roundAmount,
    marginAmount,
    paddingAmount,
    widthAmount,
    transition,
    dialogContentCenter
  } = props;
  const classes = useStyles();

  return (
    <Dialog
      fullScreen={isFullScreen}
      open={openPopup}
      PaperProps={PaperProps}
      fullWidth
      maxWidth={maxWidth}
      TransitionComponent={transition ? Transition : undefined}
      classes={{
        scrollPaper: `${classes[align + "ScrollPaper"]} ${
          classes[justify + "ScrollPaper"]
        }`,
        root: classes[roundAmount + "Rounded"],
        paper: classes[marginAmount + "Paper"],
        paperFullWidth: classes[widthAmount + "Width"],
      }}
    >
      <DialogTitle classes={{ root: classes[paddingAmount + "PaddingAmount"] }}>{Title}</DialogTitle>
      <DialogContent style={dialogContentCenter ? { textAlign: "center" } : {}} classes={{ root: classes[paddingAmount + "PaddingAmount"] }}>{children}</DialogContent>
    </Dialog>
  );
}

export default Popup;
