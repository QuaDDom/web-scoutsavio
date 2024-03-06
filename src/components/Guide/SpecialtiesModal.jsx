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

export const SpecialtiesModal = ({ img, specialtie, color, colorname, about }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <Card className="w-[200px]">
        <CardBody onClick={onOpen}>
          <Image isBlurred src={img} alt={specialtie} />
        </CardBody>
      </Card>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-2xl">{specialtie}</ModalHeader>
          <ModalBody>
            <Image isBlurred src={img} alt={specialtie} width={'200px'} />
            <Chip
              classNames={{
                base: `bg-${color}`,
                content: 'text-black'
              }}>
              Color representativo: {colorname}
            </Chip>
            <p>{about}</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
