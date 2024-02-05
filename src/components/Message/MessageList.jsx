import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useChat from "../../hooks/useChat";
import paths from "../../router/routes";
import MessageInput from "../ChatInput/MessageInput";
import ReplayList from "../Replay/ReplayList";
import MessageCard from "./MessageCard";

const RenderMessages = (props) => {
  const { user } = useAuth();
  const { data, isLoading, isError } = props;

  if (isError && !isLoading) {
    return <>Error</>;
  }

  if (!isLoading && !data?.length) {
    return <>No message in the channel. Be the first to drop a message!</>;
  }

  if (!isLoading && data) {
    return data?.map((item) => {
      return (
        <MessageCard
          key={item.id}
          author={item?.profiles}
          message={item}
          canDelete={item?.sender_id === user?.id}
        />
      );
    });
  }

  return <>Loading</>;
};

function MessageList() {
  const navigate = useNavigate();
  const lastMessageRef = useRef(null);

  // api state
  const { messages, chatId } = useChat();

  useEffect(() => {
    // 👇️ scroll to bottom every time message, isError, isLoading, ids change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.data]);

  return (
    <>
      <VStack
        height={"100vh"}
        alignItems={"flex-start"}
        justifyContent={"space-between"}
        width={"full"}
        py={"20px"}
        flex={6}
        position={"relative"}
      >
        <HStack
          position={"sticky"}
          display={["flex", "flex", "none"]}
          zIndex={"99"}
          top={0}
          width={"full"}
          pl={"20px"}
          alignItems={"center"}
          gap={"100px"}
          boxShadow={"rgba(169, 170, 176, 0.47) 1px 3px 5px -1px"}
          pb={"10px"}
        >
          <BsArrowLeft
            fontSize={"30px"}
            onClick={() => navigate(paths.channels.root)}
          />
          <Text
            textTransform={"capitalize"}
            fontWeight={"500"}
            color={"#4F5660"}
          >
            {chatId}
          </Text>
        </HStack>
        <VStack
          width={"full"}
          alignItems={"flex-start"}
          height={"800vh"}
          overflowY={"scroll"}
          gap={"10px"}
        >
          <Text
            textAlign={"center"}
            fontWeight={"bold"}
            width={"full"}
            fontSize={"xl"}
            color={"#4F5660"}
          >
            Welcome to CoFoundersLab Launch! Chat
          </Text>
          <RenderMessages {...messages} />
          <Box ref={lastMessageRef}></Box>
        </VStack>
        <MessageInput id={chatId} />
      </VStack>

      <ReplayList />
    </>
  );
}

export default MessageList;
