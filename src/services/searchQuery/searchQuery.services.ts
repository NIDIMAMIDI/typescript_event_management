import { eventQuery } from '../interfaces/fetchEvents.interfaces';

export const query = async (
  title?: string,
  date?: string,
  location?: string,
  capacity?: number
): Promise<eventQuery> => {
  const searchQuery: eventQuery = {};

  if (title) {
    searchQuery.title = { $regex: title, $options: 'i' }; // Case-insensitive search
  }
  if (date) {
    searchQuery.date = new Date(date);
  }
  if (location) {
    searchQuery.location = { $regex: location, $options: 'i' }; // Case-insensitive search
  }
  if (capacity) {
    searchQuery.capacity = capacity;
  }

  return searchQuery;
};
