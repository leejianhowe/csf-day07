export enum Priority {
  low = 0,
  med,
  high,
}

export interface Task {
  description: string;
  priority: Priority;
  due: string;
}

export interface FormModel {
  title: string;
  task: Task[];
  titleId?: string;
}

export interface Summary{
  titleId: string,
  title: string,
}