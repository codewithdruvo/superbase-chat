import { useEffect, useState } from "react";
import { getMessages } from "../../services/supabase";

function useMessages(channelId) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async (id) => {
    // reset state
    setIsLoading(true);
    setIsError(false);
    setData([]);

    const response = await getMessages(id);

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
    if (channelId) {
      fetchData(channelId);
    }
  }, [channelId]);

  return {
    isLoading,
    isError,
    data,
    update: setData,
  };
}

export default useMessages;
