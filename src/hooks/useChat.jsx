import React from "react";
import { ChatContext } from "../context/chatContext";

const useChat = () => {
  const value = React.useContext(ChatContext);

  if (!value) {
    throw new Error("ChatContext's value is undefined.");
  }

  return value;
};

export default useChat;
