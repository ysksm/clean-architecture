export interface CreateTaskDto {
  title: string;
  description: string;
  priority: number;
  dueDate: number; // Unix timestamp
}