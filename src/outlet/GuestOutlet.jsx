import { Flex, Spinner } from "@chakra-ui/react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { PATH_AFTER_LOGIN } from "../router/routes";

const GuestOutlet = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isAuthenticated && !isLoading) {
    return <Navigate to={PATH_AFTER_LOGIN} />;
  }

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <Flex
      minH={"100vh"}
      width={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Spinner />
    </Flex>
  );
};

export default GuestOutlet;
