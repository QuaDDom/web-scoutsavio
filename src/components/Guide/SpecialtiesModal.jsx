import React from 'react';
import {
  Card,
  Image,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Chip
} from '@nextui-org/react';
import './Specialties.scss';
import './SpecialtiesModal.scss';

export const SpecialtiesModal = ({ img, specialtie, color, colorname, about }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const colorMap = {
    purple: '#9025bb',
    lightblue: '#00bfff',
    red: '#e71b1b',
    blue: '#0e0d5d',
    green: '#1f6a2a',
    yellow: '#f0e000'
  };

  return (
    <>
      <Card className="specialty-card" isPressable onClick={onOpen}>
        <CardBody>
          <div className="specialty-image">
            <Image isBlurred src={img} alt={specialtie} />
          </div>
          <h4>{specialtie}</h4>
          <span className="specialty-color" style={{ background: colorMap[color] }}></span>
        </CardBody>
      </Card>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        classNames={{
          backdrop: 'bg-black/80 backdrop-blur-sm'
        }}>
        <ModalContent className="specialty-modal">
          <ModalHeader className="specialty-modal-header">
            <div>
              <h3>{specialtie}</h3>
              <Chip
                style={{ background: colorMap[color] }}
                classNames={{ content: 'text-white font-medium' }}>
                Color: {colorname}
              </Chip>
            </div>
          </ModalHeader>
          <ModalBody className="specialty-modal-body">
            <div className="modal-image-container">
              <Image isBlurred src={img} alt={specialtie} />
            </div>
            <p>{about}</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
