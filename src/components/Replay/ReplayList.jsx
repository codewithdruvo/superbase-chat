import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useChat from "../../hooks/useChat";
import ReplayInput from "../ChatInput/ReplayInput";
import ReplayCard from "./ReplayCard";

const RenderContent = (props) => {
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
        <ReplayCard
          key={item.id}
          author={item.profiles}
          replay={item}
          canDelete={item?.sender_id === user?.id}
        />
      );
    });
  }

  return <>Loading</>;
};

const ReplayList = () => {
  const [message, setMessage] = useState(null);
  const { replies, threadId, updateThreadId, messages } = useChat();

  const lastMessageRef = useRef(null);

  const onClose = () => {
    updateThreadId(null);
    setMessage(null);
  };

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [replies?.data]);

  useEffect(() => {
    setMessage(messages?.data?.find((r) => r.id === threadId) || null);
  }, [messages?.data, threadId]);

  return (
    <Drawer
      isOpen={!!threadId || !!message}
      placement="right"
      onClose={onClose}
      size={"md"}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Thread</DrawerHeader>
        <DrawerBody>
          <VStack width={"full"} gap={"4"}>
            <ReplayCard author={message?.profiles} replay={message} />
            <HStack width={"full"}>
              <Text fontSize={"sm"}>
                {replies.data?.length}
                {replies.data?.length > 1 ? " Replies" : " Reply"}
              </Text>
              <hr style={{ width: "80%" }} />
            </HStack>
            <VStack width={"full"}>
              <RenderContent {...replies} />
            </VStack>
            <Box ref={lastMessageRef}></Box>
            <ReplayInput id={threadId} />
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ReplayList;
