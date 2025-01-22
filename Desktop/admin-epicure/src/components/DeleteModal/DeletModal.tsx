import React from 'react';
import Modal from '../Modal/Modal';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  name: string; 
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onDelete, name }) => {
  return (
    <Modal title="Delete Record" isOpen={isOpen} onClose={onClose}>
      <p>Are you sure you want to delete the record "{name}"?</p>
      <button onClick={onDelete}>Confirm Deletion</button>
      <button onClick={onClose}>Cancel</button>
    </Modal>
  );
};

export default DeleteModal;
