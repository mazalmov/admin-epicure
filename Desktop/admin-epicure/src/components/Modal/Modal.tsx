import React from 'react';
import {
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalButtons,
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
        <ModalButtons>
          <button onClick={onClose}>סגור</button>
        </ModalButtons>
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
