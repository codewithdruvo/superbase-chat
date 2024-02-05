import { useEffect, useState } from "react";
import { getChannels } from "../services/supabase";

function useChannels() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    // reset state
    setIsLoading(true);
    setIsError(false);
    setData([]);

    const response = await getChannels();

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
    fetchData();
  }, []);

  return {
    isLoading,
    isError,
    data,
  };
}

export default useChannels;
