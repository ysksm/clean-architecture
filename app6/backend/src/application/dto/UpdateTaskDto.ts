export interface UpdateTaskDto {
  id: number;
  title: string;
  description: string;
  status: number;
  priority: number;
  dueDate: number; // Unix timestamp
}