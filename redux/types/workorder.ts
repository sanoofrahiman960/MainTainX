export interface WorkOrder {
  id: number;
  name: string;
  priority: string;
  stage_id: [number, string];
  due_date: string | false;
  employee_ids: number[];
  contact_location_id: [number, string] | false;
  partner_id: [number, string] | false;
  laborTime?: {
    hours: number;
    minutes: number;
  };
  materialCost?: number;
  lastUpdated?: string;
}

export interface WorkOrderState {
  workOrders: WorkOrder[];
  workOrderViews: WorkOrder[];
  loading: boolean;
  error: string | null;
  currentView?: WorkOrder | null;
}

// Action Types
export const ADD_WORKORDER = 'ADD_WORKORDER';
export const WORKORDER = 'WORKORDER';
export const UPDATE_WORKORDER = 'UPDATE_WORKORDER';
export const DELETE_WORKORDER = 'DELETE_WORKORDER';
export const SET_WORKORDER_LOADING = 'SET_WORKORDER_LOADING';
export const SET_WORKORDER_ERROR = 'SET_WORKORDER_ERROR';
export const ADD_WORKORDER_VIEW = 'ADD_WORKORDER_VIEW';

// Action Interfaces
export interface AddWorkOrderAction {
  type: typeof ADD_WORKORDER;
  payload: WorkOrder;
}

export interface WorkOrderAction {
  type: typeof WORKORDER;
  payload: WorkOrder;
}

export interface UpdateWorkOrderAction {
  type: typeof UPDATE_WORKORDER;
  payload: WorkOrder;
}

export interface DeleteWorkOrderAction {
  type: typeof DELETE_WORKORDER;
  payload: number;
}

export interface SetWorkOrderLoadingAction {
  type: typeof SET_WORKORDER_LOADING;
  payload: boolean;
}

export interface SetWorkOrderErrorAction {
  type: typeof SET_WORKORDER_ERROR;
  payload: string;
}

export interface AddWorkOrderViewAction {
  type: typeof ADD_WORKORDER_VIEW;
  payload: WorkOrder;
}

export type WorkOrderActionTypes = 
  | AddWorkOrderAction
  | WorkOrderAction
  | UpdateWorkOrderAction
  | DeleteWorkOrderAction
  | SetWorkOrderLoadingAction
  | SetWorkOrderErrorAction
  | AddWorkOrderViewAction;