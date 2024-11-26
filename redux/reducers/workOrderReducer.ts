import { WorkOrder } from '../types/workOrderTypes';
import { ADD_WORK_ORDER, SET_WORK_ORDERS } from '../actions/workOrderAction';

interface WorkOrderState {
  workOrders: WorkOrder[];
}

const initialState: WorkOrderState = {
  workOrders: [],
};

const workOrderReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_WORK_ORDER:
        // return alert(state,action.payload)
      return {
        ...state,
        workOrders: [...state.workOrders, action.payload],
      };
    case SET_WORK_ORDERS:
      return {
        ...state,
        workOrders: action.payload,
      };
    default:
      return state;
  }
};

export default workOrderReducer;

