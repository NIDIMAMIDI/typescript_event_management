// Define interface for request query of fetch Events

export interface eventQuery {
  page?: number;
  limit?: number;
  title?: { $regex: string; $options: string };
  date?: Date;
  location?: { $regex: string; $options: string };
  capacity?: number;
}
