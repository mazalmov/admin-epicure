import React, { useState } from 'react';
import Modal from '../Modal/Modal';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

const AddModal: React.FC<AddModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');

  const handleAdd = () => {
    onAdd({ name });
    setName(''); 
  };

  return (
    <Modal title="Add Record" isOpen={isOpen} onClose={onClose}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
    </Modal>
  );
};

export default AddModal;
