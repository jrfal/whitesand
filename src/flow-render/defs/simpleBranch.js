export default (payload, context, props = {}) => {
  return new Promise((resolve, reject) => {
    resolve({ branch: payload });
  });
};
