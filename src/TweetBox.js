import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import { Typography } from "@material-ui/core";
import CommentIcon from "@mui/icons-material/Comment";
import LoopIcon from "@mui/icons-material/Loop";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import {
  doc,
  updateDoc,
  runTransaction,
  collection,
  query,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  addDoc,
  where,
} from "firebase/firestore";
import db from "./firebase";
import { auth } from "./firebase";
import firebase from "firebase/compat/app";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Popup from "./Popup";
import CloseIcon from "@material-ui/icons/Close";
import PostTweetForm from "./PostTweetForm";
import TweetMenuPopup from "./TweetMenuPopup";
import TweetMenuBox from "./TweetMenuBox";

const useStyles = makeStyles((theme) => ({
  tweetBoxContainer: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "#F7F7F7 !important",
    },
    transitionProperty: "background-color",
    transitionDuration: "0.2s",
  },
  avatar: {
    position: "static",
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  name: {
    fontWeight: "700",
  },
  time: {
    color: theme.palette.text.secondary,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  username: {
    color: theme.palette.text.secondary,
    lineHeight: "1.85",
  },
  point: {
    color: theme.palette.text.secondary,
  },
  tweetContent: {
    color: theme.palette.text.primary,
  },
  icon: {
    color: theme.palette.text.secondary,
    marginRight: "5px",
  },
  usernameContainer: {
    maxWidth: "max-content",
  },
  avatarContainer: {
    marginRight: "13px",
    width: "auto",
  },
  preInformation: {
    color: theme.palette.text.secondary,
    fontWeight: "700",
  },
  informationContainer: {
    display: "flex",
  },
  tweetInformationContainer: {
    marginLeft: "31px",
  },
  replyLineContainer: {
    width: "3px",
    height: "100%",
    backgroundColor: "rgb(207, 217, 222)",
    marginTop: "2px",
    marginBottom: "2px",
  },
  threadAvatar: {
    position: "static",
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginLeft: "4px",
  },
  goThreadLink: {
    color: theme.palette.primary.main,
  },
  nameAndUsername: {
    textDecoration: "none",
    color: theme.palette.common.black,
    "&:hover": {
      "& $name": {
        textDecoration: "underline",
      },
    },
    width: "auto",
    maxWidth: "85% !important",
  },
  moreButtonIcon: {
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
  tweetActionButton: {
    color: `${theme.palette.text.secondary} !important`,
    backgroundColor: "transparent !important",
    padding: "0px !important",
    "& .MuiButton-startIcon": {
      padding: "10px",
      marginRight: "0px !important",
    },
    minWidth: "auto !important",
    marginLeft: "-5px !important",
  },
  blueAction: {
    "&:hover": {
      color: `${theme.palette.primary.main} !important`,
      "& .MuiButton-startIcon": {
        backgroundColor: "#E1EEF6",
        borderRadius: "30px",
      },
    },
  },
  redAction: {
    "&:hover": {
      color: `#F91880 !important`,
      "& .MuiButton-startIcon": {
        backgroundColor: "#F7E0EB",
        borderRadius: "30px",
      },
    },
  },
  greenAction: {
    "&:hover": {
      color: `#00BA7C !important`,
      "& .MuiButton-startIcon": {
        backgroundColor: "#DEF1EB",
        borderRadius: "30px",
      },
    },
  },
  replyInfo: {
    color: "rgb(83, 100, 113) !important",
  },
  replyToUsername: {
    color: theme.palette.primary.main,
  },
  replyInfoContainer: {
    paddingTop: "15px",
    paddingBottom: "15px",
  },
}));

function TweetBox(props) {
  const classes = useStyles();
  const screenBetweenSmallAndMedium = useMediaQuery("(max-width:705px)");
  const extraSmallScreen = useMediaQuery((theme) =>
    theme.breakpoints.down("xs")
  );
  const increment = firebase.firestore.FieldValue.increment(1);
  const decrement = firebase.firestore.FieldValue.increment(-1);
  const [openReplyPopup, setOpenReplyPopup] = useState(false);
  const [openTweetMenuPopup, setOpenTweetMenuPopup] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [liked, setLiked] = useState(
    props.type == "retweet" ? props.retweetedTweet.liked : props.liked
  );
  const [likeCount, setLikeCount] = useState(props.likeCount);
  const [retweeted, setRetweeted] = useState(
    props.type == "retweet" ? props.retweetedTweet.retweeted : props.retweeted
  );
  const [retweetedCount, setRetweetedCount] = useState(props.retweetCount);
  const [bookmarked, setBookmarked] = useState(
    props.type == "retweet" ? props.retweetedTweet.bookmarked : props.bookmarked
  );
  const isRetweet = props.type == "retweet";
  const isThread =
    props.type == "thread" ||
    (props.retweetedTweet ? props.retweetedTweet.type == "thread" : false);
  let tweetInformation;
  let replyInformation;
  let replyLine;
  let goThreadLink;
  if (isRetweet) {
    tweetInformation = (
      <div className={classes.informationContainer}>
        <LoopIcon className={classes.icon} fontSize="small" />
        <Typography
          variant="body2"
          component="div"
          className={classes.preInformation}
        >
          {props.user.name + " retweeted"}
        </Typography>
      </div>
    );
  }
  if (isThread) {
    replyInformation = (
      <Avatar alt="" src="" className={classes.threadAvatar} />
    );
    replyLine = (
      <Grid item className={classes.replyLineContainer}>
        <div></div>
      </Grid>
    );
    goThreadLink = (
      <Typography
        variant="body1"
        component="p"
        className={classes.goThreadLink}
      >
        Show this thread
      </Typography>
    );
  }

  useEffect(() => {
    setLikeCount(props.likeCount);
  }, [props.likeCount]);

  useEffect(() => {
    setRetweetedCount(props.retweetCount);
  }, [props.retweetCount]);

  const openTweetMenuBox = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeTweetMenuBox = (event) => {
    setAnchorEl(null);
  };

  async function likeTweet(tweetId, retweetId, author, e) {
    e.preventDefault();

    if (liked) {
      setLiked(!liked);

      setLikeCount(likeCount - 1);

      const likedTweetBelongToCurrentUserFeed = doc(
        db,
        `users/${auth.currentUser.uid}/feeds`,
        `${tweetId}`
      );
      const likedTweetBelongToCurrentUserFeedSnap = await getDoc(
        likedTweetBelongToCurrentUserFeed
      );
      if (likedTweetBelongToCurrentUserFeedSnap.exists()) {
        await updateDoc(likedTweetBelongToCurrentUserFeed, {
          likeCount: decrement,
        });
      }

      const queryForFollowers = query(
        collection(db, `users/${author.id}/followers`)
      );
      const followersSnapshot = await getDocs(queryForFollowers);
      await Promise.all(
        followersSnapshot.docs.map(async (follower) => {
          if (follower.id === auth.currentUser.uid) {
            return;
          }
          const likedFeedTweetDocRef = doc(
            db,
            `users/${follower.id}/feeds`,
            `${tweetId}`
          );
          await updateDoc(likedFeedTweetDocRef, {
            likeCount: decrement,
          });
        })
      );

      if (auth.currentUser.uid !== author.id) {
        const likedTweetBelongToAuthorFeed = doc(
          db,
          `users/${author.id}/feeds`,
          `${tweetId}`
        );
        await updateDoc(likedTweetBelongToAuthorFeed, {
          likeCount: decrement,
        });
      }

      const likedTweetDocRef = doc(db, "tweets", `${tweetId}`);
      await updateDoc(likedTweetDocRef, {
        likeCount: decrement,
      });

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
                  const likedFeedTweetDocRef = doc(
                    db,
                    `users/${follower.id}/feeds`,
                    `${retweeter.data().retweetId}`
                  );
                  await updateDoc(likedFeedTweetDocRef, {
                    modification: new Date(),
                  });
                })
              );
            }
          })
        );
      }

      await deleteDoc(
        doc(db, `tweets/${tweetId}/likes`, `${auth.currentUser.uid}`)
      );
      await deleteDoc(
        doc(
          db,
          `users/${author.id}/feeds/${tweetId}/likes`,
          `${auth.currentUser.uid}`
        )
      );
      await Promise.all(
        followersSnapshot.docs.map(async (follower) => {
          await deleteDoc(
            doc(
              db,
              `users/${follower.id}/feeds/${tweetId}/likes`,
              `${auth.currentUser.uid}`
            )
          );
        })
      );
    } else {
      setLiked(!liked);

      setLikeCount(likeCount + 1);

      const likedTweetBelongToCurrentUserFeed = doc(
        db,
        `users/${auth.currentUser.uid}/feeds`,
        `${tweetId}`
      );
      const likedTweetBelongToCurrentUserFeedSnap = await getDoc(
        likedTweetBelongToCurrentUserFeed
      );
      if (likedTweetBelongToCurrentUserFeedSnap.exists()) {
        await updateDoc(likedTweetBelongToCurrentUserFeed, {
          likeCount: increment,
        });
      }

      const queryForFollowers = query(
        collection(db, `users/${author.id}/followers`)
      );
      const followersSnapshot = await getDocs(queryForFollowers);
      await Promise.all(
        followersSnapshot.docs.map(async (follower) => {
          if (follower.id === auth.currentUser.uid) {
            return;
          }
          const likedFeedTweetDocRef = doc(
            db,
            `users/${follower.id}/feeds`,
            `${tweetId}`
          );
          await updateDoc(likedFeedTweetDocRef, {
            likeCount: increment,
          });
        })
      );

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
                  const likedFeedTweetDocRef = doc(
                    db,
                    `users/${follower.id}/feeds`,
                    `${retweeter.data().retweetId}`
                  );
                  await updateDoc(likedFeedTweetDocRef, {
                    modification: new Date(),
                  });
                })
              );
            }
          })
        );
      }

      if (auth.currentUser.uid !== author.id) {
        const likedTweetBelongToAuthorFeed = doc(
          db,
          `users/${author.id}/feeds`,
          `${tweetId}`
        );
        await updateDoc(likedTweetBelongToAuthorFeed, {
          likeCount: increment,
        });
      }

      const likedTweetDocRef = doc(db, "tweets", `${tweetId}`);
      await updateDoc(likedTweetDocRef, {
        likeCount: increment,
      });

      await setDoc(
        doc(db, `tweets/${tweetId}/likes`, `${auth.currentUser.uid}`),
        {}
      );
      await setDoc(
        doc(
          db,
          `users/${author.id}/feeds/${tweetId}/likes`,
          `${auth.currentUser.uid}`
        ),
        {}
      );
      await Promise.all(
        followersSnapshot.docs.map(async (follower) => {
          await setDoc(
            doc(
              db,
              `users/${follower.id}/feeds/${tweetId}/likes`,
              `${auth.currentUser.uid}`
            ),
            {}
          );
        })
      );
    }
  }

  async function reTweetTweet(tweetId, author, retweetId, event) {
    event.preventDefault();

    if (!retweeted) {
      setRetweeted(true);
      setRetweetedCount(retweetedCount + 1);

      const retweetedTweetBelongToCurrentUserFeed = doc(
        db,
        `users/${auth.currentUser.uid}/feeds`,
        `${tweetId}`
      );
      const retweetedTweetBelongToCurrentUserFeedSnap = await getDoc(
        retweetedTweetBelongToCurrentUserFeed
      );
      if (retweetedTweetBelongToCurrentUserFeedSnap.exists()) {
        await updateDoc(retweetedTweetBelongToCurrentUserFeed, {
          retweetCount: increment,
        });
      }

      const queryForFollowers = query(
        collection(db, `users/${author.id}/followers`)
      );
      const followersSnapshot = await getDocs(queryForFollowers);
      await Promise.all(
        followersSnapshot.docs.map(async (follower) => {
          if (follower.id === auth.currentUser.uid) {
            return;
          }
          const retweetedFeedTweetDocRef = doc(
            db,
            `users/${follower.id}/feeds`,
            `${tweetId}`
          );
          await updateDoc(retweetedFeedTweetDocRef, {
            retweetCount: increment,
          });
        })
      );

      if (auth.currentUser.uid !== author.id) {
        const retweetedTweetBelongToAuthorFeed = doc(
          db,
          `users/${author.id}/feeds`,
          `${tweetId}`
        );
        await updateDoc(retweetedTweetBelongToAuthorFeed, {
          retweetCount: increment,
        });
      }

      const retweetedTweetDocRef = doc(db, "tweets", `${tweetId}`);
      await updateDoc(retweetedTweetDocRef, {
        retweetCount: increment,
      });

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
                  const likedFeedTweetDocRef = doc(
                    db,
                    `users/${follower.id}/feeds`,
                    `${retweeter.data().retweetId}`
                  );
                  await updateDoc(likedFeedTweetDocRef, {
                    modification: new Date(),
                  });
                })
              );
            }
          })
        );
      }

      const tweetsdocRef = await addDoc(collection(db, "tweets"), {
        creation: new Date(),
        from: `${auth.currentUser.uid}`,
        retweetedTweetId: tweetId,
        type: "retweet",
      });

      const followersOfAuthor = query(
        collection(db, `users/${auth.currentUser.uid}/followers`)
      );
      const followersOfAuthorSnapshot = await getDocs(followersOfAuthor);
      await Promise.all(
        followersOfAuthorSnapshot.docs.map(async (follower) => {
          const followerFeedsDocRef = await setDoc(
            doc(db, `users/${follower.id}/feeds`, tweetsdocRef.id),
            {
              creation: new Date(),
              from: `${auth.currentUser.uid}`,
              retweetedTweetId: tweetId,
              type: "retweet",
            }
          );
        })
      );

      await setDoc(
        doc(db, `tweets/${tweetId}/retweets`, `${auth.currentUser.uid}`),
        {
          retweetId: tweetsdocRef.id,
        }
      );
      await setDoc(
        doc(
          db,
          `users/${author.id}/feeds/${tweetId}/retweets`,
          `${auth.currentUser.uid}`
        ),
        {
          retweetId: tweetsdocRef.id,
        }
      );
      await Promise.all(
        followersSnapshot.docs.map(async (follower) => {
          await setDoc(
            doc(
              db,
              `users/${follower.id}/feeds/${tweetId}/retweets`,
              `${auth.currentUser.uid}`
            ),
            {
              retweetId: tweetsdocRef.id,
            }
          );
        })
      );
    } else {
      debugger;
      setRetweeted(false);
      setRetweetedCount(retweetedCount - 1);

      const retweetedTweetBelongToCurrentUserFeed = doc(
        db,
        `users/${auth.currentUser.uid}/feeds`,
        `${tweetId}`
      );
      const retweetedTweetBelongToCurrentUserFeedSnap = await getDoc(
        retweetedTweetBelongToCurrentUserFeed
      );
      if (retweetedTweetBelongToCurrentUserFeedSnap.exists()) {
        await updateDoc(retweetedTweetBelongToCurrentUserFeed, {
          retweetCount: decrement,
        });
      }

      const queryForFollowers = query(
        collection(db, `users/${author.id}/followers`)
      );
      const followersSnapshot = await getDocs(queryForFollowers);
      await Promise.all(
        followersSnapshot.docs.map(async (follower) => {
          if (follower.id === auth.currentUser.uid) {
            return;
          }
          const retweetedFeedTweetDocRef = doc(
            db,
            `users/${follower.id}/feeds`,
            `${tweetId}`
          );
          await updateDoc(retweetedFeedTweetDocRef, {
            retweetCount: decrement,
          });
        })
      );

      if (auth.currentUser.uid !== author.id) {
        const retweetedTweetBelongToAuthorFeed = doc(
          db,
          `users/${author.id}/feeds`,
          `${tweetId}`
        );
        await updateDoc(retweetedTweetBelongToAuthorFeed, {
          retweetCount: decrement,
        });
      }

      const retweetedTweetDocRef = doc(db, "tweets", `${tweetId}`);
      await updateDoc(retweetedTweetDocRef, {
        retweetCount: decrement,
      });

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
                  const likedFeedTweetDocRef = doc(
                    db,
                    `users/${follower.id}/feeds`,
                    `${retweeter.data().retweetId}`
                  );
                  await updateDoc(likedFeedTweetDocRef, {
                    modification: new Date(),
                  });
                })
              );
            }
          })
        );
      }

      await deleteDoc(
        doc(db, `tweets/${tweetId}/retweets`, `${auth.currentUser.uid}`)
      );
      await deleteDoc(
        doc(
          db,
          `users/${author.id}/feeds/${tweetId}/retweets`,
          `${auth.currentUser.uid}`
        )
      );
      await Promise.all(
        followersSnapshot.docs.map(async (follower) => {
          await deleteDoc(
            doc(
              db,
              `users/${follower.id}/feeds/${tweetId}/retweets`,
              `${auth.currentUser.uid}`
            )
          );
        })
      );

      const queryForCurrentUserFollowers = query(
        collection(db, `users/${auth.currentUser.uid}/followers`)
      );
      const currentUserFollowersSnapshot = await getDocs(queryForCurrentUserFollowers);
      await Promise.all(
        currentUserFollowersSnapshot.docs.map(async (follower) => {
          const undoRetweetQuery = query(
            collection(db, `users/${follower.id}/feeds`),
            where("retweetedTweetId", "==", tweetId)
          );

          const undoRetweetSnapshot = await getDocs(undoRetweetQuery);
          await Promise.all(
            undoRetweetSnapshot.docs.map(async (undoRetweet) => {
              await deleteDoc(
                doc(
                  db,
                  `users/${follower.id}/feeds/`,
                  `${undoRetweet.id}`
                )
              );
            })
          );
        })
      );
    }
  }

  async function bookmarkTweet(tweetId, event) {
    event.preventDefault();

    if (!bookmarked) {
      setBookmarked(true);
      await setDoc(
        doc(db, `tweets/${tweetId}/bookmarks`, `${auth.currentUser.uid}`),
        {}
      );
      // User altında bir bookmarks collection'ı yapmaya karar verirsek oraya eklenecek
    } else {
      setBookmarked(false);
      await deleteDoc(
        doc(db, `tweets/${tweetId}/bookmarks`, `${auth.currentUser.uid}`)
      );
    }
  }

  return (
    <div>
      <Grid
        container
        component={Link}
        to="/explore"
        justifyContent="flex-start"
        alignItems="stretch"
        className={classes.tweetBoxContainer}
      >
        <Grid
          item
          container
          justifyContent="flex-start"
          xs={12}
          className={classes.tweetInformationContainer}
        >
          {tweetInformation}
        </Grid>
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          xs="auto"
          wrap="nowrap"
          className={classes.avatarContainer}
        >
          <Grid item>
            <Avatar alt="" src="" className={classes.avatar} />
          </Grid>
          {replyLine}
        </Grid>
        <Grid item xs container justifyContent="space-between">
          <Grid
            item
            xs={11}
            container
            spacing={1}
            justifyContent="flex-start"
            alignItems="center"
          >
            <Grid
              item
              container
              alignItems="center"
              component={Link}
              to="/explore"
              spacing={1}
              xs="auto"
              className={classes.nameAndUsername}
            >
              <Grid item>
                <Typography variant="body1" noWrap className={classes.name}>
                  {isRetweet ? props.retweetedTweet.user.name : props.user.name}
                </Typography>
              </Grid>
              <Grid item xs zeroMinWidth className={classes.usernameContainer}>
                <Typography
                  variant="body1"
                  component="div"
                  noWrap
                  className={classes.username}
                >
                  {isRetweet
                    ? props.retweetedTweet.user.username
                    : props.user.username}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs>
              <Typography
                variant="body1"
                component={Link}
                to="/home"
                className={classes.time}
              >
                21s
              </Typography>
            </Grid>
          </Grid>
          <Grid
            item
            container
            alignItems="center"
            justifyContent="flex-end"
            xs={1}
          >
            <Grid item>
              <IconButton
                id="tweet-menu-button"
                className={classes.moreButtonIcon}
                sx={{ color: "rgb(83, 100, 113)" }}
                classes={{ root: classes.moreIcon }}
                onClick={(e) => {
                  e.preventDefault();
                  if (extraSmallScreen) {
                    setOpenTweetMenuPopup(true);
                  } else {
                    openTweetMenuBox(e);
                  }
                }}
              >
                <MoreHorizIcon fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item container direction="column" xs={12} spacing={1}>
            <Grid item>
              <Typography
                variant="body1"
                component="p"
                className={classes.tweetContent}
              >
                {isRetweet ? props.retweetedTweet.content : props.content}
              </Typography>
            </Grid>
            <Grid
              item
              container
              justifyContent="space-between"
              className={classes.iconsContainer}
            >
              <Grid item>
                <Button
                  startIcon={<CommentIcon fontSize="small" />}
                  className={classes.tweetActionButton}
                  classes={{ root: classes.blueAction }}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenReplyPopup(true);
                  }}
                >
                  {isRetweet
                    ? props.retweetedTweet.replyCount
                    : props.replyCount}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  startIcon={
                    <LoopIcon
                      fontSize="small"
                      style={
                        retweeted
                          ? { color: "#2EC693", fontWeight: "bold" }
                          : {}
                      }
                    />
                  }
                  className={classes.tweetActionButton}
                  classes={{ root: classes.greenAction }}
                  onClick={(e) =>
                    reTweetTweet(
                      isRetweet ? props.retweetedTweet.id : props.id,
                      isRetweet ? props.retweetedTweet.user : props.user,
                      props.id,
                      e
                    )
                  }
                >
                  {retweetedCount}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  startIcon={
                    liked ? (
                      <FavoriteIcon
                        style={{ color: "#F91880" }}
                        fontSize="small"
                      />
                    ) : (
                      <FavoriteBorderIcon fontSize="small" />
                    )
                  }
                  className={classes.tweetActionButton}
                  classes={{ root: classes.redAction }}
                  onClick={(e) =>
                    likeTweet(
                      isRetweet ? props.retweetedTweet.id : props.id,
                      isRetweet ? props.id : null,
                      isRetweet ? props.retweetedTweet.user : props.user,
                      e
                    )
                  }
                >
                  {likeCount}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  startIcon={
                    bookmarked ? (
                      <BookmarkIcon
                        style={{ color: "rgb(29, 155, 240)" }}
                        fontSize="small"
                      />
                    ) : (
                      <BookmarkBorderIcon fontSize="small" />
                    )
                  }
                  className={classes.tweetActionButton}
                  classes={{ root: classes.blueAction }}
                  onClick={(e) =>
                    bookmarkTweet(
                      isRetweet ? props.retweetedTweet.id : props.id,
                      e
                    )
                  }
                ></Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          container
          spacing={2}
          xs={12}
          className={classes.avatarContainer}
        >
          <Grid item>{replyInformation}</Grid>
          <Grid item>{goThreadLink}</Grid>
        </Grid>
      </Grid>
      <Popup
        openPopup={openReplyPopup}
        setOpenPopup={setOpenReplyPopup}
        isFullScreen={screenBetweenSmallAndMedium ? true : false}
        maxWidth="sm"
        align="alignStart"
        paddingAmount="zero"
        roundAmount={!screenBetweenSmallAndMedium ? "twentyPixel" : null}
        title={
          <Grid container>
            <Grid item>
              <IconButton
                style={{ color: "black", padding: "0px" }}
                onClick={(e) => {
                  e.preventDefault();
                  setOpenReplyPopup(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        }
      >
        <Grid container>
          <Grid
            container
            justifyContent="flex-start"
            alignItems="stretch"
            className={classes.tweetBoxContainer}
            style={{ padding: "0px" }}
          >
            <Grid
              item
              container
              direction="column"
              alignItems="center"
              xs="auto"
              wrap="nowrap"
              className={classes.avatarContainer}
            >
              <Grid item>
                <Avatar alt="" src="" className={classes.avatar} />
              </Grid>
              <Grid item className={classes.replyLineContainer}>
                <div></div>
              </Grid>
            </Grid>
            <Grid item xs container justifyContent="space-between">
              <Grid
                item
                xs={12}
                container
                spacing={1}
                justifyContent="flex-start"
                alignItems="center"
              >
                <Grid
                  item
                  container
                  alignItems="center"
                  spacing={1}
                  xs="auto"
                  className={classes.nameAndUsername}
                >
                  <Grid item>
                    <Typography variant="body1" noWrap className={classes.name}>
                      {isRetweet
                        ? props.retweetedTweet.user.name
                        : props.user.name}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs
                    zeroMinWidth
                    className={classes.usernameContainer}
                  >
                    <Typography
                      variant="body1"
                      component="div"
                      noWrap
                      className={classes.username}
                    >
                      {isRetweet
                        ? props.retweetedTweet.user.username
                        : props.user.username}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs>
                  <Typography
                    variant="body1"
                    component={Link}
                    to="/home"
                    className={classes.time}
                  >
                    21s
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container direction="column" xs={12} spacing={1}>
                <Grid item>
                  <Typography
                    variant="body1"
                    component="p"
                    className={classes.tweetContent}
                  >
                    {isRetweet ? props.retweetedTweet.content : props.content}
                  </Typography>
                </Grid>
              </Grid>
              <Grid className={classes.replyInfoContainer}>
                <Typography className={classes.replyInfo}>
                  Replying to{" "}
                  <span className={classes.replyToUsername}>
                    {isRetweet
                      ? props.retweetedTweet.user.username
                      : props.user.username}
                  </span>
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              container
              spacing={2}
              xs={12}
              className={classes.avatarContainer}
            >
              <Grid item>
                <Avatar alt="" src="" className={classes.avatar} />
              </Grid>
              <Grid item xs>
                <PostTweetForm
                  placeholder="Tweet your reply"
                  type="reply"
                  repliedTweetId={
                    isRetweet ? props.retweetedTweet.id : props.id
                  }
                  repliedUserId={
                    isRetweet ? props.retweetedTweet.user.id : props.user.id
                  }
                  alignAmountForSubmitButton="TwelvePixelRight"
                  afterSubmitAction={setOpenReplyPopup}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Popup>
      <TweetMenuPopup
        openTweetMenuPopup={openTweetMenuPopup}
        setOpenTweetMenuPopup={setOpenTweetMenuPopup}
        tweetId={isRetweet ? props.retweetedTweet.id : props.id}
        authorId={isRetweet ? props.retweetedTweet.user.id : props.user.id}
        isBelongToAuthUser={
          isRetweet
            ? props.retweetedTweet.user.id === auth.currentUser.uid
            : props.user.id === auth.currentUser.uid
        }
      />
      <TweetMenuBox
        anchorEl={anchorEl}
        onClick={openTweetMenuBox}
        onClose={closeTweetMenuBox}
        open={open}
        tweetId={isRetweet ? props.retweetedTweet.id : props.id}
        authorId={isRetweet ? props.retweetedTweet.user.id : props.user.id}
        isBelongToAuthUser={
          isRetweet
            ? props.retweetedTweet.user.id === auth.currentUser.uid
            : props.user.id === auth.currentUser.uid
        }
      />
    </div>
  );
}

export default TweetBox;
