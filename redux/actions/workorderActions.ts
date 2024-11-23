import {
  WorkOrder,
  ADD_WORKORDER,
  UPDATE_WORKORDER,
  DELETE_WORKORDER,
  SET_WORKORDER_LOADING,
  SET_WORKORDER_ERROR,
  WorkOrderActionTypes
} from '../types/workorder';

export const addWorkOrder = (workOrder: WorkOrder): WorkOrderActionTypes => ({
  type: ADD_WORKORDER,
  payload: workOrder
});

export const updateWorkOrder = (workOrder: WorkOrder): WorkOrderActionTypes => ({
  type: UPDATE_WORKORDER,
  payload: workOrder
});

export const deleteWorkOrder = (workOrderId: string): WorkOrderActionTypes => ({
  type: DELETE_WORKORDER,
  payload: workOrderId
});

export const setWorkOrderLoading = (loading: boolean): WorkOrderActionTypes => ({
  type: SET_WORKORDER_LOADING,
  payload: loading
});

export const setWorkOrderError = (error: string): WorkOrderActionTypes => ({
  type: SET_WORKORDER_ERROR,
  payload: error
});
