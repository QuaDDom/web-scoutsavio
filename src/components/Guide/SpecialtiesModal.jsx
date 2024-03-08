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
import './Specialties.scss';

export const SpecialtiesModal = ({ img, specialtie, color, colorname, about }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <Card className="w-[200px] p-2" isPressable>
        <CardBody onClick={onOpen}>
          <Image isBlurred src={img} alt={specialtie} />
        </CardBody>
      </Card>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" className="">
        <ModalContent className="py-4 px-5">
          <ModalHeader className="flex flex-col gap-1 text-2xl">{specialtie}</ModalHeader>
          <ModalBody>
            <div className="flex items-center justify-center gap-5 py-5 border-b-1 border-gray-500">
              <Image isBlurred src={img} alt={specialtie} width={'200px'} />
              <Chip
                classNames={{
                  base: `bg-${color}`,
                  content: 'text-white'
                }}>
                Color representativo: {colorname}
              </Chip>
            </div>
            <p className="text-center">{about}</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
