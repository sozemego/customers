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
