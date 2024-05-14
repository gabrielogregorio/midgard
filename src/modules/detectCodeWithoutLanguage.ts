const regex = /^\s*```(.*)\n([\s\S]{1,}?)```/gm;

type detectCodeWithoutLanguageType = { type: 'code-without-language'; file: string; code: string };

export const detectCodeWithoutLanguage = (text: string): detectCodeWithoutLanguageType[] => {
  const final: detectCodeWithoutLanguageType[] = [];
  const code = [...text.matchAll(regex)];

  code.forEach((item) => {
    const language = item[1];
    if (!language.trim()) {
      final.push({
        type: 'code-without-language',
        file: '',
        code: item[0]
      });
    }
  });

  return final;
};
