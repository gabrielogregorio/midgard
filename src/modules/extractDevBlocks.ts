export type returnTypeExtractBlock = { markdown: string; type: 'normal' | 'dev' };

export const extractDevBlocks = (text: string): returnTypeExtractBlock[] => {
  let normalText = '';
  let devText = '';
  let startDev = false;
  let startText = true;
  let returns: returnTypeExtractBlock[] = [];

  text.split('\n').forEach((line) => {
    if (line.includes('<!-- dev:start -->')) {
      if (startText && normalText) {
        returns.push({
          type: 'normal',
          markdown: normalText
        });
      }
      normalText = '';
      startText = false;
      startDev = true;
      return;
    }

    if (line.includes('<!-- dev:end -->')) {
      if (devText) {
        returns.push({
          type: 'dev',
          markdown: devText
        });
      }
      devText = '';
      startText = true;
      startDev = false;
      return;
    }

    if (startDev) {
      devText += devText ? '\n' + line : line;
    }

    if (startText) {
      normalText += normalText ? '\n' + line : line;
    }
  });

  if (startText && normalText) {
    returns.push({
      type: 'normal',
      markdown: normalText
    });
  }

  if (startDev && devText) {
    returns.push({
      type: 'dev',
      markdown: devText
    });
  }

  return returns;
};
