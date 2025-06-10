export interface TaskDto {
  id: number;
  title: string;
  description: string;
  status: number;
  priority: number;
  dueDate: number; // Unix timestamp
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
}