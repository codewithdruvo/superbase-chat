import {
  Avatar,
  Box,
  HStack,
  Image,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useCallback, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BsFillReplyFill } from "react-icons/bs";
import { HiOutlineReply } from "react-icons/hi";
import { LinkItUrl } from "react-linkify-it";
import useMessageDelete from "../../hooks/message/useMessageDelete";

import { getSuperbaseImage } from "../../config/supabase.config";
import useChat from "../../hooks/useChat";
import { useDialog } from "../../hooks/useDialog";
import isValidObjectURL from "../../utils/isValidObjectURL";
import ImageModal from "../common/ImageModal";

const Props = {
  message: PropTypes.object,
  author: PropTypes.object,
  canDelete: PropTypes.bool,
};

/**
 * @param {Props} props
 * @returns {JSX.Element}
 */

const MessageCard = (props) => {
  const { message, author, canDelete } = props;

  const { updateThreadId } = useChat();

  const imgDialog = useDialog();
  const [showAction, setShowAction] = useState(false);

  const containYoutubeLink = message?.text?.includes("youtube.com/watch?v=");
  const embedId = containYoutubeLink
    ? message?.text.split("=")[1].slice(0, 11)
    : "";

  // api state
  const [deleteMessage] = useMessageDelete();

  const handleReplay = useCallback(() => {
    updateThreadId(message?.id);
  }, [message?.id, updateThreadId]);

  return (
    <>
      <VStack
        width={"full"}
        alignItems={"flex-start"}
        onMouseEnter={() => setShowAction(true)}
        onMouseLeave={() => setShowAction(false)}
        px={"5px"}
        position={"relative"}
        borderRadius={"md"}
      >
        <Box
          width={"full"}
          height={"1px"}
          mb={"10px"}
          bg={
            "linear-gradient(270deg, rgba(88, 101, 242, 0.2) 0%, #5865F2 45.74%, rgba(88, 101, 242, 0.2) 100%)"
          }
        ></Box>
        <VStack width={"full"} alignItems={"flex-start"}>
          {message?.attachments?.length && (
            <HStack flexWrap={"wrap"} gap={"5px"}>
              {message?.attachments?.map((file) => {
                return (
                  <Image
                    key={file}
                    src={
                      isValidObjectURL(file) ? file : getSuperbaseImage(file)
                    }
                    objectFit={"cover"}
                    maxW={["200px", "200px", "200px", "400px"]}
                    borderRadius={"10px"}
                    cursor={"pointer"}
                    onClick={() =>
                      imgDialog.onOpen(
                        isValidObjectURL(file) ? file : getSuperbaseImage(file)
                      )
                    }
                  />
                );
              })}
            </HStack>
          )}

          <HStack
            width={"full"}
            alignItems={"center"}
            spacing={2}
            color={"#4F5660"}
          >
            <Avatar src={author?.avatar} size={"md"} />
            <VStack alignItems={"flex-start"} spacing={1}>
              <HStack alignItems={"center"}>
                <Text color={"#4F5660"} fontWeight={"500"} fontSize={"xs"}>
                  {author?.full_name}
                </Text>
                <Text fontSize={"12px"}>
                  {new Date(
                    message?.created_at || new Date()
                  ).toLocaleDateString()}
                </Text>
              </HStack>
              <LinkItUrl className="purple">
                <Text fontSize={"14px"}>{message?.text}</Text>
              </LinkItUrl>
              {containYoutubeLink ? (
                <Box borderRadius={"10px"}>
                  <iframe
                    width="300px"
                    height="150px"
                    src={`https://www.youtube.com/embed/${embedId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Embedded youtube"
                    style={{ borderRadius: "10px" }}
                  />
                </Box>
              ) : (
                ""
              )}
            </VStack>

            {showAction && (
              <HStack
                padding={2}
                width={"50px"}
                position={"absolute"}
                right={2}
                border={"1px solid gray"}
                bg={"#fff"}
                justifyContent={"center"}
                borderRadius={"md"}
                top={5}
              >
                <Tooltip label="Reply in thread" fontSize={"xs"}>
                  <span>
                    <BsFillReplyFill
                      onClick={handleReplay}
                      cursor={"pointer"}
                    />
                  </span>
                </Tooltip>
                {canDelete && (
                  <Tooltip label="Delete message" fontSize={"xs"}>
                    <span>
                      <AiFillDelete
                        color="red"
                        cursor={"pointer"}
                        onClick={() => deleteMessage(message?.id)}
                      />
                    </span>
                  </Tooltip>
                )}
              </HStack>
            )}
          </HStack>
        </VStack>
        {message?.replies && (
          <HStack
            alignItems={"flex-end"}
            spacing={1}
            padding={"2"}
            color="#5865F2"
            cursor={"pointer"}
            onClick={handleReplay}
            ml={"40px !important"}
          >
            <HiOutlineReply fontSize={"24px"} color="#5865F2" />
            <Text fontSize={"xs"}>
              {message?.replies?.length}{" "}
              {message?.replies?.length > 1 ? "Replies" : "Reply"}
            </Text>
          </HStack>
        )}
      </VStack>

      <ImageModal
        isOpen={imgDialog.open}
        onCLose={imgDialog.onClose}
        src={imgDialog.value}
      />
    </>
  );
};

MessageCard.propTypes = Props;

export default MessageCard;
