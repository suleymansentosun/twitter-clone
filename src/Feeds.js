import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import TweetBox from "./TweetBox";
import Button from "@mui/material/Button";

const useStyles = makeStyles((theme) => ({
  moreTweetsContainer: {
    minHeight: "48px",
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  moreTweets: {
    color: theme.palette.primary.main,
  },
  tweetBox: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  space: {
    height: theme.spacing(48),
  },
  showMoreTweets: {
    width: "100%",
    textTransform: "none !important",
    fontSize: "15px !important",
    color: "rgb(29, 155, 240) !important",
    transitionProperty: "background-color",
    transitionDuration: "0.2s",
    "&:hover": {
      backgroundColor: "#F7F7F7 !important",
    },
  }
}));

function Feeds(props) {
  const classes = useStyles();
  const posts = props.feed;
  const postsOrderedByCreationTime = posts.sort( (a, b) => b.creation - a.creation );
  const feedPosts = postsOrderedByCreationTime.map((post) => {
    return (
      <Grid item container key={post.id} className={classes.tweetBox}>
        <TweetBox
          type={post.type}
          id={post.id}
          content={post.content}
          creation={post.creation }
          likeCount={post.type == "retweet" ? post.retweetedTweet.likeCount : post.likeCount }
          liked={post.liked}
          retweeted={post.retweeted}
          bookmarked={post.bookmarked}
          replyCount={post.replyCount}
          retweetCount={post.type == "retweet" ? post.retweetedTweet.retweetCount : post.retweetCount}
          user={post.user}          
          retweetedTweet={post.retweetedTweet}          
        />        
      </Grid>
    );
  });
  return (
    <main>
      <section>
        <Grid
          container
          justifyContent="center"
          alignContent="center"
          className={classes.moreTweetsContainer}
        >
          <Grid item xs>
            <Button classes={{ root : classes.showMoreTweets }}>
              Show More Tweets
            </Button>
          </Grid>
        </Grid>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          {feedPosts}
          <Grid item className={classes.space}></Grid>
        </Grid>
      </section>
    </main>
  );
}

export default Feeds;
