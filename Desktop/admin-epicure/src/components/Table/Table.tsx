import React from 'react';
import {
    TableContainer,
    TableStyled,
} from "./styles"

interface TableProps {
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ children }) => {
  return (
    <TableContainer>
      <TableStyled>
      {children}
      </TableStyled>
    </TableContainer>
  );
};

export default Table;
