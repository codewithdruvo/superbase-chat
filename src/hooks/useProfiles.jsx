import { useEffect, useState } from "react";
import { getProfiles } from "../services/supabase";

function useProfiles() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    // reset state
    setIsLoading(true);
    setIsError(false);
    setData([]);

    const response = await getProfiles();

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
    update: setData,
  };
}

export default useProfiles;
