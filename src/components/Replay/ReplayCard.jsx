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
import { AiFillDelete } from "react-icons/ai";
import { LinkItUrl } from "react-linkify-it";
import { getSuperbaseImage } from "../../config/supabase.config";
import useReplayDelete from "../../hooks/replay/useReplayDelete";
import { useDialog } from "../../hooks/useDialog";
import isValidObjectURL from "../../utils/isValidObjectURL";
import ImageModal from "../common/ImageModal";

const Props = {
  replay: PropTypes.object,
  author: PropTypes.object,
  canDelete: PropTypes.bool,
};

/**
 * @param {Props} props
 * @returns {JSX.Element}
 */
const ReplayCard = (props) => {
  const { replay, author, canDelete } = props;
  const imgDialog = useDialog();

  const containYoutubeLink = replay?.text?.includes("youtube.com/watch?v=");
  const embedId = containYoutubeLink
    ? replay?.text.split("=")[1].slice(0, 11)
    : "";

  // api state
  const [deleteReplay] = useReplayDelete();

  return (
    <>
      <VStack
        width={"full"}
        alignItems={"flex-start"}
        padding={"1"}
        position={"relative"}
      >
        <Box
          width={"full"}
          height={"1px"}
          mb={"2px"}
          bg={
            "linear-gradient(270deg, rgba(88, 101, 242, 0.2) 0%, #5865F2 45.74%, rgba(88, 101, 242, 0.2) 100%)"
          }
        ></Box>
        {replay?.attachments?.length && (
          <HStack flexWrap={"wrap"} gap={"5px"}>
            {replay?.attachments?.map((file) => {
              return (
                <Image
                  key={file}
                  src={isValidObjectURL(file) ? file : getSuperbaseImage(file)}
                  objectFit={"cover"}
                  maxW={"200px"}
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
        <HStack width={"full"} alignItems={"center"} spacing={2}>
          <Avatar src={author?.avatar} size={"sm"} />
          <VStack alignItems={"flex-start"} spacing={0}>
            <HStack alignItems={"center"}>
              <Text color={"#4F5660"} fontWeight={"500"} fontSize={"xs"}>
                {author?.full_name}
              </Text>
              <Text fontSize={"12px"}>
                {new Date(
                  replay?.created_at || new Date()
                ).toLocaleDateString()}
              </Text>
            </HStack>
            <LinkItUrl className="purple">
              <Text fontSize={"xs"}>{replay?.text}</Text>
            </LinkItUrl>
            {containYoutubeLink && (
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
            )}

            <ImageModal
              isOpen={imgDialog.isOpen}
              onClose={imgDialog.onClose}
              src={replay?.file}
            />
          </VStack>

          {canDelete && (
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
              {canDelete && (
                <Tooltip label="Delete message" fontSize={"xs"}>
                  <span>
                    <AiFillDelete
                      color="red"
                      cursor={"pointer"}
                      onClick={() => deleteReplay(replay?.id)}
                    />
                  </span>
                </Tooltip>
              )}
            </HStack>
          )}
        </HStack>
      </VStack>

      <ImageModal
        isOpen={imgDialog.open}
        onCLose={imgDialog.onClose}
        src={imgDialog.value}
      />
    </>
  );
};

ReplayCard.propTypes = Props;

export default ReplayCard;
