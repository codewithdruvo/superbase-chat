import { Outlet } from "react-router-dom";
import { ChatProvider } from "../context/chatContext";

const ChatOutlet = () => {
  return (
    <ChatProvider>
      <Outlet />
    </ChatProvider>
  );
};

export default ChatOutlet;
