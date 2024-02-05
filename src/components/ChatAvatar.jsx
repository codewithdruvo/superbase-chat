import React from "react";
import { Avatar, Box, HStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

const ChatAvatar = ({ image_url, id, showActive }) => {
  return (
    <HStack spacing={2}>
      {showActive && (
        <Box
          borderRightRadius={"5px"}
          borderRight={"5px solid #000"}
          height={"20px"}
        ></Box>
      )}

      <Avatar
        as={motion.div}
        size={"sm"}
        src={image_url}
        _hover={{ borderRadius: "lg" }}
        transition={"border-radius 0.5s ease"}
        cursor={"pointer"}
      />
    </HStack>
  );
};

export default ChatAvatar;
