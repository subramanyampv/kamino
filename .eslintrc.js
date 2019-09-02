module.exports = {
  "parser": "@typescript-eslint/parser",
  "extends": ["plugin:@typescript-eslint/recommended"],
  "rules": {
    /**
     * Stylistic issues
     */
    "array-bracket-newline": ["error"],
    "array-bracket-spacing": ["error"],
    "array-element-newline": ["error"],
    "block-spacing": ["error"],
    "brace-style": ["error"],
    "camelcase": ["error"],
    "capitalized-comments": ["error"],
    "comma-dangle": ["error"],
    "comma-spacing": ["error"],
    "comma-style": ["error"],
    "computed-property-spacing": ["error"],
    "consistent-this": ["error"],
    "eol-last": ["error"],
    "func-call-spacing": ["error"],
    "func-name-matching": ["error"],
    // Do not require function names
    "func-names": ["error", "never"],
    // Prefer declaration over expression
    "func-style": ["error", "declaration"],
    // Be consistent in arguments per line
    "function-call-argument-newline": ["error", "consistent"],
    "function-paren-newline": ["error"],
    "id-blacklist": ["off"],
    "id-length": ["error", { "exceptions": ["i"] }],
    "id-match": ["off"],
    "indent": ["error", 2, {
      "SwitchCase": 1,
      "MemberExpression": 1,
      "ArrayExpression": 1,
      "ObjectExpression": 1
    }],
    "jsx-quotes": ["off"],
    "key-spacing": ["error"],
    "keyword-spacing": ["error"],
    "line-comment-position": ["error"],
    // Allow CRLF on Windows
    "linebreak-style": ["off"],
    "lines-around-comment": ["error"],
    "lines-between-class-members": ["error"],
    "max-depth": ["error", 2],
    "max-len": ["error", {
      "code": 90,
      "ignoreComments": true,
      "ignoreStrings": true,
      "ignoreTemplateLiterals": true
    }],
    "max-lines": ["error", 157],
    "max-lines-per-function": ["error", 80],
    "max-nested-callbacks": ["error"],
    "max-params": ["error"],
    "max-statements": ["error", 11],
    "max-statements-per-line": ["error"],
    "multiline-ternary": ["error"],
    "new-cap": ["error", { "capIsNewExceptions": ["Given", "When", "Then", "Before", "After"] }],
    "new-parens": ["error"],
    "newline-per-chained-call": ["error"],
    "no-array-constructor": ["error"],
    "no-bitwise": ["error"],
    "no-continue": ["error"],
    "no-inline-comments": ["error"],
    "no-lonely-if": ["error"],
    "no-mixed-operators": ["error"],
    "no-mixed-spaces-and-tabs": ["error"],
    "no-multi-assign": ["error"],
    "no-multiple-empty-lines": ["error"],
    "no-negated-condition": ["error"],
    "no-nested-ternary": ["error"],
    "no-new-object": ["error"],
    // Allow i++ in for loops
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "no-restricted-syntax": ["error"],
    "no-tabs": ["error"],
    // Allow ternary operator
    "no-ternary": ["off"],
    "no-trailing-spaces": ["error"],
    // Allow this._privateField
    "no-underscore-dangle": ["error", { "allowAfterThis": true }],
    "no-unneeded-ternary": ["error"],
    "no-whitespace-before-property": ["error"],
    "prefer-object-spread": ["error"],
    "quotes": ["error", "single", { "allowTemplateLiterals": true }],

    /**
     * ES6
     */
    "arrow-body-style": ["error"],
    "arrow-parens": ["error", "as-needed"],
    "arrow-spacing": ["error"],
    "constructor-super": ["error"],
    "generator-star-spacing": ["error"],
    "no-class-assign": ["error"],
    "no-confusing-arrow": ["error"],
    "no-dupe-class-members": ["error"],
    "no-duplicate-imports": ["error"],
    "no-new-symbol": ["error"],
    "no-this-before-super": ["error"],
    "no-useless-computed-key": ["error"],
    // not compatible with some TS features
    "no-useless-constructor": ["off"],
    "no-useless-rename": ["error"],
    "no-var": ["error"],
    "object-shorthand": ["error"],
    "prefer-arrow-callback": ["error"],
    "prefer-const": ["error"],
    "prefer-destructuring": ["error"],
    "prefer-rest-params": ["error"],
    "prefer-spread": ["error"],
    "prefer-template": ["error"],
    "require-yield": ["error"],
    "rest-spread-spacing": ["error"],
    "sort-imports": ["error"],
    "template-curly-spacing": ["error"],
    "yield-star-spacing": ["error"],

    /**
     * Best practices
     */
    "array-callback-return": ["error"],
    "block-scoped-var": ["error"],
    "class-methods-use-this": ["error"],
    "complexity": ["error", 7],
    "consistent-return": ["error"],
    "curly": ["error", "all"],
    "default-case": ["error"],
    // The default is 'object', but I prefer 'property'
    "dot-location": ["error", "property"],
    "dot-notation": ["error"],
    "eqeqeq": ["error"],
    "no-return-await": ["error"],
    "no-throw-literal": ["error"],
    // Allow expect(blah).to.be.true;
    "no-unused-expressions": ["off"],
    "require-await": ["error"],
    "yoda": ["error"]
  }
};
