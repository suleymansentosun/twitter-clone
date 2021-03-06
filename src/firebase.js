import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { generateUsername } from "./helper";
import {
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJ99AmnhtE6Y4WEVRBY3UZpts_F49Quyg",
  authDomain: "twitter-clone-3da59.firebaseapp.com",
  projectId: "twitter-clone-3da59",
  storageBucket: "twitter-clone-3da59.appspot.com",
  messagingSenderId: "126432357187",
  appId: "1:126432357187:web:37574eba0880a896be1df6",
  measurementId: "G-4SPT55WT94",
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export const fetchUserDocument = async (authenticatedUser, formValues=null, providerInformation=null) => {
  if (!authenticatedUser) return;

  const userRef = db.doc(`users/${authenticatedUser.uid}`);
  const user = await userRef.get();

  let userDoc;

  if (user.exists) {
    // This user has already been stored.
    return user.data();
  } else {
    try {
      if (formValues) {    
        let username = await generateUsername(formValues.name);

        await userRef.set({
          creation: new Date(),
          name: formValues.name,
          username: username,
          email: "email" in formValues ? formValues.email : "",
          phone: "phone" in formValues ? formValues.phone : "",
          birthday: formValues.date,
          followCount: 0,
          followerCount: 0,
        });
      } else {
        let username = await generateUsername(providerInformation.displayName);

        await userRef.set({
          creation: new Date(),
          name: providerInformation.displayName,
          username: username,
          email: providerInformation.email,
          phone: providerInformation.phoneNumber,
          birthday: null,
          followCount: 0,
          followerCount: 0,
        });        
      }

      if (authenticatedUser.uid != "m1daA2NpVlRUmVySVQ9ytYlK4Mi1") {
        // Sitenin geli??tiricisi olan S??leyman ??entosun hen??z ??ye olan bu ki??inin following'ine eklensin.
        await setDoc(doc(db, `users/${authenticatedUser.uid}/following`, "m1daA2NpVlRUmVySVQ9ytYlK4Mi1"), {});
        // Sitenin geli??tiricisi olan S??leyman ??entosun'un followers'lar??na hen??z ??ye olan bu ki??i eklensin.
        await setDoc(doc(db, `users/m1daA2NpVlRUmVySVQ9ytYlK4Mi1/followers`, authenticatedUser.uid), {});
        // Hen??z ??ye olan bu ki??inin feed'ine S??leyman ??entosun'un 'welcome tweet'leri eklensin.
        const welcomeTweetIds = ["VSUp7Dl6KgfLLSFy9pHn", "Y1JE064xtOzHYdbRNod2", "eyWJWeqv4zmxqaITk1dZ", "ixk2tHl7AcnaX4IwykTk", "sTMj0yVrYOQScK000B5v", "uRuMTJIUwpK7gQrIfiJh"];
        for (const tweetId of welcomeTweetIds) {
          // tweet doc verilerini elde et
          const tweetRef = doc(db, "tweets", tweetId);
          const tweetSnap = await getDoc(tweetRef);
          if (tweetSnap.exists()) {
            await setDoc(doc(db, `users/${authenticatedUser.uid}/feeds`, tweetId), {
              content: tweetSnap.data().content,
              creation: tweetSnap.data().creation,
              from: tweetSnap.data().from,
              likeCount: tweetSnap.data().likeCount,
              replyCount: tweetSnap.data().replyCount,
              retweetCount: tweetSnap.data().retweetCount,
              type: tweetSnap.data().type,
            }); 
          }
        }
      }
    } catch (error) {
      console.log("Error in creating user", error);
    }
    userDoc = await userRef.get();
    return userDoc.data();
  }
};

export async function extractPossibleUsersForFollowing(ids, path) {
  // don't run if there aren't any ids or a path for the collection
  if (!ids || !ids.length || !path) return [];

  const collectionPath = db.collection(path);
  const batches = [];

  while (ids.length) {
    // firestore limits batches to 10
    const batch = ids.splice(0, 10);

    // add the batch request to to a queue
    batches.push(
      collectionPath
        .where(
          firebase.firestore.FieldPath.documentId(),
          'not-in',
          [...batch]
        )
        .get()
        .then(results => results.docs.map(result => ({  id: result.id, data: result.data() }) ))
    )
  }

  // after all of the data is fetched, return it
  return Promise.all(batches)
    .then(content => content.flat());
}

export { auth, provider };
export default db;
