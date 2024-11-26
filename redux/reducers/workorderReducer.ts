import {
  WorkOrderState,
  WorkOrderActionTypes,
  ADD_WORKORDER,
  UPDATE_WORKORDER,
  DELETE_WORKORDER,
  SET_WORKORDER_LOADING,
  SET_WORKORDER_ERROR
} from '../types/workorder';

const initialState: WorkOrderState = {
  workOrders: [],
  loading: false,
  error: null
};

const workorderReducer = (
  state = initialState,
  action: WorkOrderActionTypes
): WorkOrderState => {
  switch (action.type) {
    case ADD_WORKORDER:
      console.log("action",action.payload);
      return {
        
        ...state,
        workOrders: [...state.workOrders, action.payload],
        error: null
      };

    case UPDATE_WORKORDER:
      return {
        ...state,
        workOrders: state.workOrders.map(workOrder =>
          workOrder.id === action.payload.id ? action.payload : workOrder
        ),
        error: null
      };

    case DELETE_WORKORDER:
      return {
        ...state,
        workOrders: state.workOrders.filter(
          workOrder => workOrder.id !== action.payload
        ),
        error: null
      };

    case SET_WORKORDER_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case SET_WORKORDER_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    default:
      return state;
  }
};

export default workorderReducer;
