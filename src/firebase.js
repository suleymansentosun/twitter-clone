import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { generateUsername } from "./helper";

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
