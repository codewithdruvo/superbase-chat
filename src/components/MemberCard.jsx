import {
  Avatar,
  HStack,
  Popover,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import paths from "../router/routes";

const Props = {
  avatar: PropTypes.string,
  full_name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

/**
 * @param {Props} props
 * @returns {JSX.Element}
 */
const MemberCard = (props) => {
  const { avatar, full_name, id } = props;

  const navigate = useNavigate();

  return (
    <Popover>
      <HStack
        width={"full"}
        alignItems={"center"}
        gap={"10px"}
        _hover={{ color: "#5858df" }}
      >
        <PopoverTrigger>
          <Avatar cursor={"pointer"} size={"sm"} src={avatar} />
        </PopoverTrigger>

        <Text
          fontSize={"sm"}
          cursor={"pointer"}
          onClick={() => navigate(paths.dm(id))}
        >
          {full_name}
        </Text>
      </HStack>
    </Popover>
  );
};

MemberCard.propTypes = Props;
export default MemberCard;
