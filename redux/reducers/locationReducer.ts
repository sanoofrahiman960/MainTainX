import { ADD_LOCATION,DELETE_LOCATION,ADD_ASSETS,DELETE_ASSETS } from '../actions/locationAction';

const initialState = {
  locations: [ { id: '1', name: 'Main Building', type: 'Building' },
  { id: '2', name: 'Production Floor', type: 'Area' },
  { id: '3', name: 'Warehouse A', type: 'Storage' },
  { id: '4', name: 'Maintenance Shop', type: 'Workshop' },
  { id: '5', name: 'Assembly Line 1', type: 'Production' },
],
  // assets:[],
};

const locationReducer = (state = initialState, action: { type: any; payload: any; }) => {
  switch (action.type) {
    case ADD_LOCATION:
      return {
        ...state,
        locations: [...state.locations, action.payload],
      };
      case ADD_ASSETS:
      return {
        ...state,
        assets: [...state.assets, action.payload],
      };
      case DELETE_LOCATION:
      return {
        ...state,
        locations: state.locations.filter(location => location.id !== action.payload),
      };
      case DELETE_ASSETS:
        return {
          ...state,
          assets: state.assets.filter(assets => assets.id !== action.payload),
        };
    default:
      return state;
  }
};

export default locationReducer;