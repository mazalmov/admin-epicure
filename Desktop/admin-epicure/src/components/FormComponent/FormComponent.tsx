// import React, { useState, useEffect } from 'react';
// import { Box, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
// import axios from 'axios';

// const FormComponent = ({ selectedRow, selectedTable, drillDownData, handleClose }: any) => {
//   const [formData, setFormData] = useState(selectedRow || {});
//   const [errors, setErrors] = useState<Record<string, string | null>>({});

//   useEffect(() => {
//     setFormData(selectedRow || {});
//   }, [selectedRow]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData: any) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSelectChange = (name: string, value: any) => {
//     setFormData((prevData: any) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();



//     // _________________________


//     interface ValidationSchema {
//         name: (value: string) => string | null;
//         rank?: (value: number ) => number | null;
//         chefId?: (value: string) => string | null;
//         dishIds?: (value: any) => string | null;
//         restaurantIds?: (value: any) => string | null;
//         iconMeaning?: (value: string) => string | null;
//         price?: (value: number) => number | null;
//         ingredients?: (value: any) => string | null;
//         image?: (value: string) => string | null;
//         info?: (value: string) => string | null;
//       }
      
//       // אינטרפייס עבור האובייקט validationSchemas
//       interface ValidationSchemas {
//         restaurants: ValidationSchema;
//         chefs: ValidationSchema;
//         dishes: ValidationSchema;
//       }
// // אובייקט של בדיקות (validation schemas)
// const validationSchemas = {
//     restaurants: {
//       name: (value: string) => (!value.trim() ? 'Name is required.' : null),
//       address: (value: string) => (!value.trim() ? 'Address is required.' : null),
//       rank: (value: string | number) =>
//         typeof value !== 'number' || value < 0 || value > 5
//           ? 'Rank must be a number between 0 and 5.'
//           : null,
//       chefId: (value: string) => (!value.trim() ? 'Chef ID is required.' : null),
//       dishIds: (value: any) =>
//         !Array.isArray(value) || value.some((id) => typeof id !== 'string')
//           ? 'Dish IDs must be an array of strings.'
//           : null,
//     },
//     chefs: {
//       name: (value: string) => (!value.trim() ? 'Name is required.' : null),
//       restaurantIds: (value: any) =>
//         !Array.isArray(value) || value.some((id) => typeof id !== 'string')
//           ? 'Restaurant IDs must be an array of strings.'
//           : null,
//       image: (value: string) => (!value.trim() ? 'Image is required.' : null),
//       info: (value: string) => (!value.trim() ? 'Info is required.' : null),
//     },
//     dishes: {
//       name: (value: string) => (!value.trim() ? 'Name is required.' : null),
//       iconMeaning: (value: string) => (!value.trim() ? 'Icon meaning is required.' : null),
//       price: (value: any) =>
//         typeof value !== 'number' || value < 0
//           ? 'Price must be a positive number.'
//           : null,
//       ingredients: (value: any) =>
//         !Array.isArray(value) || value.some((ingredient) => typeof ingredient !== 'string')
//           ? 'Ingredients must be an array of strings.'
//           : null,
//       chefId: (value: string) => (!value.trim() ? 'Chef ID is required.' : null),
//       restaurantId: (value: string) => (!value.trim() ? 'Restaurant ID is required.' : null),
//     },
//   };
  
//   // פונקציה לבדיקת תקינות כל השדות
//   const validateFields = (table: string, data: Record<string, any>) => {
//     const errors: Record<string, string | null> = {};
  
//     const schema = validationSchemas[table as keyof validationSchemas]; // כאן השתמשנו ב-type assertion
  
//     for (const [key, value] of Object.entries(data)) {
//       if (schema[key as keyof ValidationSchema]) { // סוג הנתונים של key
//         const error = schema[key as keyof ValidationSchema](value);
//         if (error) {
//           errors[key] = error;
//         }
//       }
//     }
  
//     return errors;
//   };

  
// // __________________________


//     const validationErrors = validateFields(selectedTable, formData);
//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length === 0) {
//       try {
//         await axios.put(`http://localhost:3000/${selectedTable}/${formData._id}`, formData);
//         handleClose();  // סוגר את המודל לאחר שליחה מוצלחת
//       } catch (error) {
//         console.error('Error updating data', error);
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {Object.keys(formData).map((key) => {
//         if (key === '_id' || key === '__v') return null;

//         // בדיקה אם השדה הוא chefId, dishIds או restaurantIds
//         if (key === 'chefId' || key === 'dishIds' || key === 'restaurantIds') {
//           return (
//             <Box key={key} style={{ marginBottom: '10px' }}>
//               <FormControl fullWidth>
//                 <InputLabel>{key}</InputLabel>
//                 <Select
//                   multiple={key === 'dishIds'}  // מאפשר בחירה מרובה עבור dishIds
//                   name={key}
//                   value={formData[key] || (key === 'dishIds' ? [] : '')}
//                   onChange={(e) => handleSelectChange(key, e.target.value)}
//                 >
//                   {drillDownData[key]?.map((item: any) => (
//                     <MenuItem key={item._id} value={item._id}>
//                       {item.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               {errors[key] && <div style={{ color: 'red', fontSize: '12px' }}>{errors[key]}</div>}
//             </Box>
//           );
//         }

//         return (
//           <Box key={key} style={{ marginBottom: '10px' }}>
//             <label style={{ display: 'block', fontWeight: 'bold' }}>{key}:</label>
//             <input
//               type="text"
//               name={key}
//               value={formData[key] || ''}
//               onChange={handleChange}
//               style={{ width: '100%', padding: '5px', boxSizing: 'border-box' }}
//             />
//             {errors[key] && <div style={{ color: 'red', fontSize: '12px' }}>{errors[key]}</div>}
//           </Box>
//         );
//       })}
//       <Button
//         type="submit"
//         variant="contained"
//         color="primary"
//         disabled={Object.keys(errors).length > 0}
//       >
//         Save
//       </Button>
//     </form>
//   );
// };

// export default FormComponent;
