export function capitaliseFirst(str) {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}

export function removeId(map, id) {
  return Object.values(map)
    .filter(obj => obj.id !== id)
    .reduce((nextMap, curr) => {
      nextMap[curr.id] = curr;
      return nextMap;
    }, {});
}

export function encode64(obj) {
  if (obj instanceof String) {
    return btoa(obj);
  }
  const str = JSON.stringify(obj);
  return btoa(str);
}

export function decode64(obj, asObject = true) {
  const decoded = atob(obj);
  if (asObject) {
    return JSON.parse(decoded);
  }
  return decoded;
}
