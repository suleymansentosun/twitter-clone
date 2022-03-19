import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import { makeStyles } from "@material-ui/core/styles";
import Grid from '@mui/material/Grid';
import { collection, addDoc, query, getDocs, doc, setDoc, updateDoc } from "firebase/firestore";
import { auth } from "./firebase";
import db from './firebase';
import firebase from "firebase/compat/app";

const validationSchema = yup.object({
  tweet: yup
    .string("Enter your tweet")
    .max(240, 'Tweet length can be maximum 240 characters long')
    .required("You have not entered any tweet"),
});

const useStyles = makeStyles((theme) => ({
  tweetButton: {
    width: "85px",
    borderRadius: "20px !important",
    lineHeight: "1.8 !important",
    textTransform: "none !important",
    backgroundColor: `${theme.palette.primary.main} !important`,
    fontWeight: "700 !important"
  },
  formContainer: {
    width: "100%",
  },
  inputt: {
    paddingTop: "12px",    
  },
  customInput: {
    "& textarea::placeholder": {
      color: "black",
      fontWeight: "500",
      fontSize: "19px",
      opacity: "0.8",
    }
  },
  disabledButton: {
    color: "#fff !important",
    opacity: "0.5 !important",
  },
  submitButtonAlignedTwelvePixelRight: {
    marginRight: "-12px !important"
  }
}));

function PostTweetForm(props) {
  const increment = firebase.firestore.FieldValue.increment(1);
  const decrement = firebase.firestore.FieldValue.increment(-1);
  const placeholder = props.placeholder;
  const type = props.type;
  const afterSubmitAction = props.afterSubmitAction;
  const repliedTweetId = props.repliedTweetId;
  const repliedUserId = props.repliedUserId;
  const alignAmountForSubmitButton = props.alignAmountForSubmitButton;
  const classes = useStyles();
  const formik = useFormik({
    initialValues: {
      tweet: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, {resetForm}) => {
      if (type === "normal") {
        const tweetsdocRef = await addDoc(collection(db, "tweets"), {
          content: values.tweet,
          creation: new Date(),
          from: `${auth.currentUser.uid}`,
          likeCount: 0,
          replyCount: 0,
          retweetCount: 0,
          type: "normal",
        });
  
        const followersOfAuthor = query(collection(db, `users/${auth.currentUser.uid}/followers`));
        const followersOfAuthorSnapshot = await getDocs(followersOfAuthor);
        await Promise.all(followersOfAuthorSnapshot.docs.map(async (follower) => {
          const followerFeedsDocRef = await setDoc(doc(db, `users/${follower.id}/feeds`, tweetsdocRef.id), {
            content: values.tweet,
            creation: new Date(),
            from: `${auth.currentUser.uid}`,
            likeCount: 0,
            replyCount: 0,
            retweetCount: 0,
            type: "normal",
          });
        }));
  
        const authorFeedsDocRef = await setDoc(doc(db, `users/${auth.currentUser.uid}/feeds`, tweetsdocRef.id), {
          content: values.tweet,
          creation: new Date(),
          from: `${auth.currentUser.uid}`,
          likeCount: 0,
          replyCount: 0,
          retweetCount: 0,
          type: "normal",
        });
  
        resetForm({});
      } else if (type === "reply") {
        const tweetsdocRef = await addDoc(collection(db, "tweets"), {
          content: values.tweet,
          creation: new Date(),
          from: `${auth.currentUser.uid}`,
          likeCount: 0,
          replyCount: 0,
          replyTo: repliedTweetId,
          retweetCount: 0,
          type: "reply",
        });

        const repliedTweetDocRef = doc(
          db,
          'tweets',
          `${repliedTweetId}`
        ); 
        await updateDoc(repliedTweetDocRef, {
          replyCount: increment,
        });
        
        await setDoc(
          doc(db, `tweets/${repliedTweetId}/replies`, `${tweetsdocRef.id}`),
          {}
        );

        const repliedTweetBelongsToAuthorFeed = doc(
          db,
          `users/${repliedUserId}/feeds`,
          `${repliedTweetId}`
        );

        await updateDoc(repliedTweetBelongsToAuthorFeed, {
          replyCount: increment,
        });

        const followersOfAuthor = query(collection(db, `users/${repliedUserId}/followers`));
        const followersOfAuthorSnapshot = await getDocs(followersOfAuthor);
        await Promise.all(followersOfAuthorSnapshot.docs.map(async (follower) => {
          const repliedFeedTweetDocRef = doc(
            db,
            `users/${follower.id}/feeds`,
            `${repliedTweetId}`
          );

          await updateDoc(repliedFeedTweetDocRef, {
            replyCount: increment,
          });
        }));

        const queryForRetweeters = query(
          collection(db, `tweets/${repliedTweetId}/retweets`)
        );
        const retweetersSnapshot = await getDocs(queryForRetweeters);
        if (retweetersSnapshot.docs.length > 0) {
          await Promise.all(
            retweetersSnapshot.docs.map(async (retweeter) => {
              const queryForRetweeterFollowers = query(
                collection(db, `users/${retweeter.id}/followers`)
              );
              const retweeterFollowersSnapshot = await getDocs(queryForRetweeterFollowers);
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

        afterSubmitAction(false);
      }
    },
  });

  return (
    <div className={classes.formContainer}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container sm direction="column" rowSpacing={2}>
          <Grid item style={{ paddingTop: "26px" }}>
            <Input
              id="tweet"
              name="tweet"
              fullWidth
              multiline
              disableUnderline
              placeholder={placeholder}
              sx={{ textarea: { color: '#303233', fontSize: "20px" } }}
              value={formik.values.tweet || ''}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              className={classes.inputt}
              classes={{ root: classes.customInput }}
              inputProps={{
                maxLength: 280,
              }}
            />
          </Grid>
          <Grid item container justifyContent="flex-end">
            <Grid item className={classes["submitButtonAligned" + alignAmountForSubmitButton]}>
              <Button
                variant="contained"
                type="submit"
                className={classes.tweetButton}
                disabled={formik.values['tweet'] == "" ? true : false}
                classes={{ disabled: classes.disabledButton }}
              >
                Tweet
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default PostTweetForm;
