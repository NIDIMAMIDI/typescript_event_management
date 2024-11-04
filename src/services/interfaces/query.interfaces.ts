// Define interface for request query of fetch Events with regex support
export interface eventQueryString {
  page?: string;
  limit?: string;
  title?: string;
  date?: string;
  location?: string;
  capacity?: number;
}
