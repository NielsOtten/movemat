
function errorMongoosify(error) {
  return [
    {
      error: {
        message: error,
      },
    },
  ];
}

module.exports = {
  errorMongoosify,
};
