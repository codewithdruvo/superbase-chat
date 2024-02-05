import { createClient } from "@supabase/supabase-js";
import supabaseConfig, {
  supabaseBuckets,
  supabaseTables,
} from "../config/supabase.config";
import getExtension from "../utils/getExtension";

export const supabase = createClient(...supabaseConfig);

// auth functions
export const authSignout = supabase.auth.signOut;
export const authStateChange = supabase.auth.onAuthStateChange;
export const authSession = supabase.auth.getSession;

// send message function
export const sendMessage = async (text, channelId, attachments) => {
  try {
    const message = {
      text,
      channel_id: channelId,
      attachments,
    };
    const response = await supabase
      .from(supabaseTables.messages)
      .insert(message)
      .select();
    const { data, error } = response;

    if (error) throw error;
    return { data: data?.[0] || null };
  } catch (error) {
    console.error("Send Message Error: ", error);
    return { error };
  }
};

// add message attachments function
export const addMessageAttachments = async (messageId, attachments) => {
  try {
    const message = {
      attachments,
    };
    const response = await supabase
      .from(supabaseTables.messages)
      .update(message)
      .eq("id", messageId)
      .select();

    const { data, error } = response;

    if (error) throw error;
    return { data: data?.[0] || null };
  } catch (error) {
    console.error("Update Message File Error: ", error);
    return { error };
  }
};

// replay messsage function
export const replyMessage = async (text, messageId, attachments) => {
  try {
    const reply = {
      text,
      message_id: messageId,
      attachments,
    };
    const response = await supabase
      .from(supabaseTables.replies)
      .insert(reply)
      .select();
    const { data, error } = response;

    if (error) throw error;
    return { data: data?.[0] || null };
  } catch (error) {
    console.error("Send Replay Error: ", error);
    return { error };
  }
};

// add replay attachments function
export const addReplayAttachments = async (replayId, attachments) => {
  try {
    const replay = {
      attachments,
    };
    const response = await supabase
      .from(supabaseTables.replies)
      .update(replay)
      .eq("id", replayId)
      .select();

    const { data, error } = response;

    if (error) throw error;
    return { data: data?.[0] || null };
  } catch (error) {
    console.error("Update Replay File Error: ", error);
    return { error };
  }
};

// delete message function
export const deleteMessage = async (messageId) => {
  try {
    const response = await supabase
      .from(supabaseTables.messages)
      .delete()
      .eq("id", messageId);
    const { data, error } = response;

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error("Delete Message Error: ", error);
    return { error };
  }
};

// delete replay function
export const deleteReplay = async (replayId) => {
  try {
    const response = await supabase
      .from(supabaseTables.replies)
      .delete()
      .eq("id", replayId);
    const { data, error } = response;

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error("Delete Replay Error: ", error);
    return { error };
  }
};

// get messages
export const getMessages = async (channelId) => {
  try {
    const response = await supabase
      .from(supabaseTables.messages)
      .select(`*, profiles(full_name, avatar, id)`)
      .eq("channel_id", channelId);
    const { data, error } = response;

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error("Get Messages Error: ", error);
    return { error };
  }
};

// get replies
export const getReplies = async (messageId) => {
  try {
    const response = await supabase
      .from(supabaseTables.replies)
      .select(`*, profiles(full_name, avatar, id)`)
      .eq("message_id", messageId);
    const { data, error } = response;

    if (error) throw error;

    return { data };
  } catch (error) {
    console.error("Get Replies Error: ", error);
    return { error };
  }
};

// get profiles
export const getProfiles = async () => {
  try {
    const response = await supabase.from(supabaseTables.profiles).select("*");
    const { data, error } = response;

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error("Get Profiles Error: ", error);
    return { error };
  }
};

// get channels
export const getChannels = async () => {
  try {
    const response = await supabase.from(supabaseTables.channels).select("*");
    const { data, error } = response;

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error("Get Channels Error: ", error);
    return { error };
  }
};

// get channel
export const getChannel = async (id) => {
  try {
    const response = await supabase
      .from(supabaseTables.channels)
      .select("*")
      .eq("id", id)
      .single();
    const { data, error } = response;

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error("Get Channel By id Error: ", error);
    return { error };
  }
};

// upload file
export const uploadFile = async (file, parentFolder, subFolder, fileId) => {
  try {
    const extension = getExtension(file);
    if (!extension) throw new Error("Invalid file extension");

    const path = `${parentFolder}/${subFolder}/${fileId}.${extension}`;

    const response = await supabase.storage
      .from(supabaseBuckets.chat)
      .upload(path, file);

    const { data, error } = response;

    if (error) throw error;

    return { data };
  } catch (error) {
    console.log("Upload file error:", error);
    return { error };
  }
};

// delete files
export const deleteFiles = async (files) => {
  try {
    const response = await supabase.storage
      .from(supabaseBuckets.chat)
      .remove(files);

    const { data, error } = response;

    if (error) throw error;

    return { data };
  } catch (error) {
    console.log("Upload file error:", error);
    return { error };
  }
};
