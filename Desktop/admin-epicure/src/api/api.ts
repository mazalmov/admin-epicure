// import axios from 'axios';

// export const handleDelete = async (id: string) => {
//     try {
//       await axios.delete(`http://localhost:3000/${selectedTable}/${id}`);
//       fetchData();
//       closeModal();
//     } catch (error) {
//       console.error('Error deleting data', error);
//     }
//   };
//   export const handleAdd = async () => {

//     const errors = validateInput(selectedTable, newData);
//     console.log("newData", newData);


//     if (errors.length > 0) {
//       alert(`Cannot update record:\n${errors.join('\n')}`);
//       return;
//     }
//     else { setIsFormValid(true); }
//     console.log('isFormValid',isFormValid);
    

//     try {
//       if (isFormValid) {
//         await axios.post(`http://localhost:3000/${selectedTable}`, newData);
//         fetchData();
//         closeModal();

//       } 
//       else {
//         alert('Please fill in all fields.');
//       }
//     } catch (error) {
//       console.error('Error adding data', error);
//     }
//   };
//   export const handleEdit = async () => {
//     if (selectedRow && selectedRow._id) {
//       const errors = validateInput(selectedTable, newData);

//       if (errors.length > 0) {
//         console.error('Validation errors:', errors);
//         alert(`Cannot update record:\n${errors.join('\n')}`);
//         return;
//       }
//       else { setIsFormValid(true);
//         if (selectedRow) {
//           setNewData((prevData) => ({
//             ...prevData,
//             ...Object.keys(selectedRow).reduce((acc, key) => {
//               if (selectedRow[key] !== undefined && (newData[key]===undefined || '')) {
//                 acc[key] = selectedRow[key];
//               }
//               return acc;
//             }, {} as Record<string, any>),
//           }));
//         }

//        }

//       try {
//         if (isFormValid) {
          
//           await axios.put(`http://localhost:3000/${selectedTable}/${selectedRow._id}`, newData);
//           fetchData();
//           closeModal();
//         } else {
//           alert('Please fill in all fields.');
//         }
//       } catch (error) {
//         console.error('Error updating data', error);
//       }
//     }
//     else {
//       console.log('error handleEdit');
//     }
//   };
