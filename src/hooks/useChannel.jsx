import { useEffect, useState } from "react";
import { getChannel } from "../services/supabase";

function useChannel(id) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState(undefined);

  const fetchData = async (id) => {
    // reset state
    setIsLoading(true);
    setIsError(false);
    setData(undefined);

    const response = await getChannel(id);

    // handle error state
    if (response?.error) {
      setIsError(true);
    }
    // handle success state
    else {
      setData(response.data);
    }

    // stop loading state
    setIsLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  return {
    isLoading,
    isError,
    data,
  };
}

export default useChannel;
