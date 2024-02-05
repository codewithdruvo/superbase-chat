import { loadStripe } from "@stripe/stripe-js";
import envConfig from "../config/env.cofig";

let stripePromise;
const getStripe = async () => {
  if (!stripePromise) {
    stripePromise = await loadStripe(envConfig.STRIPE_KEY);
    return stripePromise;
  }
};

export default getStripe;
