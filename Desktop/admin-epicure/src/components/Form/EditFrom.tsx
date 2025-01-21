// import React, { useState, useEffect } from 'react';
// import { Box, Button, Select, MenuItem, TextField, FormControl, InputLabel, FormHelperText } from '@mui/material';

// interface EditFormProps {
//   selectedRow: Record<string, any>;
//   selectedTable: string;
//   dataTable: Record<string, any>;
//   handleClose: () => void;
//   onSave: (updatedRow: Record<string, any>) => void;
//   drilldownData: {
//     restaurantIds?: Array<{ id: string; name: string }>;
//     chefIds?: Array<{ id: string; name: string }>;
//     dishIds?: Array<{ id: string; name: string }>;
//   };
// }

// const validationSchemas: Record<
//   string,
//   Record<string, (value: any) => string | null>
// > = {
//   restaurants: {
//     name: (value: string) => (!value ? 'Name is required.' : null),
//     address: (value: string) => (!value ? 'Address is required.' : null),
//     rank: (value: number) =>
//       value < 0 || value > 5 ? 'Rank must be between 0 and 5.' : null,
//     chefId: (value: string) => (!value ? 'Chef is required.' : null),
//   },
//   chefs: {
//     name: (value: string) => (!value ? 'Name is required.' : null),
//     info: (value: string) => (!value ? 'Info is required.' : null),
//   },
//   dishes: {
//     name: (value: string) => (!value ? 'Name is required.' : null),
//     price: (value: number) => (value <= 0 ? 'Price must be positive.' : null),
//     restaurantId: (value: string) =>
//       !value ? 'Restaurant is required.' : null,
//     chefId: (value: string) => (!value ? 'Chef is required.' : null),
//   },
// };

// const EditForm: React.FC<EditFormProps> = ({
//   selectedRow,
//   selectedTable,
//   handleClose,
//   onSave,
//   drilldownData,
// }) => {
//   const [formData, setFormData] = useState<Record<string, any>>(selectedRow);
//   const [errors, setErrors] = useState<Record<string, string | null>>({});

//   useEffect(() => {
//     validateForm();
//   }, [formData]);

//   const validateForm = () => {
//     const schema = validationSchemas[selectedTable] || {};
//     const newErrors: Record<string, string | null> = {};

//     Object.entries(formData).forEach(([key, value]) => {
//       if (schema[key]) {
//         newErrors[key] = schema[key](value);
//       }
//     });

//     setErrors(newErrors);
//   };

//   const handleChange = (key: string, value: any) => {
//     setFormData((prev) => ({ ...prev, [key]: value }));
//   };

//   const isFormValid = Object.values(errors).every((error) => !error);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (isFormValid) {
//       onSave(formData);
//       handleClose();
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {Object.keys(formData).map((key) => {
//         if (key === '_id' || key === '__v') return null;

//         const isDrilldown = ['restaurantId', 'chefId', 'dishIds'].includes(key);
//         const error = errors[key];

//         return (
//           <Box key={key} mb={2}>
//             <FormControl fullWidth error={!!error}>
//               <InputLabel>{key}</InputLabel>
//               {isDrilldown ? (
//                 <Select
//                   value={formData[key] || ''}
//                   onChange={(e) => handleChange(key, e.target.value)}
//                 >
//                   {drilldownData[key]?.map((option) => (
//                     <MenuItem key={option.id} value={option.id}>
//                       {option.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               ) : (
//                 <TextField
//                   value={formData[key] || ''}
//                   onChange={(e) => handleChange(key, e.target.value)}
//                   label={key}
//                   fullWidth
//                 />
//               )}
//               {error && <FormHelperText>{error}</FormHelperText>}
//             </FormControl>
//           </Box>
//         );
//       })}

//       <Box display="flex" justifyContent="space-between">
//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           disabled={!isFormValid}
//         >
//           Save Changes
//         </Button>
//         <Button variant="outlined" color="secondary" onClick={handleClose}>
//           Cancel
//         </Button>
//       </Box>
//     </form>
//   );
// };

// export default EditForm;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  FormHelperText,
} from '@mui/material';

interface EditFormProps {
  selectedRow: Record<string, any>;
  selectedTable: string;
  handleClose: () => void;
  onSave: (data: Record<string, any>) => void;
  tableData: Record<string, any[]>; // כל הנתונים מכל הטבלאות
  validationSchemas: Record<string, Record<string, (value: any) => string | null>>;
}

const EditForm: React.FC<EditFormProps> = ({
  selectedRow,
  selectedTable,
  handleClose,
  onSave,
  tableData,
  validationSchemas,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(selectedRow);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  // פונקציה שמחזירה את ה-drilldownData
  const getDrilldownData = () => {
    const mappings: Record<string, string[]> = {
      restaurants: ['chefId', 'dishIds'],
      chefs: ['restaurantIds'],
      dishes: ['restaurantId', 'chefId'],
    };

    const fields = mappings[selectedTable] || [];
    const drilldown: Record<string, { id: string; name: string }[]> = {};

    fields.forEach((field) => {
      const relatedTable = field.replace(/Id|Ids/, '') + 's'; // לדוגמה: chefId -> chefs
      if (tableData[relatedTable]) {
        drilldown[field] = tableData[relatedTable].map((item: any) => ({
          id: item._id,
          name: item.name,
        }));
      }
    });

    return drilldown;
  };

  const drilldownData = getDrilldownData();

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const schema = validationSchemas[selectedTable] || {};
    const newErrors: Record<string, string | null> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (schema[key]) {
        newErrors[key] = schema[key](value);
      }
    });

    setErrors(newErrors);
  };

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const isFormValid = Object.values(errors).every((error) => !error);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSave(formData);
      handleClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(formData).map((key) => {
        if (key === '_id' || key === '__v') return null;

        const isDrilldown = Object.keys(drilldownData).includes(key);
        const error = errors[key];

        return (
          <Box key={key} mb={2}>
            <FormControl fullWidth error={!!error}>
              <InputLabel>{key}</InputLabel>
              {isDrilldown ? (
                <Select
                  value={formData[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                >
                  {drilldownData[key]?.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <TextField
                  value={formData[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  label={key}
                  fullWidth
                />
              )}
              {error && <FormHelperText>{error}</FormHelperText>}
            </FormControl>
          </Box>
        );
      })}

      <Box display="flex" justifyContent="space-between">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!isFormValid}
        >
          Save Changes
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Box>
    </form>
  );
};

export default EditForm;
