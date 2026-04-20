export const uploadService = {
  upload: async (file: File): Promise<string> => URL.createObjectURL(file),
};
