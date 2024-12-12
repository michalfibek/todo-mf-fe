export type TTaskId = string;
export type TTaskText = string;

export type TTask = {
  id: TTaskId;
  text: TTaskText;
  completed: boolean;
  createdDate: number;
  completedDate: number;
};
