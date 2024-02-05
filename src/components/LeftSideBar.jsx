import { Avatar, Box, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { AiOutlineLogout } from "react-icons/ai";
import { FaSuitcase } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useChat from "../hooks/useChat";
import paths from "../router/routes";
import ChatAvatar from "./ChatAvatar";
const sideBarImage = [
  "https://i.postimg.cc/ZK7ngyd5/img1.png",
  "https://i.postimg.cc/Gm623wz0/img2.png",
  "https://i.postimg.cc/qRTvns9j/img3.png",
  "https://i.postimg.cc/W4r4hWfd/img4.png",
];

const RenderChannels = (props) => {
  const { isLoading, isError, data, currentChannel } = props;
  if (isError && !isLoading) {
    return <>Something went to wrong</>;
  }

  if (!isLoading && !data?.length) {
    return <>No Channel Found</>;
  }

  if (!isLoading && data) {
    return data?.map(({ id, title }) => {
      return (
        <Link
          style={{ width: "100%" }}
          key={id}
          to={paths.channels.details(id)}
        >
          <HStack
            justifyContent={"flex-start"}
            borderRadius={"5px"}
            width={"full"}
            bg={currentChannel === id ? "#5865F2" : ""}
            _hover={{ bg: "#5865F2", color: "#fff" }}
            gap={"1"}
            padding={"10px"}
            cursor={"pointer"}
            color={currentChannel === id ? "#fff" : "#4F5660"}
          >
            <Box>
              <FaSuitcase fontSize={"24px"} />
            </Box>

            <Text fontSize={"14px"}>{title}</Text>
          </HStack>
        </Link>
      );
    });
  }

  return <>Loading</>;
};

const LeftSideBar = (props) => {
  const { signout, metadata } = useAuth();

  const navigate = useNavigate();
  const params = useParams();
  const channelId = params.id;

  // api state
  const { channels } = useChat();

  return (
    <HStack height={"100vh"} spacing={0} flex={2}>
      <VStack
        bg={"#e3e5e8"}
        gap={"50px"}
        height={"100vh"}
        p={"20px 10px"}
        display={"none"}
      >
        <ChatAvatar />
        <VStack justifyContent={"space-between"} gap={"10px"}>
          {sideBarImage.map((image, id) => {
            return <ChatAvatar key={id} image_url={image} showActive={true} />;
          })}
        </VStack>
      </VStack>
      <VStack
        background={"#f2f3f5"}
        height={"100vh"}
        overflowY={"scroll"}
        position={"relative"}
        padding={"20px 10px"}
        width={["full", "full", "auto"]}
      >
        <HStack position={"sticky"} gap={"60px"} alignItems={"center"}>
          <Image
            textAlign={"center"}
            width={"150px"}
            mx={"auto"}
            src="/assets/images/Launch-Logo-Updated.png"
          />
        </HStack>
        <VStack width={"full"}>
          <RenderChannels currentChannel={channelId} {...channels} />
        </VStack>
        <Box width={"full"} overflow={"scroll"}>
          {props.children}
        </Box>
        <Box padding={2} position={"absolute"} bottom={4} mx={1} width={"full"}>
          <HStack
            padding={1}
            bg={"#D9D9D9"}
            width={"full"}
            borderRadius={"10px"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <HStack alignItems={"center"}>
              <Avatar size={"sm"} src={metadata?.avatar_url} />
              <VStack alignItems={"flex-start"} spacing={0}>
                <Text fontSize={"12px"} color={"#4F5660"} fontWeight={"500"}>
                  {metadata?.full_name}
                </Text>
              </VStack>
            </HStack>

            <AiOutlineLogout
              cursor={"pointer"}
              onClick={async () => {
                await signout();
                navigate("/login");
              }}
            />
          </HStack>
        </Box>
      </VStack>
    </HStack>
  );
};

export default LeftSideBar;
