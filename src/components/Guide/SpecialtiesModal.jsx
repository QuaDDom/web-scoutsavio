import React from 'react';
import {
  Card,
  Image,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Chip
} from '@nextui-org/react';

export const SpecialtiesCard = ({ img, specialtie, color, colorname, about }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleClick = () => setIsOpen(!isOpen);

  return (
    <>
      <Card className=" dark:bg-default-100/50 w-[350px] p-5" onClick={handleClick}>
        <CardBody>
          <Image isBlurred src={img} alt={especialidad} />
          <p>{especialidad}</p>
        </CardBody>
      </Card>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-2xl">{specialtie}</ModalHeader>
          <ModalBody>
            <Image isBlurred src={img} alt={especialidad} />
            <Chip color={color}>Color representativo: {colorname}</Chip>
            <p>{info}</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
