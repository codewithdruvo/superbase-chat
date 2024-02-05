import React, { useEffect, useState } from "react";

import { Button, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { createCheckoutSession } from "../../services/createCheckoutSession";
import { updateUser } from "../../services/firebase";
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      "pk_test_51NFb4aKxqE4k52I9dcZuEbDooRxb4Xbm5vKbkkAyZNNSYmKYBAdcmjNR6QSk2V9a4q9wZS1EUVh7TTnG1cEdgcWp00SyXrMrqV"
    );
    return stripePromise;
  }
};
const Subscribe = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const item = {
    price: "price_1NFbDjKxqE4k52I9tC0Esapp",
    quantity: 1,
  };
  const checkoutOptions = {
    lineItems: [item],
    mode: "subscription",
    successUrl: `${window.location.origin}/success`,
    cancelUrl: `${window.location.origin}/cancel`,
  };

  const redirectToCheckout = async () => {
    console.log("redirect to checkout");
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout(checkoutOptions);
    console.log(`The error is ${error}`);
  };
  const onSubscribe = async () => {
    setIsSubmitting(true);
    const status = await updateUser("uid", user.uid, true);
    console.log(status);

    if (status === true) {
      setIsSubmitting(false);
      navigate("/general");
    }
  };
  useEffect(() => {
    setLoading(true);
    if (user) {
      setLoading(false);
      console.log(user);
    }
    // if (user === null) {
    //   navigate("/onboarding");
    // }
    // const getUserStatus = async () => {
    //   const userData = await queryUser(user.uid);
    //   if (!user) {
    //     // alert(users.docs[0].id);
    //   }
    // };
    // getUserStatus();
  }, [user]);

  return (
    <>
      <HStack height={"100vh"} overflow={"scroll"}>
        <VStack
          flex={1.5}
          height={"100vh"}
          justifyContent={"center"}
          width={"full"}
          alignItems={"center"}
          gap={5}
          position={"relative"}
          bgImage={"/assets/images/transparentwaves.jpg"}
        >
          <Image width={"200px"} src="/assets/images/Launch-Logo-Updated.png" />
          <Text fontWeight={"bold"}>Ugrade To Free Premium</Text>
          <Text fontSize={"xl"} textAlign={"center"}>
            Ready to Start Your 30 days FREE?
          </Text>
          <Button
            isLoading={isSubmitting}
            onClick={() => createCheckoutSession(user.uid)}
          >
            Start Your Trial Now!
          </Button>
        </VStack>

        <VStack
          display={["none", "none", "flex"]}
          flex={2}
          height={"100vh"}
          backgroundImage={
            "url(https://cofounderslab.com/assets/images/auth-splash.jpg)"
          }
          bgSize={"cover"}
          bgPosition={"center"}
        ></VStack>
      </HStack>
    </>
  );
};

export default Subscribe;
