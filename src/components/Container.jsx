import { Box, HStack } from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";
import LeftSideBar from "./LeftSideBar";
import MessageList from "./Message/MessageList";
import RightSideBar from "./RightSideBar";

function Container() {
  const { user } = useAuth();
  return (
    <HStack width={"full"}>
      <Box display={["none", "none", "block"]}>
        <LeftSideBar />
      </Box>

      <MessageList />
      <RightSideBar peerId={user.uid} display={["none", "none", "flex"]} />
    </HStack>
  );
}

export default Container;
