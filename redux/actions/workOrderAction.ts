import { WorkOrder } from '../types/workOrderTypes';

export const ADD_WORK_ORDER = 'ADD_WORK_ORDER';
export const SET_WORK_ORDERS = 'SET_WORK_ORDERS';

export const addWorkOrder = (workOrder: WorkOrder) => ({
  type: ADD_WORK_ORDER as typeof ADD_WORK_ORDER,
  payload: workOrder,
});

export const setWorkOrders = (workOrders: WorkOrder[]) => ({
  type: SET_WORK_ORDERS as typeof SET_WORK_ORDERS,
  payload: workOrders,
});

