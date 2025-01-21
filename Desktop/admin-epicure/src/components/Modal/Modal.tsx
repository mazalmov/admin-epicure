import React from 'react';
import {
    ModalOverlay,
    ModalContent,
    ModalHeader,
 } from "./styles"

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>{title}</ModalHeader>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
