import { useEffect, useState } from "react";
import { getReplies } from "../../services/supabase";

function useReplies(messageId) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async (id) => {
    // reset state
    setIsLoading(true);
    setIsError(false);
    setData([]);

    const response = await getReplies(id);

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
    if (messageId) {
      fetchData(messageId);
    }
  }, [messageId]);

  return {
    isLoading,
    isError,
    data,
    update: setData,
  };
}

export default useReplies;
