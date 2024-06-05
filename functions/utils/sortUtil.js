exports.crtDate = (a, b) => {
  return a.creationDate < b.creationDate ? 1 : -1;
};
exports.type = (a, b) => {
  return a.type > b.type ? 1 : -1;
};
exports.title = (a, b) => {
  return a.title > b.title ? 1 : -1;
};
