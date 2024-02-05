/**
 *
 * @param {File} file
 * @returns {string | null} - extension example: .pdf, .png
 */
function getExtension(file) {
  try {
    const fileName = file?.name;

    if (!fileName || typeof fileName !== "string")
      throw new Error("Invalid file name");

    const extension = fileName.split(".").pop();

    if (!extension || typeof extension !== "string")
      throw new Error("Invalid file extention");

    return extension;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

export default getExtension;
