import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
// import { subscribe } from "firebase/data-connect";
import {
  addDoc,
  collection,
  getDoc,
  getFirestore,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyAjc8WOstHarBdSRVpcj8Cn7vI7IVlExvU",
  authDomain: "netflix-clone-75336.firebaseapp.com",
  projectId: "netflix-clone-75336",
  storageBucket: "netflix-clone-75336.firebasestorage.app",
  messagingSenderId: "717980867988",
  appId: "1:717980867988:web:6aaf09d08575129ef98381",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const USERS_COLLECTION_NAME = "user";
const signUp = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "user"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
      subscription: {
        status: "inactive",
        planName: null,
        planPrice: null,
        subscribedDate: null,
      },
    });
    toast.success("Account created succesfully!");
  } catch (error) {
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const logout = async () => {
  await signOut(auth);
};

// const getUserSubscription = async (userId) => {
//   try {
//     const q = query(collection(db, "user"), where("uid", "==", userId));
//     const querySnapshot = await getDocs(q);
//     if (!querySnapshot.empty) {
//       const userDoc = querySnapshot.docs[0];
//       return userDoc.data().subscription;
//     }
//     return null;
//   } catch (error) {
//     console.error("Error fetching user subscription:", error);
//     return null;
//   }
// };

const updateSubscriptionStatus = async (userId, status, planDetails = null) => {
  try {
    const q = query(collection(db, "user"), where("uid", "==", userId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDocRef = doc(db, "user", querySnapshot.docs[0].id);
      await updateDoc(userDocRef, {
        subscription: {
          status: status,
          planName: planDetails ? planDetails.name : null,
          planPrice: planDetails ? planDetails.price : null,
          subscribedDate: status === "active" ? new Date().toISOString() : null,
        },
      });
      toast.success("Subscription status updated");
      return true;
    } else {
      console.error("User doc not found to update subsription");
      toast.error("User not found");
      return false;
    }
  } catch (error) {
    console.error("Error updating subscription:", error);
    toast.error("Failed to updated subscription");
    return false;
  }
};

const listenForUserSubscriptionChanges = (userId, callback) => {
  const q = query(collection(db, "user"), where("uid", "==", userId));

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        callback(userDoc.data().subscription);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error("Error listening for user subscription changes:", error);
      toast.error("Failed to get real-time subscription updates.");
      callback(null);
    }
  );
  return unsubscribe;
};

export {
  auth,
  db,
  login,
  signUp,
  logout,
  onAuthStateChanged,
  // getUserSubscription,
  listenForUserSubscriptionChanges,
  updateSubscriptionStatus,
};
