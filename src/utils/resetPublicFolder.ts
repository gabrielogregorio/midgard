import { createFile } from './createFile';
import { deleteFile } from './deleteFile';

export const resetPublicFolder = () => {
  const publicFolder = './public';

  deleteFile(publicFolder);
  createFile(publicFolder);
};
