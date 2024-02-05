import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "../config/firebase.config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

//login
async function loginWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    const { user } = await signInWithPopup(auth, provider);

    // await collection(db, "members").doc(user.uid).set({
    //   uid: user.uid,
    //   displayName: user.displayName,
    //   displayPicture: user.photoURL,
    //   email: user.email,
    //   provider: user.providerData[0].providerId,
    // });

    const member = {
      uid: user.uid,
      displayName: user.displayName,
      displayPicture: user.photoURL,
      email: user.email,
      provider: user.providerData[0].providerId,
      detailsUpdated: false,
    };
    await setDoc(doc(db, "members", user.uid), member);
    return {
      uid: user.uid,
      displayName: user.displayName,
      displayPicture: user.photoURL,
      email: user.email,
    };
  } catch (error) {
    if (error.code !== "auth/cancelled-popup-request") {
      console.error(error);
    }

    return null;
  }
}

//Logout user

const handleLogout = async () => {
  const logout = await getAuth().signOut();
  return logout;
};

//Write message document to firestore
async function sendMessage(path, channelId, user, text) {
  try {
    if (path === "channels") {
      const docRef = await addDoc(
        collection(db, "chat-channels", channelId, "messages"),
        {
          uid: user.uid,
          displayName: user.displayName,
          text: text.trim(),
          timestamp: serverTimestamp(),
          displayPicture: user.photoURL,
        }
      );
      return docRef;
    } else if (path === "dms") {
      const docRef = await addDoc(
        collection(db, "dms", channelId, "messages"),
        {
          uid: user.uid,
          displayName: user.displayName,
          text: text.trim(),
          timestamp: serverTimestamp(),
          displayPicture: user.photoURL,
        }
      );
      return docRef;
    }
  } catch (error) {
    console.error(error);
  }
}
// Create member document in firestor
async function updateMember(memberID, data) {
  try {
    const memberDocRef = doc(db, "members", memberID);
    await updateDoc(memberDocRef, data);
    return true;
  } catch (error) {
    console.log(error);
  }
}
async function createUser(user) {
  try {
    const userDocRef = await addDoc(collection(db, "userData"), user);
    return userDocRef;
  } catch (error) {
    console.log(error);
  }
}

async function queryUser(id) {
  const userRef = doc(db, "members", id);
  try {
    const docsSnap = await getDoc(userRef);
    return docsSnap;
  } catch (error) {
    console.log(error);
  }
}

//Reply message
function replyMessage(path, channelId, messageId, replies) {
  const messageRef = doc(
    db,
    path === "channels" ? "chat-channels" : path,
    channelId,
    "messages",
    messageId
  );
  updateDoc(messageRef, {
    replies: replies,
  });
}
//delete message
function deleteMessage(channelId, messageId) {
  const messageRef = doc(db, "chat-channels", channelId, "messages", messageId);
  deleteDoc(messageRef);
}
// update user subcsription status
async function updateUser(param, paramvalue, assign) {
  const colRef = await queryUser(param, paramvalue);
  const userRef = doc(db, "members", colRef.docs[0].id);

  const updateRef = await updateDoc(userRef, { subscribed: assign });
  if (updateRef) {
    return true;
  } else {
    return false;
  }
}

// Read messages documents from firestore
function getMessages(path, roomId, callback) {
  return onSnapshot(
    query(
      collection(
        db,
        path === "channels" ? "chat-channels" : path,
        roomId,
        "messages"
      ),
      orderBy("timestamp", "asc")
    ),
    (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(messages);
    }
  );
}

async function fetchUsers() {
  const querySnapshot = await getDocs(collection(db, "members"));

  const members = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    displayName: doc.data().displayName,
    displayPicture: doc.data().displayPicture,
    company: doc.data()?.company_name,
    about: doc.data()?.company_description,
  }));

  return members;
}
// Get single message from firestroe
export {
  app,
  createUser,
  deleteMessage,
  fetchUsers,
  getMessages,
  handleLogout,
  loginWithGoogle,
  queryUser,
  replyMessage,
  sendMessage,
  storage,
  updateMember,
  updateUser,
};
