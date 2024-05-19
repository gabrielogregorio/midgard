import fs from 'fs';
import path from 'path';

export const deleteFile = (folder: string) => {
  if (!fs.existsSync(folder)) {
    return;
  }

  fs.readdirSync(folder).forEach((file) => {
    const currentPath = path.join(folder, file);

    if (fs.lstatSync(currentPath).isDirectory()) {
      deleteFile(currentPath);
      return;
    }

    fs.unlinkSync(currentPath);
  });
};
