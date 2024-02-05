import { useCallback } from "react";
import useReplayCreate from "../../hooks/replay/useReplayCreate";
import useChat from "../../hooks/useChat";
import ChatForm from "./ChatForm";

const Props = {};

/**
 * @param {Props} props
 * @returns {JSX.Element}
 */
const ReplayInput = () => {
  const { threadId, chatId } = useChat();

  // api state
  const [createReplay] = useReplayCreate();

  const onSubmit = useCallback(
    async ({ file, text }, reset) => {
      if (!file && !text) return;

      const response = await createReplay(text, file, threadId, chatId);

      console.log("Replay Create:", response);

      reset();
    },
    [chatId, createReplay, threadId]
  );

  return <ChatForm onSubmit={onSubmit} />;
};

ReplayInput.propTypes = Props;

export default ReplayInput;
