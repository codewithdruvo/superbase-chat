/**
 * @param {string} strArr
 * @returns {Array | null}
 */
const parseStringArray = (strArr) => {
  if (!strArr || typeof strArr !== "string") return null;
  let arrayString = strArr;

  // Remove surrounding double quotes
  arrayString = strArr.replace(/^"|"$/g, "");

  // Parse the string into a JavaScript array
  var parsedArray = JSON.parse(arrayString);

  return parsedArray;
};

export default parseStringArray;
