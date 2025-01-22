export const validationSchemas = {
    restaurants: {
      name: (value: string) => (!value.trim() ? 'Name is required.' : null),
      address: (value: string) => (!value.trim() ? 'Address is required.' : null),
      rank: (value: string | number) =>
        typeof value !== 'number' || value < 0 || value > 5
          ? 'Rank must be a number between 0 and 5.'
          : null,
      chefId: (value: string) => (!value.trim() ? 'Chef ID is required.' : null),
      dishIds: (value: any) =>
        !Array.isArray(value) || value.some((id) => typeof id !== 'string')
          ? 'Dish IDs must be an array of strings.'
          : null,
    },
    chefs: {
      name: (value: string) => (!value.trim() ? 'Name is required.' : null),
      restaurantIds: (value: any) =>
        !Array.isArray(value) || value.some((id) => typeof id !== 'string')
          ? 'Restaurant IDs must be an array of strings.'
          : null,
      image: (value: string) => (!value.trim() ? 'Image is required.' : null),
      info: (value: string) => (!value.trim() ? 'Info is required.' : null),
    },
    dishes: {
      name: (value: string) => (!value.trim() ? 'Name is required.' : null),
      iconMeaning: (value: string) => (!value.trim() ? 'Icon meaning is required.' : null),
      price: (value: any) =>
        typeof value !== 'number' || value < 0
          ? 'Price must be a positive number.'
          : null,
      ingredients: (value: any) =>
        !Array.isArray(value) || value.some((ingredient) => typeof ingredient !== 'string')
          ? 'Ingredients must be an array of strings.'
          : null,
      chefId: (value: string) => (!value.trim() ? 'Chef ID is required.' : null),
      restaurantId: (value: string) => (!value.trim() ? 'Restaurant ID is required.' : null),
    },
  };
  
//   // פונקציה לבדיקת תקינות כל השדות
//   const validateFields = (table: string, data: Record<string, any>) => {
//     const errors: Record<string, string | null> = {};
  
//     const schema = validationSchemas[table];
  
//     for (const [key, value] of Object.entries(data)) {
//       if (schema[key]) {
//         const error = schema[key](value);
//         if (error) {
//           errors[key] = error;
//         }
//       }
//     }
  
//     return errors;
//   };