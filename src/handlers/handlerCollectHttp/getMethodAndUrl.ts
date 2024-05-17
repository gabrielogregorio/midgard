const regexGetMethodAndUrl = /^(GET|HEAD|POST|PUT|DELETE|CONNECT|OPTIONS|TRACE|PATCH)\s{1,}(.*)\s{1,}HTTP.*/;
export const getMethodAndUrl = (line: string) => {
  const urlAndMethod = line.match(regexGetMethodAndUrl);
  if (!urlAndMethod) {
    return null;
  }

  return {
    url: urlAndMethod?.[2],
    method: urlAndMethod?.[1]
  };
};
