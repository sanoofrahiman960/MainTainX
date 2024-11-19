import { Location,Assets } from '../types/location';

// Action Types
export const ADD_LOCATION = 'ADD_LOCATION';
export const DELETE_LOCATION = 'DELETE_LOCATION';
export const UPDATE_LOCATION = 'UPDATE_LOCATION';
export const SET_LOCATIONS = 'SET_LOCATIONS';
export const ADD_ASSETS = 'ADD_ASSETS'
export const DELETE_ASSETS = 'DELETE_ASSETS'


// Action Creators
export const addLocation = (location: Location) => ({
  type: ADD_LOCATION as typeof ADD_LOCATION,
  payload: location,
});

export const deleteLocation = (locationId: string) => ({
  type: DELETE_LOCATION as typeof DELETE_LOCATION,
  payload: locationId,
});

export const updateLocation = (location: Location) => ({
  type: UPDATE_LOCATION as typeof UPDATE_LOCATION,
  payload: location,
});

export const setLocations = (locations: Location[]) => ({
  type: SET_LOCATIONS as typeof SET_LOCATIONS,
  payload: locations,
});
export const addAssets = (assets: Assets[]) => ({
    type: ADD_ASSETS as typeof ADD_ASSETS,
    payload: assets,
  });
  export const deleteAssets = (assetsId: Assets[]) => ({
    type: DELETE_ASSETS as typeof DELETE_ASSETS,
    payload: assetsId,
  });
// Async Action Creators (if using Redux Thunk)
export const fetchLocations = () => {
  return async (dispatch: any) => {
    try {
      // Simulating API call
      const response = await fetch('https://api.example.com/locations');
      const locations = await response.json();
      dispatch(setLocations(locations));
    } catch (error) {
      console.error('Error fetching locations:', error);
      // You might want to dispatch an error action here
    }
  };
};

// Action Types for TypeScript
export type LocationActionTypes =
  | ReturnType<typeof addLocation>
  | ReturnType<typeof deleteLocation>
  | ReturnType<typeof updateLocation>
  | ReturnType<typeof setLocations>
  | ReturnType<typeof addAssets>;
