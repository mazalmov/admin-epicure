// export interface Restaurant {
//   _id: string;
//   name: string;
//   chefId: { name: string };
//   dishIds: string[];
//   image: string;
//   rank: string;
// }

// export interface Dish {
//   _id: string;
//   name: string;
//   iconMeaning: string;
//   image: string;
//   price: number;
//   ingredients: string[];
//   chefId: string;
//   restaurantId: string;
// }

// export interface Chef {
//   _id: string;
//   name: string;
//   restaurantIds: string[];
//   image: string;
//   info: string;
// }
export interface Restaurant {
    name: string;
    chefId: object;
    dishIds: object[];
    image: string;
    rank: string;
  }
  
  export interface Dish {
    name: string;
    iconMeaning: string;
    image: string;
    price: number;
    ingredients: string[];
    chefId: object;
    restaurantId: object;
  }
  
  export interface Chef {
    name: string;
    restaurantIds: object[];
    image: string;
    info: string;
  }
  
  export  interface IDropdownData {
    _id: string;
    name: string;
  }
  
  export type FormData = Restaurant | Dish | Chef;

  export const getInitialFormData = (table: string): FormData => {
    switch (table) {
      case 'restaurants':
        return {
          name: '',
          chefId: {},
          dishIds: [],
          image: '',
          rank: '',
        };
      case 'dishes':
        return {
          name: '',
          iconMeaning: '',
          image: '',
          price: 0,
          ingredients: [],
          chefId: {},
          restaurantId: {},
        };
      case 'chefs':
        return {
          name: '',
          restaurantIds: [],
          image: '',
          info: '',
        };
      default:
        return {
          name: '',
          chefId: {},
          dishIds: [],
          image: '',
          rank: '',
        };
    }
  };
  
  export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    action: string;
    selectedRow: Record<string, any> | null;
    onSubmit: () => void; 
    newData: Record<string, any>;
    setNewData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    chefs: IDropdownData[];
    restaurants: IDropdownData[];
    dishes: IDropdownData[];
  }