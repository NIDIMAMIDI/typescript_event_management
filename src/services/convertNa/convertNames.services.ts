export const convertNames = async (name: string): Promise<string> => {
  const loweredName: string = name.toLowerCase();
  const trimmedName: string = loweredName.trim();

  return trimmedName;
};
