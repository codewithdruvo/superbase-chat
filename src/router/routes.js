export const PATH_AFTER_LOGIN = "/channels";

const paths = {
  root: "/",
  auth: {
    login: "/login",
  },
  channels: {
    root: "/channels",
    details: (id) => `/channels/${id}`,
  },
  dm: (id) => `/dm/${id}`,
};

export default paths;
