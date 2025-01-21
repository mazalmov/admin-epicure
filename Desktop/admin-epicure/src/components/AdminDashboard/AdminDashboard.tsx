import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Box,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';
import Modal from '../Modal/Modal';
import { Restaurant, Dish, Chef,IDropdownData } from '../../types/models';
import { uploadFileToS3 } from '../../constance/aws';


const AdminDashboard = () => {
  const [tableData, setTableData] = useState<Restaurant[] | Chef[] | Dish[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('restaurants');
  const [selectedRow, setSelectedRow] = useState<Record<string, any> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [newData, setNewData] = useState<Record<string, any>>({});
  const [chefs, setChefs] = useState<IDropdownData[]>([]);
  const [restaurants, setRestaurants] = useState<IDropdownData[]>([]);
  const [dishes, setDishes] = useState<IDropdownData[]>([]);
  const IconMeaning = ['vegan', 'spicy', 'vegetarian']
  const rankValues = [1, 2, 3, 4, 5];
  // const { table = 'restaurants', id } = useParams();
  // const navigate = useNavigate();


  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/${selectedTable}`);
      console.log('Fetched data:', response.data.data);
      setTableData(response.data.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };


  useEffect(() => {
    fetchData();
  }, [selectedTable]);

const fetchDropdownData = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/dropdown-data`);
    setChefs(response.data.chefs);
    setRestaurants(response.data.restaurants);
    setDishes(response.data.dishes);
  } catch (error) {
    console.error('Error fetching dropdown data', error);
  }
};

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const handleTableChange = (table: string) => {
    setSelectedTable(table);
    setPage(0);
  };
  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const getTableHeaders = () => {
    switch (selectedTable) {
      case 'chefs':
        return ['name', 'Image', 'Restaurants', 'Info'];
      case 'dishes':
        return ['name', 'Image', 'Icon meaning', 'Price', 'Ingredients', 'Chef name', 'Restaurant name'];
      default:
        return ['name', 'Image', 'Chef name', 'Dish names', 'Rank'];
    }
  };

  useEffect(() => {
    const fields = getTableHeaders() || [];
    const initialData = fields.reduce((acc, field) => {
      acc[field] = '';
      return acc;
    }, {} as Record<string, any>);

    setNewData(initialData);
  }, [selectedTable]);

  const getTableRowData = (row: any) => {
    switch (selectedTable) {
      case 'dishes':
        return [
          row.name,
          <img src={row.image} alt={row.name} width="50" />,
          row.iconMeaning,
          row.price,
          Array.isArray(row.ingredients) ? row.ingredients.join(', ') : '',
          row.chefId?.name || 'Unknown',
          row.restaurantId?.name || 'Unknown',
        ];
      case 'chefs':
        return [
          row.name,
          <img src={row.image} alt={row.name} width="50" />,
          Array.isArray(row.restaurantIds) && row.restaurantIds
            ? row.restaurantIds.map((restaurant: any) => restaurant.name).join(', ') : '',
          row.info,
        ];
      default:
        return [
          row.name,
          <img src={row.image} alt={row.name} width="50" />,
          row.chefId?.name || 'Unknown',
          Array.isArray(row.dishIds) && row.dishIds
            ? row.dishIds.map((dish: any) => dish.name).join(', ')
            : 'Unknown',
          row.rank,
        ];
    }
  };

  const validationRules: Record<string, Record<string, (value: any) => boolean>> = {
    restaurants: {
      name: (value) => typeof value === 'string' && value.trim() !== '',
      rank: (value) => rankValues.includes(parseInt(value, 10)),
      image: (value) =>typeof value === 'string'&& value.trim() !== '',
      chefId: (value) => chefs.some((chef) => chef._id === value),
      dishIds: (value) => Array.isArray(value) && value.every((id) => dishes.some((dish) => dish._id === id)),

    },
    chefs: {
      name: (value) => typeof value === 'string' && value.trim() !== '',
      info: (value) => typeof value === 'string' && value.trim() !== '',
      image: (value) => typeof value === 'string' && value.trim() !== '',
      restaurantIds: (value) => Array.isArray(value) && value.every((id) => restaurants.some((restaurant) => restaurant._id === id)),
    },
    dishes: {
      name: (value) => typeof value === 'string' && value.trim() !== '',
      price: (value) => typeof value === 'number' && value > 0,
      iconMeaning: (value) => IconMeaning.some((icon) => icon === value),
      image: (value) => typeof value === 'string' && value.trim() !== '',
      ingredients: (value) => typeof value === 'string' && value.trim() !== '',
      chefId: (value) => chefs.some((chef) => chef._id === value),
      restaurantId: (value) => restaurants.some((restaurant) => restaurant._id === value),
    },
  };
  const validateInput = (table: string, data: Record<string, any>): string[] => {
    console.log('Validating data:', data);
    const rules = validationRules[table];
    if (!rules) {
      throw new Error(`Validation rules for table "${table}" not found.`);
    }

    const errors: string[] = [];

    for (const [field, validate] of Object.entries(rules)) {
      if (!validate(data[field])) {
        errors.push(`Invalid value for field "${field}".`);
      }
    }

    return errors;
  };
  
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/${selectedTable}/${id}`);
      fetchData();
      closeModal();
    } catch (error) {
      console.error('Error deleting data', error);
    }
  };

  const handleAdd = async () => {
    const errors = validateInput(selectedTable, newData);
    if (errors.length > 0) {
      alert(`Cannot update record:\n${errors.join('\n')}`);
      return;
    }
    const cleanedData = Object.fromEntries(
      Object.entries(newData).filter(([key, value]) => value !== undefined && value !== null && value !== '')
    );


  try {
    console.log('Sending data:', cleanedData);
    await axios.post(`http://localhost:3000/${selectedTable}`, cleanedData);
    fetchData();
    closeModal();
    } catch (error) {
      console.error('Error adding data', error);
    }
  };

  const handleEdit = async () => {
    if (selectedRow && selectedRow._id) {
      // navigate(`/admin/selection/${selectedTable}/update/${selectedRow._id}`);
      const errors = validateInput(selectedTable, newData);
      if (errors.length > 0) {
        console.error('Validation errors:', errors);
        alert(`Cannot update record:\n${errors.join('\n')}`);
        return;
      }
  
      const valid = validateInput(selectedTable, newData).length === 0;
      if (!valid) {
        alert('Please fill in all fields.');
        return;
      }
  
      try {
        await axios.put(`http://localhost:3000/${selectedTable}/${selectedRow._id}`, newData);
        fetchData(); 
        closeModal(); 
      } catch (error) {
        console.error('Error updating data', error);
      }
    } else {
      console.log('error handleEdit');
    }
  };
  

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await uploadFileToS3(file);
        setNewData((prevData: any) => ({
          ...prevData,
          image: imageUrl,
        }));
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };


  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];    
    if (file) {
      setNewData((prevData: any) => ({
        ...prevData,
        image: file,
      }));
    }
  };


  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h5" color="textSecondary" style={{ padding: '20px 10px' }}>
        {selectedTable.toUpperCase() + ':'}
      </Typography>
      <Box style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 10 }}>
        <Button variant="contained" style={{ width: "180px", marginLeft: 10 }} color="primary" size="small" onClick={() => openModal({}, 'add')} >
          Add New Record
        </Button>
      </Box>
      <Box style={{ display: 'flex', marginLeft: 10, justifyContent: 'space-between', backgroundColor: '#f5f5f5', borderRight: '2px solid #ccc' }}>
        <Box style={{ width: '20%' }}>
          <Box style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <Typography variant="h5" color="textSecondary">
              Selections:
            </Typography>
          </Box>
          <Button fullWidth onClick={() => handleTableChange('restaurants')}>
            Restaurants
          </Button>
          <Button fullWidth onClick={() => handleTableChange('chefs')}>
            Chefs
          </Button>
          <Button fullWidth onClick={() => handleTableChange('dishes')}>
            Dishes
          </Button>
        </Box>

        <Box style={{ flex: 1, marginTop: 20 }}>
          <Box style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 10 }} >
            <Typography variant="body2" color="textSecondary">
              {tableData.length} entries found
            </Typography>
          </Box>

            <TableContainer component={Paper}>
            <Table style={{ width: '700px', tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  {getTableHeaders().map((header, index) => (
                    <TableCell key={index} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {header}
                    </TableCell>
                  ))}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any) => (
                  <TableRow key={row._id}>
                    {getTableRowData(row).map((data, index) => (
                      <TableCell
                        key={index}
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          maxWidth: '100px',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {data}
                      </TableCell>
                    ))}
                    <TableCell>
                      <IconButton onClick={() => openModal(row, 'edit')} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => openModal(row, 'delete')} color="secondary">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={tableData.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
          />
        </Box>
      </Box>

      <Modal
        title={`${action === 'edit' ? 'Editing' : action === 'delete' ? 'Deleting' : 'Adding'} ${selectedTable}`}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
      {action === 'delete' && selectedRow && (
        <Box>
          <Typography variant="body1">
            Are you sure you want to delete this record?
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(selectedRow._id)}
            style={{ marginRight: '10px' }}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={closeModal}
          >
            Cancel
          </Button>
        </Box>
      )}

      {(action === 'add' || (action === 'edit' && selectedRow)) && (
      <form style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 200px)', 
          padding: '10px',
        }}
      >
      {Object.keys(newData).map((key) => (
        <Box key={key} style={{ marginBottom: '10px' }}>
          {key.toLowerCase() === 'chef name' && selectedTable !== 'chefs' ? (
            <>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Chef name:</label>
              <select
                name="chefId"
                value={newData.chefId || ''}
                onChange={(e) =>
                  setNewData((prevData) => ({
                    ...prevData,
                    chefId: e.target.value,
                  }))
                }
              >
                <option value="">Select a Chef</option>
                {chefs.map((chef) => (
                  <option key={chef._id} value={chef._id}>
                    {chef.name}
                  </option>
                ))}
              </select>
            </>
          ) : key.toLowerCase() === 'dish names' ? (
            <>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Dishes:</label>
              <select
                name="dishIds"
                multiple
                value={newData.dishIds || []}
                onChange={(e) =>
                  setNewData((prevData) => ({
                    ...prevData,
                    dishIds: Array.from(e.target.selectedOptions, (option) => option.value),
                  }))
                }
              >
                {dishes.map((dish) => (
                  <option key={dish._id} value={dish._id}>
                    {dish.name}
                  </option>
                ))}
              </select>
            </>
          ) : key.toLowerCase() === 'restaurants' ? (
            <>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Restaurants:</label>
              <select
                name="restaurantIds"
                multiple
                value={newData.restaurantIds || []}
                onChange={(e) =>
                  setNewData((prevData) => ({
                    ...prevData,
                    restaurantIds: Array.from(e.target.selectedOptions, (option) => option.value),
                  }))
                }
              >
                {restaurants.map((restaurant) => (
                  <option key={restaurant._id} value={restaurant._id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </>
          ) : key.toLowerCase() ==='restaurant name' ? (
            <>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Restaurant name:</label>
              <select
                name="restaurantId"
                value={newData.restaurantId || ''}
                onChange={(e) =>
                  setNewData((prevData) => ({
                    ...prevData,
                    restaurantId :e.target.value,
                  }))
                }
              >
                <option value="">Select a restaurant</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant._id} value={restaurant._id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </>
          ) 
          :key.toLowerCase() === 'rank' ? (
            <>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Rank:</label>
              <select
                name="rank"
                value={newData.rank || ''}
                onChange={(e) =>
                  setNewData((prevData) => ({
                    ...prevData,
                    rank: parseInt(e.target.value, 10),
                  }))
                }
              >
                <option value="">Select a rating</option>
                {rankValues.map((rank) => (
                  <option key={rank} value={rank}>
                    - {rank} -
                  </option>
                ))}
              </select>
            </>
          ) : key.toLowerCase() === 'price' ? (
            <>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Price:</label>
              <input
                type="number"
                min="0"
                value={newData.price || ''}
                onChange={(e) =>
                  setNewData((prevData) => ({
                    ...prevData,
                    price: Math.max(0, parseFloat(e.target.value) || 0),
                  }))
                }
              />
            </>
          ) : key.toLowerCase() === 'icon meaning' ? (
            <>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Icon meaning:</label>
              <select
                name="rank"
                value={newData.iconMeaning || ''}
                onChange={(e) =>
                  setNewData((prevData) => ({
                    ...prevData,
                    iconMeaning: e.target.value,
                  }))
                }
              >
                <option value="">Select an icon</option>
                {IconMeaning.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon} 
                  </option>
                ))}
              </select>
            </>
          )
          :key.toLowerCase() === 'image' ? (
            <>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Image:</label>
              <div
                style={{
                  border: '2px dashed #ccc',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('imageUpload')?.click()}
              >
                {newData.image ? (
                  <img
                    src={newData.image}
                    alt="preview"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                ) : (
                  <p>Drag and drop an image here or click to select</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="imageUpload"
                />
              </div>
            </>
          )           
          :getTableHeaders().includes(key) ? (
            <>
              <label style={{ display: 'block', fontWeight: 'bold' }}>{key}:</label>
              <input
                type="text"
                value={newData[key.toLowerCase()] || ''}
                onChange={(e) =>
                  setNewData((prevData: any) => ({
                    ...prevData,
                    [key.toLowerCase()]: e.target.value,
                  }))
                }
                style={{ width: '100%', padding: '5px', boxSizing: 'border-box' }}
              />
            </>
          ) : null
          
          }
        </Box>
      ))}
      
      <Box style={{ marginTop: '20px' }}>
        {action === 'add' ? (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAdd}
              style={{ marginRight: '10px' }}
            >
              Add Record
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={closeModal}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEdit}
              style={{ marginRight: '10px' }}
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={closeModal}
            >
              Cancel
            </Button>
          </>
        )}
      </Box>
      </div>
    </form>
  )}
</Modal>
</Box>
)};

export default AdminDashboard;

