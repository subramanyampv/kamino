module.exports = {
  "parser": "@typescript-eslint/parser",
  "extends": ["plugin:@typescript-eslint/recommended"],
  "rules": {
    "max-depth": ["error", 2],
    "max-len": ["error", {
      "code": 80,
      "ignoreComments": true,
      "ignoreStrings": true,
      "ignoreTemplateLiterals": true
    }],
    "max-lines": ["error", 100],
    "max-lines-per-function": ["error", 20],
  }
};
