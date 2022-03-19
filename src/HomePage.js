import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Navbar from "./Navbar";
import Header from "./Header";
import Feeds from "./Feeds";
import Trends from "./Trends";
import WhoToFollow from "./WhoToFollow";
import SearchInput from "./SearchInput";
import { useAuth } from "./AuthContext";
import { auth } from "./firebase";
import db from "./firebase";
import {
  collection,
  query,
  onSnapshot,
  setDoc,
  doc,
  deleteDoc,
  getDocs,
  getDoc,
  orderBy,
  where,
  limit
} from "firebase/firestore";
import { Typography } from "@material-ui/core";
import { extractPossibleUsersForFollowing } from "./firebase";

const useStyles = makeStyles((theme) => ({
  navbarContainer: {
    [theme.breakpoints.up("sm")]: {
      width: "79px",
    },
    [theme.breakpoints.up("lg")]: {
      width: "275px",
    },
  },
  root: {
    [theme.breakpoints.up("sm")]: {
      maxWidth: "700px",
      marginLeft: "auto",
      marginRight: "auto",
    },
    [theme.breakpoints.up("md")]: {
      maxWidth: "1100px",
      marginLeft: "auto",
      marginRight: "auto",
    },
    [theme.breakpoints.up("lg")]: {
      maxWidth: "1300px",
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  main: {
    borderRight: `1px solid ${theme.palette.divider}`,
    maxWidth: "600px",
  },
  aside: {
    position: "fixed",
    padding: "5px 15px",
    [theme.breakpoints.up("md")]: {
      maxWidth: "390px",
    },
  },
  sidebarNav: {
    paddingLeft: "20px !important",
  },
  smallLink: {
    "&:hover": {
      textDecoration: "underline",
      cursor: "pointer",
    },
  },
}));

function HomePage() {
  const classes = useStyles();
  const [feeds, setFeeds] = useState(new Array());
  let feedsTweets = new Array();
  const [mostFollowedUsers, setMostFollowedUsers] = useState([]);

  useEffect(async () => {
    let notSuitableUsersForFollowing = [auth.currentUser.uid];
    const queryForAlreadyFollowings = query(collection(db, `users/${auth.currentUser.uid}/following`));
    const alreadyFollowingsSnapshot = await getDocs(queryForAlreadyFollowings);
    alreadyFollowingsSnapshot.forEach((follower) => {
      notSuitableUsersForFollowing.push(follower.id);
    });

    extractPossibleUsersForFollowing(notSuitableUsersForFollowing, 'users').then(
      result => {
        result.sort( (userA, userB) => userB.data.followerCount - userA.data.followerCount );
        let mostFollowedUsers = result.slice(0, 3);
        setMostFollowedUsers(mostFollowedUsers);
      }
    )
  }, []);

  useEffect(() => {
    async function handleFeedChange(feedsSnapshot) {
      await Promise.all(
        feedsSnapshot.docChanges().map(async (change) => {
          if (change.type === "added") {
            const tweetRef = doc(
              db,
              `users/${auth.currentUser.uid}/feeds`,
              change.doc.id
            );
            const tweetSnap = await getDoc(tweetRef);
            const isLikedQuery = query(collection(db, `users/${auth.currentUser.uid}/feeds/${change.doc.id}/likes`), where("__name__", "==", auth.currentUser.uid));
            const isLikedQuerySnapshot = await getDocs(isLikedQuery);
            const isRetweetedQuery = query(collection(db, `users/${auth.currentUser.uid}/feeds/${change.doc.id}/retweets`), where("__name__", "==", auth.currentUser.uid));
            const isRetweetedQuerySnapshot = await getDocs(isRetweetedQuery);
            const isBookmarkedQuery = query(collection(db, `tweets/${change.doc.id}/bookmarks`), where("__name__", "==", auth.currentUser.uid));
            const isBookmarkedQuerySnapshot = await getDocs(isBookmarkedQuery);
            let retweetedTweetSnap;
            let userWriterOfRetweetedPostSnap;
            let isLikedQueryForRetweetedTweetSnapshot;
            let isRetweetedQueryForRetweetedTweetSnapshot;
            let isBookmarkedQueryForRetweetedTweetSnapshot;
            if (tweetSnap.data().type == "retweet") {
              const retweetedTweetRef = doc(
                db,
                "tweets",
                tweetSnap.data().retweetedTweetId
              );
              retweetedTweetSnap = await getDoc(retweetedTweetRef);
              const userWriterOfRetweetedPostRef = doc(
                db,
                "users",
                retweetedTweetSnap.data().from
              );              
              const isLikedQueryForRetweetedTweet = query(collection(db, `tweets/${change.doc.data().retweetedTweetId}/likes`), where("__name__", "==", auth.currentUser.uid));
              isLikedQueryForRetweetedTweetSnapshot = await getDocs(isLikedQueryForRetweetedTweet);
              const isRetweetedQueryForRetweetedTweet = query(collection(db, `tweets/${change.doc.data().retweetedTweetId}/retweets`), where("__name__", "==", auth.currentUser.uid));
              isRetweetedQueryForRetweetedTweetSnapshot = await getDocs(isRetweetedQueryForRetweetedTweet);
              const isBookmarkedQueryForRetweetedTweet = query(collection(db, `tweets/${change.doc.data().retweetedTweetId}/bookmarks`), where("__name__", "==", auth.currentUser.uid));
              isBookmarkedQueryForRetweetedTweetSnapshot = await getDocs(isBookmarkedQueryForRetweetedTweet);
              userWriterOfRetweetedPostSnap = await getDoc(
                userWriterOfRetweetedPostRef
              );
            }
            const userRef = doc(db, "users", tweetSnap.data().from);
            const userSnap = await getDoc(userRef);
            if (tweetSnap.exists()) {
              feedsTweets.push(
                Object.assign(
                  {},
                  { id: change.doc.id },
                  { liked: isLikedQuerySnapshot.docs.length > 0 ? true : false },
                  { bookmarked: isBookmarkedQuerySnapshot.docs.length > 0 ? true : false },
                  { retweeted: isRetweetedQuerySnapshot.docs.length > 0 ? true : false },
                  {
                    user: Object.assign(
                      {},
                      { id: userSnap.id },
                      userSnap.data()
                    ),
                  },
                  tweetSnap.data(),
                  {
                    retweetedTweet:
                      tweetSnap.data().type == "retweet"
                        ? Object.assign(
                            {},
                            { id: retweetedTweetSnap.id },
                            { liked: isLikedQueryForRetweetedTweetSnapshot.docs.length > 0 ? true : false },
                            { bookmarked: isBookmarkedQueryForRetweetedTweetSnapshot.docs.length > 0 ? true : false },
                            { retweeted: isRetweetedQueryForRetweetedTweetSnapshot.docs.length > 0 ? true : false },
                            { user: Object.assign({}, {id: userWriterOfRetweetedPostSnap.id}, userWriterOfRetweetedPostSnap.data()) },
                            retweetedTweetSnap.data()
                          )
                        : null,
                  }
                )
              );
            } else {
              console.log("No such document!");
            }
          }
          if (change.type === "modified") {
            const tweetRef = doc(
              db,
              `users/${auth.currentUser.uid}/feeds`,
              change.doc.id
            );
            const tweetSnap = await getDoc(tweetRef);
            const isLikedQuery = query(collection(db, `users/${auth.currentUser.uid}/feeds/${change.doc.id}/likes`), where("__name__", "==", auth.currentUser.uid));
            const isLikedQuerySnapshot = await getDocs(isLikedQuery);
            const isRetweetedQuery = query(collection(db, `users/${auth.currentUser.uid}/feeds/${change.doc.id}/retweets`), where("__name__", "==", auth.currentUser.uid));
            const isRetweetedQuerySnapshot = await getDocs(isRetweetedQuery);
            const isBookmarkedQuery = query(collection(db, `tweets/${change.doc.id}/bookmarks`), where("__name__", "==", auth.currentUser.uid));
            const isBookmarkedQuerySnapshot = await getDocs(isBookmarkedQuery);
            let retweetedTweetSnap;
            let userWriterOfRetweetedPostSnap;
            let isLikedQueryForRetweetedTweetSnapshot;
            let isBookmarkedQueryForRetweetedTweetSnapshot;
            if (tweetSnap.data().type == "retweet") {
              const retweetedTweetRef = doc(
                db,
                "tweets",
                tweetSnap.data().retweetedTweetId
              );
              retweetedTweetSnap = await getDoc(retweetedTweetRef);
              const userWriterOfRetweetedPostRef = doc(
                db,
                "users",
                retweetedTweetSnap.data().from
              );
              const isLikedQueryForRetweetedTweet = query(collection(db, `users/${auth.currentUser.uid}/feeds/${change.doc.data().retweetedTweetId}/likes`), where("__name__", "==", auth.currentUser.uid));
              isLikedQueryForRetweetedTweetSnapshot = await getDocs(isLikedQueryForRetweetedTweet);
              const isBookmarkedQueryForRetweetedTweet = query(collection(db, `tweets/${change.doc.data().retweetedTweetId}/bookmarks`), where("__name__", "==", auth.currentUser.uid));
              isBookmarkedQueryForRetweetedTweetSnapshot = await getDocs(isBookmarkedQueryForRetweetedTweet);
              userWriterOfRetweetedPostSnap = await getDoc(
                userWriterOfRetweetedPostRef
              );
            }
            const userRef = doc(db, "users", tweetSnap.data().from);
            const userSnap = await getDoc(userRef);
            if (tweetSnap.exists()) {
              feedsTweets = feedsTweets.map((tweetObj) => {
                if (tweetObj.id === change.doc.id) {
                  return Object.assign(
                    {},
                    { id: change.doc.id },
                    { liked: isLikedQuerySnapshot.docs.length > 0 ? true : false },
                    { bookmarked: isBookmarkedQuerySnapshot.docs.length > 0 ? true : false },
                    { retweeted: isRetweetedQuerySnapshot.docs.length > 0 ? true : false },
                    {
                      user: Object.assign(
                        {},
                        { id: userSnap.id },
                        userSnap.data()
                      ),
                    },
                    tweetSnap.data(),
                    {
                      retweetedTweet:
                        tweetSnap.data().type == "retweet"
                          ? Object.assign(
                              {},
                              { id: retweetedTweetSnap.id },
                              { liked: isLikedQueryForRetweetedTweetSnapshot.docs.length > 0 ? true : false },
                              { bookmarked: isBookmarkedQueryForRetweetedTweetSnapshot.docs.length > 0 ? true : false },
                              { user: Object.assign({}, {id: userWriterOfRetweetedPostSnap.id}, userWriterOfRetweetedPostSnap.data()) },
                              retweetedTweetSnap.data()
                            )
                          : null,
                    }
                  );
                } else if (tweetObj.retweetedTweetId === change.doc.id) {
                  return Object.assign(
                    {},
                    { id: tweetObj.id },
                    {
                      liked:
                        isLikedQuerySnapshot.docs.length > 0 ? true : false,
                    },
                    {
                      retweeted:
                        isRetweetedQuerySnapshot.docs.length > 0 ? true : false,
                    },
                    {
                      user: tweetObj.user,                      
                    },
                    {
                      creation: tweetObj.creation,
                      from: tweetObj.from,
                      retweetedTweetId: tweetObj.retweetedTweetId,
                      type: tweetObj.type
                    },
                    {
                      retweetedTweet: Object.assign(
                        {},
                        { id: change.doc.id },
                        {
                          liked: false
                        },
                        {
                          user: Object.assign(
                            {},
                            { id: userSnap.id },
                            userSnap.data()
                          ),
                        },
                        tweetSnap.data()
                      ),
                    }
                  );
                } else {
                  return tweetObj;
                }
              });
            } else {
              console.log("No such document!");
            }            
          }
          if (change.type === "removed") {
            // feedTweets dizisini dolaş, silinen doc'u bulup bu diziden de sil
            for(var i = feedsTweets.length - 1; i >= 0; i--) {
              if (feedsTweets[i].id === change.doc.id || feedsTweets[i].retweetedTweetId === change.doc.id) {
                feedsTweets.splice(i, 1);
              }
            }
          }
        })
      ).then(() => {
        setFeeds([...feedsTweets]);
      });
    }

    const feedsRef = collection(db, `users/${auth.currentUser.uid}/feeds`);
    const feedsQuery = query(feedsRef);
    const unsubscribe = onSnapshot(feedsQuery, handleFeedChange);

    return function cleanup() {
      unsubscribe();
    };
  }, []);

  return (
    <div className={classes.root}>
      <Grid container>
        <Box
          component={Grid}
          item
          sm="auto"
          className={classes.navbarContainer}
        >
          <Navbar />
        </Box>
        <Box
          component={Grid}
          container
          item
          direction="column"
          xs={12}
          sm
          md={8}
          className={classes.main}
        >
          <Header />
          <Feeds feed={feeds} />
        </Box>
        <Box
          component={Grid}
          item
          md
          display={{ xs: "none", md: "flex" }}
          className={classes.sidebar}
        >
          <aside className={classes.aside}>
            <Grid container direction="column" spacing={2}>
              <SearchInput />
              <Trends />
              <WhoToFollow mostFollowedUsers={mostFollowedUsers} />
              <Grid
                item
                container
                md={12}
                spacing={1}
                className={classes.sidebarNav}
              >
                <Grid item md="auto">
                  <Typography variant="body2" className={classes.smallLink}>
                    Terms of Service
                  </Typography>
                </Grid>
                <Grid item md="auto">
                  <Typography variant="body2" className={classes.smallLink}>
                    Privacy Policy
                  </Typography>
                </Grid>
                <Grid item md="auto">
                  <Typography variant="body2" className={classes.smallLink}>
                    Cookie Policy
                  </Typography>
                </Grid>
                <Grid item md="auto">
                  <Typography variant="body2" className={classes.smallLink}>
                    Imprint
                  </Typography>
                </Grid>
                <Grid item md="auto">
                  <Typography variant="body2" className={classes.smallLink}>
                    Accessibility
                  </Typography>
                </Grid>
                <Grid item md="auto">
                  <Typography variant="body2" className={classes.smallLink}>
                    Ads info
                  </Typography>
                </Grid>
                <Grid item md="auto">
                  <Typography variant="body2" className={classes.smallLink}>
                    More...
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </aside>
        </Box>
      </Grid>
    </div>
  );
}

export default HomePage;
