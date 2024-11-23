export interface Worker {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  department?: string;
  skills?: string[];
  avatar?: string;
}

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Completed' | 'On Hold';
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  assignedWorkers: Worker[];
  location?: string;
  asset?: string;
  estimatedHours?: number;
  actualHours?: number;
  materials?: Array<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
    cost?: number;
  }>;
  attachments?: Array<{
    name: string;
    uri: string;
    type: string;
    size: number;
  }>;
  comments?: Array<{
    id: string;
    text: string;
    worker: Worker;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  completedBy?: Worker;
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
