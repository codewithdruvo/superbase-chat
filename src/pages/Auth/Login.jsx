import { HStack, Image, VStack } from "@chakra-ui/react";
import { SocialAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../../services/supabase";

const LoginPage = () => {
  return (
    <HStack height={"100vh"} overflow={"scroll"}>
      <VStack
        flex={1.5}
        height={"100vh"}
        justifyContent={"center"}
        gap={"20px"}
      >
        <Image width={"300px"} src="/assets/images/Launch-Logo-Updated.png" />
        <SocialAuth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
        />
      </VStack>
      <VStack
        flex={2}
        height={"100vh"}
        backgroundImage={
          "url(https://cofounderslab.com/assets/images/auth-splash.jpg)"
        }
        bgSize={"cover"}
        bgPosition={"center"}
      ></VStack>
    </HStack>
  );
};

export default LoginPage;
