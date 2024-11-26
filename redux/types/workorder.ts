export interface Worker {
  id: string;
  name: string;
  role: string;
}

export interface WorkOrder {
  id: string;
  task: string;
  description?: string;
  priorityIndex: number;
  estimatedTime: string;
  attachments?: string[];
  workType?: string;
  assignedTo?: string;
  location?: string;
  asset?: string;
  categories?: string[];
  vendors?: string[];
  startDate: string;
  dueDate: string;
  status: string;
  recurrence?: {
    type: string;
    interval: number;
    selectedDays?: string[];
    monthDay?: number;
    endDate: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderState {
  workOrders: WorkOrder[];
  loading: boolean;
  error: string | null;
}

// Action Types
export const ADD_WORKORDER = 'ADD_WORKORDER';
export const UPDATE_WORKORDER = 'UPDATE_WORKORDER';
export const DELETE_WORKORDER = 'DELETE_WORKORDER';
export const SET_WORKORDER_LOADING = 'SET_WORKORDER_LOADING';
export const SET_WORKORDER_ERROR = 'SET_WORKORDER_ERROR';

// Action Interfaces
export interface AddWorkOrderAction {
  type: typeof ADD_WORKORDER;
  payload: WorkOrder;
}

export interface UpdateWorkOrderAction {
  type: typeof UPDATE_WORKORDER;
  payload: WorkOrder;
}

export interface DeleteWorkOrderAction {
  type: typeof DELETE_WORKORDER;
  payload: string; // workorder id
}

export interface SetWorkOrderLoadingAction {
  type: typeof SET_WORKORDER_LOADING;
  payload: boolean;
}

export interface SetWorkOrderErrorAction {
  type: typeof SET_WORKORDER_ERROR;
  payload: string;
}

export type WorkOrderActionTypes =
  | AddWorkOrderAction
  | UpdateWorkOrderAction
  | DeleteWorkOrderAction
  | SetWorkOrderLoadingAction
  | SetWorkOrderErrorAction;
