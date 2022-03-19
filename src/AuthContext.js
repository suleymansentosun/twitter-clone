import React, { useContext, useState, useEffect } from "react";
import { auth, provider } from "./firebase";
import { fetchUserDocument } from "./firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [extraUserInformation, setExtraUserInformation] = useState(null);

  function loginWithGoogle() {
    setExtraUserInformation(null);
    return auth.signInWithPopup(provider);
  }

  function logout() {
    setExtraUserInformation(null);
    return auth.signOut();
  }

  function signupWithEmail(formValues) {
    setExtraUserInformation(formValues);
    return auth.createUserWithEmailAndPassword(formValues.email, formValues.password);
  }

  function signupWithPhone(phoneNumber, recaptcha, formValues) {
    setExtraUserInformation(formValues);
    return auth.signInWithPhoneNumber(phoneNumber, recaptcha);
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      const signedInUser = await fetchUserDocument(user, extraUserInformation, user);
      setCurrentUser(signedInUser);
    });

    return unsubscribe;
  }, [extraUserInformation]);

  const value = {
    currentUser,
    setCurrentUser,
    login,
    loginWithGoogle,
    logout,
    signupWithEmail,
    signupWithPhone
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
