import { Box, HStack } from "@chakra-ui/react";
import LeftSideBar from "../../components/LeftSideBar";
import RightSideBar from "../../components/RightSideBar";
import useAuth from "../../hooks/useAuth";

function Chat() {
  const { metadata } = useAuth();

  return (
    <>
      <HStack width={"full"}>
        <LeftSideBar>
          <RightSideBar peerId={metadata?.uid} display={"flex"} />
        </LeftSideBar>
        <Box height={"100vh"}></Box>
      </HStack>
    </>
  );
}

export default Chat;
