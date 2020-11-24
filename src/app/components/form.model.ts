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
  titleId: string;
  title: string;
  task: Task[];
}

export interface Summary{
  titleId: string,
  title: string,
}