import envConfig from "./env.cofig";

const supabaseConfig = [envConfig.SUPABASE_URL, envConfig.SUPABASE_ANON];

export default supabaseConfig;

export const supabaseTables = {
  profiles: "profiles",
  channels: "channels",
  messages: "messages",
  replies: "replies",
};

export const supabaseBuckets = {
  chat: "chat",
};

export const supabaseFolders = {
  channel: "channel",
  dm: "dm",
};

export const SUPERBASE_BUCKET =
  "https://htxfdyopgwdtunzmsvtt.supabase.co/storage/v1/object/public";
export const getSuperbaseImage = (path) => `${SUPERBASE_BUCKET}/${path}`;
