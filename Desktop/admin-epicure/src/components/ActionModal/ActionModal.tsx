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
  children: React.ReactNode;
}

const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, action, data, onAction,children }) => {
  switch (action) {
    case 'edit':
      return 
      <>
      <EditModal isOpen={isOpen} onClose={onClose} data={data} onEdit={() => onAction('edit', data) } />;
        {children}
      </>
    case 'delete':
      return 
      <>
      <DeleteModal isOpen={isOpen} onClose={onClose} name={data.name} onDelete={() => onAction('delete', data)} />;
      {children}
    </>
    case 'add':
      return 
      <>
      <AddModal isOpen={isOpen} onClose={onClose} onAdd={(newData) => onAction('add', newData)} />;
      {children}
    </>
    default:
      return null;
  }
};

export default ActionModal;
