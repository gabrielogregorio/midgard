const regex = /^\s*```(.*)\n([\s\S]{1,}?)```/gm;

type detectCodeWithoutLanguageType = { type: 'code-without-language'; file: string; code: string };

export const detectCodeWithoutLanguage = (text: string): detectCodeWithoutLanguageType[] => {
  const final: detectCodeWithoutLanguageType[] = [];
  const matchItems = [...text.matchAll(regex)];

  matchItems.forEach((match) => {
    const language = match[1];
    if (!language.trim()) {
      final.push({
        type: 'code-without-language',
        file: '',
        code: match[0]
      });
    }
  });

  return final;
};
