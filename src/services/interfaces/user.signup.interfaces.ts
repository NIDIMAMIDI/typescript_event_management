import { UserWithoutPassword } from '../userCreate/userCreate.services';

export interface SuccessResponse {
  status: 'success';
  message: string;
  statusCode: number;
  userDetails: UserWithoutPassword; // or a specific shape of user details if necessary
}

export interface FailureResponse {
  statusCode: number;
  status: 'failure';
  message: string;
}

// Define a type for possible responses
export type UserSignUpResponse = SuccessResponse | FailureResponse;

// Define interface for request body of create Event
export interface CreateEventBody {
  title: string;
  description?: string | null;
  date: Date | string;
  location: string;
  capacity: number;
  attendees: string[];
}
