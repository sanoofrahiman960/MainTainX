import { ADD_LOCATION,DELETE_LOCATION,ADD_ASSETS,DELETE_ASSETS } from '../actions/locationAction';

const initialState = {
  locations: [],
  assets:[],
};

const locationReducer = (state = initialState, action:any) => {
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