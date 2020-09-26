module.exports = {
  extends: 'airbnb-base',
  env: {
    <%= testFramework %>: true
  },
  rules: {
    'linebreak-style': 0,
    'no-unused-expressions': 0,
    'comma-dangle': ['error', 'never']
  }
};
