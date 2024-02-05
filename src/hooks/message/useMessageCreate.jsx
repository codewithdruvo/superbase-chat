import { useCallback, useMemo, useState } from "react";
import { supabaseFolders } from "../../config/supabase.config";
import {
  addMessageAttachments,
  deleteFiles,
  deleteMessage,
  sendMessage,
  uploadFile,
} from "../../services/supabase";

const useMessageCreate = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState(undefined);

  const action = useCallback(async (text, file, channelId) => {
    // message id
    let messageId;
    // uploaded files
    let files = [];

    try {
      // reset state
      setIsLoading(true);
      setIsError(false);
      setData(undefined);

      // file path
      let filePath;

      // object url
      if (file) filePath = URL.createObjectURL(file);

      const createResponse = await sendMessage(text, channelId, [filePath]);

      // if there is error then stop execution
      if (createResponse?.error) throw createResponse.error;

      // update id
      if (!createResponse?.data?.id) throw new Error("Message id not found");
      messageId = createResponse?.data?.id;

      // if there is no file path the stop execution and return
      if (!filePath) return { data: createResponse.data };

      // upload attached file
      const uploadResponse = await uploadFile(
        file,
        supabaseFolders.channel,
        channelId,
        messageId
      );

      // if there is upload error then stop execution
      if (uploadResponse?.error || !uploadResponse?.data?.path)
        throw uploadResponse?.error;

      filePath = uploadResponse?.data?.fullPath;
      files.push(filePath);

      const updateResponse = await addMessageAttachments(messageId, [filePath]);

      // if there is update error then stop execution
      if (updateResponse?.error || !updateResponse.data)
        throw updateResponse?.error;

      return { data: updateResponse?.data };
    } catch (error) {
      console.log("Error:", error);

      // delete uploaded files - if uploaded
      if (files?.length) deleteFiles(files);

      // delete if there is any error
      if (messageId) deleteMessage(messageId);

      setIsError(true);
      setIsLoading(false);
      return { error };
    }
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

export default useMessageCreate;
