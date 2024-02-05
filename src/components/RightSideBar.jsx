import { Box, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useChat from "../hooks/useChat";
import MemberCard from "./MemberCard";

const RenderMembers = (props) => {
  const { isLoading, isError, data } = props;

  if (!isLoading && isError) {
    return <>Something went to wrong</>;
  }

  if (!isLoading && !data?.length) {
    return <>No Members</>;
  }

  if (!isLoading && data.length) {
    return data.map((member) => (
      <MemberCard
        full_name={member.full_name}
        avatar={member.avatar}
        id={member.id}
        key={member.id}
      />
    ));
  }

  return <>Loading</>;
};

const RightSideBar = (props) => {
  // api state
  const { users } = useChat();

  // app state
  const [filteredUser, setFilteredUser] = useState([]);

  // handle search users
  const handleSearch = useEffect(
    (query) => {
      if (users?.data?.length && query) {
        const searchResult = users.data.filter((member) => {
          return member.full_name.toLowerCase().includes(query.toLowerCase());
        });
        setFilteredUser(searchResult);
      } else {
        setFilteredUser([]);
      }
    },
    [users.data]
  );

  return (
    <VStack
      flex={1.5}
      background={"#f2f3f5"}
      height={"100vh"}
      overflowY={"scroll"}
      padding={"40px 10px"}
      display={props.display}
    >
      <HStack position={"sticky"} gap={"60px"} alignItems={"center"}>
        <Text fontSize={"md"} fontWeight={"500"}>
          Members
        </Text>
      </HStack>
      <Input
        placeholder="Search member"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <VStack width={"full"} gap={"10px"}>
        <VStack width={"full"} paddingBottom={"20px"}>
          {filteredUser.length && <RenderMembers data={filteredUser} />}

          <Box
            sx={{
              width: "full",
              height: "1px",
              background:
                "linear-gradient(270deg, rgba(88, 101, 242, 0.2) 0%, #5865F2 45.74%, rgba(88, 101, 242, 0.2) 100%)",
            }}
          ></Box>
        </VStack>
        <RenderMembers {...users} />
      </VStack>
    </VStack>
  );
};

export default RightSideBar;
