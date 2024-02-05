import { getAuth } from "firebase/auth";

export const isUserPremium = async () => {
  const auth = getAuth();
  await auth.currentUser?.getIdToken(true);
  const decodedToken = await auth.currentUser?.getIdTokenResult();
  console.log("decoded Token", decodedToken);
  // return decodedToken?.claims?.stripeRole ? true : false; // TODO: commented for testing

  return true;
};
