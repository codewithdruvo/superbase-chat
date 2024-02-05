import { Box, Image, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { AiFillCloseCircle } from "react-icons/ai";

const Props = {
  file: PropTypes.object,
  clearFile: PropTypes.func,
  fileType: PropTypes.string,
};

const FilePreview = (props) => {
  const { file, clearFile, fileType } = props;
  return (
    <Box padding={"10px"} position={"relative"} width={"full"}>
      <Box
        position={"absolute"}
        top={1}
        right={1}
        onClick={clearFile}
        cursor={"pointer"}
      >
        <AiFillCloseCircle fontSize={"20px"} />
      </Box>
      {fileType === "gif" ||
      fileType === "jpg" ||
      fileType === "png" ||
      fileType === "jpeg" ||
      fileType === "webp" ||
      fileType === "svg+xml" ? (
        <Image
          width={"200px"}
          borderRadius={"10px"}
          src={URL.createObjectURL(file)}
        />
      ) : (
        <Box>
          <Text color={"blue.300"}>{file.name}</Text>
        </Box>
      )}
    </Box>
  );
};

FilePreview.propTypes = Props;

export default FilePreview;
