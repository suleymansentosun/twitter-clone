import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { makeStyles } from "@material-ui/core/styles";
import {
  onSnapshot,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { auth } from "./firebase";
import db from "./firebase";
import firebase from "firebase/compat/app";

const useStyles = makeStyles((theme) => ({
  followButton: {
    textTransform: "none !important",
    backgroundColor: "black !important",
    fontWeight: "700 !important",
    padding: "4px 18px !important",
    borderRadius: "30px !important",
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

function FollowButton(props) {
  const classes = useStyles();
  const [isFollowed, setIsFollowed] = useState(false);
  const [mouseOutOccuredAtLeastOneTime, setMouseOutOccuredAtLeastOneTime] =
    useState(false);
  const [isHover, setIsHover] = useState(false);
  const increment = firebase.firestore.FieldValue.increment(1);
  const decrement = firebase.firestore.FieldValue.increment(-1);

  const handleFollowRequest = async () => {
    setMouseOutOccuredAtLeastOneTime(false);
    setIsHover(false);
    await setDoc(doc(db, `users/${props.toBeFollowedUserId}/followers`, auth.currentUser.uid), {});
    await setDoc(doc(db, `users/${auth.currentUser.uid}/following`, props.toBeFollowedUserId), {});
    const followingUserRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(followingUserRef, {
      followCount: increment
    });
    const followedUserRef = doc(db, "users", props.toBeFollowedUserId);
    await updateDoc(followedUserRef, {
      followerCount: increment
    });
  }

  const handleUnfollowRequest = async () => {
    await deleteDoc(doc(db, `users/${props.toBeFollowedUserId}/followers`, auth.currentUser.uid));
    await deleteDoc(doc(db, `users/${auth.currentUser.uid}/following`, props.toBeFollowedUserId));
    const followingUserRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(followingUserRef, {
      followCount: decrement
    });
    const followedUserRef = doc(db, "users", props.toBeFollowedUserId);
    await updateDoc(followedUserRef, {
      followerCount: decrement
    });
  }

  useEffect(() => {
    function handleFollowStatusChange(doc) {
      setIsFollowed(doc.exists());
    }
    const unsub = onSnapshot(doc(db, `users/${props.toBeFollowedUserId}/followers`, auth.currentUser.uid), handleFollowStatusChange);
    return function cleanup() {
      unsub();
    }
  }, []);

  let button;
  if (isFollowed && mouseOutOccuredAtLeastOneTime) {
    button = (
      <Button
        size="small"
        variant="contained"
        className={classes.unfollowButton}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={handleUnfollowRequest}
        sx={{
          ":hover": {
            backgroundColor: "#F0DBDD !important",
            color: "#F4212E !important",
          },
        }}
      >
        {isHover ? "Unfollow" : "Following"}
      </Button>
    );
  } else {
    button = (
      <Button
        size="small"
        variant="contained"
        className={classes.followButton}
        onMouseLeave={() => {
          if (isFollowed) setMouseOutOccuredAtLeastOneTime(true);
        }}
        onClick={handleFollowRequest}
      >
        {isFollowed ? "Following" : "Follow"}
      </Button>
    );
  }

  return <div>{button}</div>;
}

export default FollowButton;
