import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  onEdit: (updatedData: any) => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, data, onEdit }) => {
  const [name, setName] = useState<string>(data?.name || '');
  const [isNameChanged, setIsNameChanged] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (data) {
      setName(data.name);
      setIsNameChanged(false); 
    }
  }, [data]);

  const handleSave = () => {
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }
    if (name !== data.name) { 
      const updatedData = { ...data, name }; 
      onEdit(updatedData); 
      onClose(); 
    } else {
      setError('No changes were made to the name');
    }
  };

  return (
    <Modal title="Edit Record" isOpen={isOpen} onClose={onClose}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setIsNameChanged(e.target.value !== data.name); 
          }} 
        />
        {error && <p style={{ color: 'red' }}>{error}</p>} 
      </div>
      <div>
        <button onClick={handleSave} disabled={!isNameChanged || !name.trim()}>Save Changes</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default EditModal;
