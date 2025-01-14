import React from 'react';
import EditModal from '../EditModal/EditModal';
import DeleteModal from '../DeleteModal/DeletModal';
import AddModal from '../AddModal/AddModel';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: string;
  data: any;
  onAction: (action: string, data?: any) => void;
}

const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, action, data, onAction }) => {
  switch (action) {
    case 'edit':
      return <EditModal isOpen={isOpen} onClose={onClose} data={data} onEdit={() => onAction('edit', data)} />;
    case 'delete':
      return <DeleteModal isOpen={isOpen} onClose={onClose} name={data.name} onDelete={() => onAction('delete', data)} />;
    case 'add':
      return <AddModal isOpen={isOpen} onClose={onClose} onAdd={(newData) => onAction('add', newData)} />;
    default:
      return null;
  }
};

export default ActionModal;
