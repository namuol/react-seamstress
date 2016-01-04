export default function getAllMatches (regexp, str) {
  const results = [];
  
  let result;
  while ((result = regexp.exec(str)) !== null) {
    results.push(result);
  }

  return results;
}