import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Typography } from "@material-ui/core";
import { doc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import db from "./firebase";

function TweetMenuBox(props) {
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
                await deleteDoc(doc(db, `users/${follower.id}/feeds`, retweeter.data().retweetId));
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
        await deleteDoc(doc(db, "tweets", `${relatedRetweetDoc.id}`));
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
  let menuItems;
  if (isBelongToAuthUser) {
    menuItems = (
      <React.Fragment>
        <MenuItem sx={{ padding: "15px 20px !important" }} onClick={deleteTweet}>
          <ListItemIcon sx={{ minWidth: "30px !important" }}>
            <DeleteOutlineIcon
              fontSize="small"
              style={{ color: "rgb(252 0 15)" }}
            />
          </ListItemIcon>
          <Typography style={{ color: "rgb(252 0 15)", marginTop: "1px" }}>
            Delete
          </Typography>
        </MenuItem>
      </React.Fragment>
    );
  } else if (isBelongToFollowedUser) {
    menuItems = (
      <React.Fragment>
        <MenuItem>
          <ListItemIcon sx={{ minWidth: "30px !important" }}>
            <DeleteOutlineIcon
              fontSize="small"
              style={{ color: "rgb(252 0 15)" }}
            />
          </ListItemIcon>
          <Typography style={{ color: "rgb(252 0 15)", marginTop: "1px" }}>
            Unfollow
          </Typography>
        </MenuItem>
      </React.Fragment>
    );
  } else if (isBelongToUnfollowedUser) {
    menuItems = (
      <React.Fragment>
        <MenuItem>
          <ListItemIcon sx={{ minWidth: "30px !important" }}>
            <DeleteOutlineIcon
              fontSize="small"
              style={{ color: "rgb(252 0 15)" }}
            />
          </ListItemIcon>
          <Typography style={{ color: "rgb(252 0 15)", marginTop: "1px" }}>
            Follow
          </Typography>
        </MenuItem>
      </React.Fragment>
    );
  }
  return (
    <Menu
      anchorEl={props.anchorEl}
      id="tweet-menu-button"
      open={props.open}
      onClose={props.onClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "& .MuiList-root": {
            padding: "0px",
          }
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      {menuItems}
    </Menu>
  );
}

export default TweetMenuBox;
