import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { supabaseTables } from "../config/supabase.config";
import useMessages from "../hooks/message/useMessages";
import useReplies from "../hooks/replay/useReplies";
import useChannels from "../hooks/useChannels";
import useProfiles from "../hooks/useProfiles";
import { supabase } from "../services/supabase";

const defaultValues = {
  messages: {
    data: [],
    isLoading: true,
    isError: false,
  },
  replies: {
    data: [],
    isLoading: true,
    isError: false,
  },
  users: {
    data: [],
    isLoading: true,
    isError: false,
  },
  channels: {
    data: [],
    isLoading: true,
    isError: false,
  },
  chatId: null,
  threadId: null,
  updateChatId: () => {},
  updateThreadId: () => {},
};

export const ChatContext = createContext(defaultValues);

/**
 * @param {Props} props
 * @returns {JSX.Element}
 */
export const ChatProvider = (props) => {
  const { children } = props;

  // url states
  const params = useParams();
  const urlChatId = params?.chatId;

  // app state
  const [chatId, setChatId] = useState(urlChatId || null);
  const [threadId, setThreadId] = useState(null);

  // api state
  const users = useProfiles();
  const channels = useChannels();
  const messages = useMessages(chatId, users?.data || []);
  const replies = useReplies(threadId, users?.data || []);

  // update chat id
  const updateChatId = useCallback((id) => setChatId(id), []);
  // update thread id
  const updateThreadId = useCallback((id) => setThreadId(id), []);

  // memorized value
  const value = useMemo(
    () => ({
      users,
      channels,
      messages,
      replies,
      updateChatId,
      updateThreadId,
      chatId,
      threadId,
    }),
    [
      channels,
      chatId,
      messages,
      replies,
      threadId,
      updateChatId,
      updateThreadId,
      users,
    ]
  );

  // update message
  const structureMessage = useCallback(
    (message) => {
      const profiles = users?.data?.find((p) => p.id === message.sender_id);

      if (!profiles) {
        console.log("User Profiles not updated");
        return message;
      }

      return { ...message, profiles };
    },
    [users?.data]
  );

  // invoke on url states
  useEffect(() => {
    setChatId(urlChatId || null);
  }, [urlChatId]);

  useEffect(() => {
    const channel = supabase
      .channel("CHAT")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: supabaseTables.profiles },
        (payload) => {
          const newProfile = payload.new;

          users.update((prev) => {
            const prevData = [...prev];

            if (!prev.find((profile) => profile.id === newProfile.id)) {
              prevData.push(newProfile);
            }

            return prevData;
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: supabaseTables.messages,
          filter: chatId ? `channel_id=eq.${chatId}` : undefined,
        },
        (payload) => {
          const newMessage = payload.new;

          messages.update((prev) => {
            const prevM = [...prev];

            if (!prev.find((message) => message.id === newMessage.id)) {
              prevM.push(structureMessage(newMessage));
            }

            return prevM;
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: supabaseTables.messages,
          filter: chatId ? `channel_id=eq.${chatId}` : undefined,
        },
        (payload) => {
          // console.log(payload);
          const oldMessage = payload.old;

          messages.update((prev) => {
            const prevM = [...prev].filter((i) => i?.id !== oldMessage?.id);

            return prevM;
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: supabaseTables.messages,
          filter: chatId ? `channel_id=eq.${chatId}` : undefined,
        },
        (payload) => {
          // console.log(payload);
          const newMessage = payload.new;

          messages.update((prev) => {
            const prevM = [...prev];

            const updateIndex = prev.findIndex(
              (message) => message.id === newMessage.id
            );

            if (updateIndex !== -1) {
              const prevMessage = prev[updateIndex];
              const structure = { ...prevMessage, ...newMessage };
              structure.profiles = prevMessage?.profiles;
              prevM[updateIndex] = structure;
            }

            return prevM;
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: supabaseTables.replies,
          filter: threadId ? `message_id=eq.${threadId}` : undefined,
        },
        (payload) => {
          console.log(payload);
          const newReply = payload.new;

          replies.update((prev) => {
            const prevM = [...prev];

            if (!prev.find((message) => message.id === newReply.id)) {
              prevM.push(structureMessage(newReply));
            }

            return prevM;
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: supabaseTables.replies,
          filter: threadId ? `message_id=eq.${threadId}` : undefined,
        },
        (payload) => {
          // console.log(payload);
          const oldReplay = payload.old;

          replies.update((prev) => {
            const prevM = [...prev].filter((i) => i?.id !== oldReplay?.id);

            return prevM;
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: supabaseTables.replies,
          filter: threadId ? `message_id=eq.${threadId}` : undefined,
        },
        (payload) => {
          // console.log(payload);
          const newReplay = payload.new;

          messages.update((prev) => {
            const prevM = [...prev];

            const updateIndex = prev.findIndex(
              (replay) => replay.id === newReplay.id
            );

            if (updateIndex !== -1) {
              const prevReplay = prev[updateIndex];
              const structure = { ...prevReplay, ...newReplay };
              structure.profiles = prevReplay?.profiles;
              prevM[updateIndex] = structure;
            }

            return prevM;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      console.log("REMOVE CHANNEL: CHAT");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structureMessage, threadId, chatId]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

const Props = {
  children: PropTypes.node,
};
ChatProvider.propTypes = Props;
