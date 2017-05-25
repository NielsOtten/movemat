function errorMongoosify(error) {
  return [
    {
      error: {
        message: error,
      },
    },
  ];
}

function generateRandomString(N) {
  const s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array(...Array(N)).map(() => s.charAt(Math.floor(Math.random() * s.length))).join('');
}

function loggedIn(req) {
  return new Promise((resolve, reject) => {
    if(!req.user) reject();
    resolve();
  });
}

export {
  errorMongoosify,
  loggedIn,
  generateRandomString,
};
