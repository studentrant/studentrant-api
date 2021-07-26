const configuraitons = {
  'sendGrid.apiKey': 'hello_world',
  'SERVER.HOST': 'testhost',
  'SERVER.PORT': 1337,
};

const config = {
  get(prop) {
    return configuraitons[prop];
  },
};
export default config;
