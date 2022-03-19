import React from "react";
import Popup from "./Popup";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { doc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import db from "./firebase";

const useStyles = makeStyles((theme) => ({
    cancelButton: {
        minWidth: "90%",
        textTransform: "none !important",
        fontWeight: "bold",
        borderRadius: "30px",
        padding: "8px 15px"
    }
}));

function TweetMenuPopup(props) {
  const classes = useStyles();
  const openMenuPopup = props.openTweetMenuPopup;
  const setOpenMenuPopup = props.setOpenTweetMenuPopup;
  const isBelongToAuthUser = props.isBelongToAuthUser;
  const isBelongToFollowedUser = props.isBelongToFollowedUser;
  const isBelongToUnfollowedUser = props.isBelongToUnfollowedUser;
  const tweetId = props.tweetId;
  const authorId = props.authorId; 
  const deleteTweet = async() => {
    const queryForRetweeters = query(
      collection(db, `tweets/${tweetId}/retweets`)
    );
    const retweetersSnapshot = await getDocs(queryForRetweeters);
    if (retweetersSnapshot.docs.length > 0) {
      await Promise.all(
        retweetersSnapshot.docs.map(async (retweeter) => {
          const queryForRetweeterFollowers = query(
            collection(db, `users/${retweeter.id}/followers`)
          );
          const retweeterFollowersSnapshot = await getDocs(
            queryForRetweeterFollowers
          );
          if (retweeterFollowersSnapshot.docs.length > 0) {
            await Promise.all(
              retweeterFollowersSnapshot.docs.map(async (follower) => {
                await deleteDoc(doc(db, `users/${follower.id}/feeds`, tweetId));
              })
            );
          }
        })
      );
    }

    await deleteDoc(doc(db, "tweets", tweetId));

    const relatedRetweets = query(collection(db, "tweets"), where("retweetedTweetId", "==", tweetId));
    const relatedRetweetsSnapshot = await getDocs(relatedRetweets);
    await Promise.all(
      relatedRetweetsSnapshot.docs.map(async (relatedRetweetDoc) => {
        await relatedRetweetDoc.reference.delete();
      })
    );

    await deleteDoc(doc(db, `users/${authorId}/feeds`, tweetId));

    const authorFollowers = query(
      collection(db, `users/${authorId}/followers`)
    );
    const authorFollowersSnapshot = await getDocs(authorFollowers);
    await Promise.all(
      authorFollowersSnapshot.docs.map(async (authorFollowerDoc) => {
        await deleteDoc(doc(db, `users/${authorFollowerDoc.id}/feeds`, tweetId));
      })
    );
  };
  let list;
  if (isBelongToAuthUser) {
    list = (
      <List
        sx={{ width: "100%" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <ListItemButton onClick={deleteTweet}>
          <ListItemIcon sx={{ minWidth: "35px" }}>
            <DeleteOutlineIcon style={{ color: "rgb(252 0 15)" }} />
          </ListItemIcon>
          <ListItemText style={{ color: "rgb(252 0 15)" }} primary="Delete" />
        </ListItemButton>
      </List>
    );
  } else if (isBelongToFollowedUser) {
    list = (
      <List
        sx={{ width: "100%" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <ListItemButton>
          <ListItemIcon sx={{ minWidth: "35px" }}>
            <DeleteOutlineIcon style={{ color: "rgb(252 0 15)" }} />
          </ListItemIcon>
          <ListItemText style={{ color: "rgb(252 0 15)" }} primary="Unfollow" />
        </ListItemButton>
      </List>
    );
  } else if (isBelongToUnfollowedUser) {
    list = (
      <List
        sx={{ width: "100%" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <ListItemButton>
          <ListItemIcon sx={{ minWidth: "35px" }}>
            <DeleteOutlineIcon style={{ color: "rgb(252 0 15)" }} />
          </ListItemIcon>
          <ListItemText style={{ color: "rgb(252 0 15)" }} primary="Follow" />
        </ListItemButton>
      </List>
    );
  }
  return (
    <Popup
      openPopup={openMenuPopup}
      setOpenPopup={setOpenMenuPopup}
      isFullScreen={false}
      align="alignEnd"
      widthAmount="oneHundredPercent"
      marginAmount="zeroMargin"
      roundAmount="thirtyPixel"
      paddingAmount="zeroPixel"
      dialogContentCenter
    >
      {list}
      <Button variant="outlined" size="medium" className={classes.cancelButton} onClick={() => setOpenMenuPopup(false)}>
        Cancel
      </Button>
    </Popup>
  );
}

export default TweetMenuPopup;
