import React, { useState, useEffect } from 'react';
import Table from '../Table/Table';
import axios from 'axios';
import Modal from '../Modal/Modal';

interface Restaurant {
  _id: string;
  name: string;
  chefId: { name: string };
  dishIds: string[];
  chefName: string;
  image: string;
  rank: string;
}

interface Dish {
  _id: string;
  name: string;
  iconMeaning: string;
  image: string;
  price: number;
  ingredients: string[];
  chefId: string;
  restaurantId: string;
}

interface Chef {
  _id: string;
  name: string;
  restaurantIds: string[];
  image: string;
  info: string;
}

const AdminDashboard = () => {
  const [tableData, setTableData] = useState<Restaurant[] | Chef[] | Dish[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('restaurants');
  const [selectedRow, setSelectedRow] = useState<Restaurant | Chef | Dish | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState<string>('');

  const fetchData = async () => {
    try {
      const storedData = localStorage.getItem(selectedTable); 
      if (storedData) {
        setTableData(JSON.parse(storedData));
      } else {

        const response = await axios.get(`http://localhost:3000/${selectedTable}`);
        if (Array.isArray(response.data.data)) {
          setTableData(response.data.data);
          localStorage.setItem(selectedTable, JSON.stringify(response.data.data));
        } else {
          console.error('Expected an array, but received:', response.data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [selectedTable]);
  
  const handleTableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTable(event.target.value);
  };

  const openModal = (row: any, action: string) => {
    setSelectedRow(row);
    setAction(action);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
    setAction('');
  };

  const handleEdit = (updatedData: any) => {
    axios.put(`http://localhost:3000/${selectedTable}/${selectedRow?._id}`, updatedData)
      .then(() => {
        fetchData();
        closeModal();
      });
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:3000/${selectedTable}/${selectedRow?._id}`)
      .then(() => {
        fetchData();
        closeModal();
      });
  };

  const handleAdd = (newData: any) => {
    axios.post(`http://localhost:3000/${selectedTable}`, newData)
      .then(() => {
        fetchData();
        closeModal();
      });
  };

  const getTableHeaders = () => {
    switch (selectedTable) {
      case 'restaurants':
        return ['Restaurant name', 'Image', 'Chef name', 'Dish names', 'Rank'];
      case 'chefs':
        return ['Chef name', 'Image', 'Info'];
      case 'dishes':
        return ['Dish name', 'Image', 'Icon meaning', 'Price', 'Ingredients', 'Chef name', 'Restaurant name'];
      default:
        return [];
    }
  };

  const getTableRowData = (row: any) => {
    switch (selectedTable) {
      case 'dishes':
        return [
          row.name,
          <img src={row.image} alt={row.name} />,
          row.iconMeaning,
          row.price,
          Array.isArray(row.ingredients) ? row.ingredients.join(', ') : '', 
 
          row.chefId.name || 'Unknown',
          row.restaurantId?.name || 'Unknown'
        ];
      case 'chefs':
        return [
          row.name,
          <img src={row.image} alt={row.name} />,
          row.info,
        ];

      default:
        return [
          row.name,
          <img src={row.image} alt={row.name} />,
          row.chefName,
          Array.isArray(row.dishIds) && row.dishIds
            ? row.dishIds.map((dish: any) => dish.name).join(', ') 
            : '',
          row.rank,
        ];
    }
  };

  return (
    <div>
      <select onChange={handleTableChange} value={selectedTable}>
        <option value="restaurants">Restaurants</option>
        <option value="chefs">Chefs</option>
        <option value="dishes">Dishes</option>
      </select>

      <Table>
        <thead>
          <tr>
            {getTableHeaders().map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.isArray(tableData) && tableData.map((row: any) => (
            <tr key={row._id}>
              {getTableRowData(row).map((data, index) => (
                <td key={index}>{data}</td>
              ))}
              <td>
                <button onClick={() => openModal(row, 'edit')}>Edit</button>
                <button onClick={() => openModal(row, 'delete')}>Delete</button>
                {/* <button onClick={() => openModal(row, 'add')}>Add</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        title={`${action === 'edit' ? 'Editing' : action === 'delete' ? 'Deleting' : 'Adding'} ${selectedTable}`}
        isOpen={isModalOpen}
        onClose={closeModal}
      >

        {action === 'edit' && selectedRow && (
          <div>
            <input
              type="text"
              defaultValue={selectedRow.name}
            />
            <button onClick={() => handleEdit({ name: selectedRow.name })}>Save Changes</button>
          </div>
        )}
        {action === 'delete' && selectedRow && (
          <div>
            <p>Are you sure you want to delete this record?</p>
            <button onClick={handleDelete}>Confirm Deletion</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        )}
        {action === 'add' && (
          <div>
            <input type="text" placeholder="Name" />
            <button onClick={() => handleAdd({ name: 'New Name' })}>Add</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
