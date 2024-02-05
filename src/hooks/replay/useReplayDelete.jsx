import { useCallback, useMemo, useState } from "react";
import { deleteReplay } from "../../services/supabase";

const useReplayDelete = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState(undefined);

  const action = useCallback(async (id) => {
    // reset state
    setIsLoading(true);
    setIsError(false);
    setData(undefined);

    const response = await deleteReplay(id);

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

    return response;
  }, []);

  const states = useMemo(
    () => ({
      isLoading,
      isError,
      data,
    }),
    [data, isError, isLoading]
  );

  return [action, states];
};

export default useReplayDelete;
