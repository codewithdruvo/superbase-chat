import { HStack, Input, Textarea, VStack } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useCallback, useRef, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { ImAttachment } from "react-icons/im";
import FilePreview from "./FilePreview";

const Props = {
  /** @type {(values: {text: string, file: File}, reset: () => {}) => any} */
  onSubmit: PropTypes.func,
};

/**
 * @param {Props} props
 * @returns {JSX.Element}
 */
const ChatForm = (props) => {
  const { onSubmit } = props;
  const selectedFileRef = useRef(null);

  const [fileType, setFileType] = useState(null);
  const [text, setText] = useState("");
  const [file, setFile] = useState();

  // handle text field change
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // handle select file
  const handleSelectFile = (e) => {
    setFile(e.target.files[0]);
    setFileType(e.target.files[0].type.split("/")[1]);
  };

  // handle reset fields
  const handleReset = () => {
    setFile(null);
    setText("");
  };

  // handle send message
  const handleSendMessage = useCallback(async () => {
    if ((text && text.trim().length) || file) {
      onSubmit({ file, text }, handleReset);
    }
  }, [text, file, onSubmit]);

  return (
    <VStack
      background={"#f2f2f2"}
      borderRadius={"10px"}
      alignItems={"flex-start"}
      width={"full"}
    >
      {file && (
        <FilePreview
          clearFile={() => setFile(null)}
          file={file}
          fileType={fileType}
        />
      )}
      <HStack width={"full"} py={"10px"} pr={"10px"} pl={"20px"}>
        <ImAttachment
          fontSize={"20px"}
          style={{ cursor: "pointer" }}
          color="#4F5660"
          onClick={() => selectedFileRef.current?.click()}
        />

        <Input
          type="file"
          ref={selectedFileRef}
          onChange={handleSelectFile}
          hidden
          accept={"image/*,video/mp4,video/x-m4v,video/*,.pdf"}
          multiple={false}
        />

        <Textarea
          placeholder="Send message to this channel"
          minH={"30px"}
          resize={"none"}
          border={"none"}
          outline={"none"}
          _focusVisible={{ outline: "none" }}
          value={text}
          onChange={handleTextChange}
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === "enter") {
              handleSendMessage();
            }
          }}
        />

        <HStack
          cursor={"pointer"}
          padding={"10px"}
          background={"#1180fe"}
          borderRadius={"full"}
          onClick={() => handleSendMessage()}
        >
          <AiOutlineSend color="#fff" />
        </HStack>
      </HStack>
    </VStack>
  );
};

ChatForm.propTypes = Props;

export default ChatForm;
