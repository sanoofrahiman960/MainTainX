export interface WorkOrder {
    id: string;
    task: string;
    description: string;
    workType: string;
    assignedTo: string;
    location: string;
    asset: string;
    categories: string[];
    vendors: string[];
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    estimatedTime: Date;
    attachments: Attachment[];
    recurrence?: {
      type: 'daily' | 'weekly' | 'monthly' | 'yearly';
      interval: number;
      selectedDays?: string[];
      monthDay?: number;
      endDate: Date;
    };
    startDate: Date;
    dueDate: Date;
    status: 'Open' | 'In Progress' | 'Closed';
    imageUri?: string;
  }
  
  export interface Attachment {
    uri: string;
    type: 'photo' | 'file';
    name?: string;
    size?: number;
  }
  
  