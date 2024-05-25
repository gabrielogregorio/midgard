const regexRemoveDots = /,{1,}\s*\n*\s*\}/gm;

export const convertStringToObject = (object: string): object | null => {
  try {
    const item = JSON.parse(object.replace(regexRemoveDots, '\n}'));
    if (typeof item !== 'object') {
      return null;
    }
    return item;
  } catch (error) {
    return null;
  }
};
