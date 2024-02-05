import { Flex, Spinner } from "@chakra-ui/react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateOutlet = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isAuthenticated && !isLoading) {
    return <Navigate to={"/login"} />;
  }

  if (isAuthenticated) {
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

export default PrivateOutlet;
