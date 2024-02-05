import { app } from "./firebase";
import {
  getFirestore,
  addDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import getStripe from "./initializeStripe";

export const createCheckoutSession = async (uid) => {
  const db = getFirestore(app);

  const docRef = collection(db, "members", uid, "checkout_sessions");
  const checkoutSessionRef = await addDoc(docRef, {
    price: "price_1NNkR5KxqE4k52I9AvRgY0Av",
    success_url: window.location.origin,
    cancel_url: window.location.origin,
  });

  // console.table(
  //   onSnapshot(checkoutSessionRef, async (snap) => {
  //     console.log(snap.id);
  //   })
  // );

  onSnapshot(checkoutSessionRef, async (snap) => {
    const { sessionId } = snap.data();
    console.log(sessionId);
    if (sessionId) {
      console.log(sessionId);
      const stripe = await getStripe();
      stripe.redirectToCheckout({ sessionId });
    }
  });
};

// export async function createCheckoutSession(uid) {
//   const checkoutSessionRef = await firestore
//     .collection("users")
//     .doc(uid)
//     .collection("checkout_sessions")
//     .add({
//       price: "price_HLxRKYrVN3CVzy",
//       // This can be removed if you don't want promo codes
//       allow_promotion_codes: true,
//       success_url: window.location.origin,
//       cancel_url: window.location.origin,
//     });

//   checkoutSessionRef.onSnapshot(async (snap) => {
//     const { sessionId } = snap.data();

//     if (sessionId) {
//       const stripe = await getStripe();

//       stripe.redirectToCheckout({ sessionId });
//     }
//   });
// }
