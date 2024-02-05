import {
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";

const ImageModal = (props) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size={"xl"}>
      <ModalOverlay />

      <ModalContent>
        <ModalCloseButton />

        <ModalBody>
          <Image src={props.src} width={"full"} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default ImageModal;
