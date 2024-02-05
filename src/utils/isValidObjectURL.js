const isValidObjectURL = (urlString) => {
  try {
    var url = new URL(urlString);
    return url.protocol === "blob:" || url.protocol === "data:";
  } catch (error) {
    return false;
  }
};

export default isValidObjectURL;
