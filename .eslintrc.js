module.exports = {
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "jest": true,
    "node": true,
    "es6": true
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module"
  },
  "plugins": [
    "react", "flowtype"
  ],
  "settings": {
    "react": {
      "version": "16.5",
      "flowVersion": "0.81"
    }
  },
  "rules": {
    "flowtype/define-flow-type": 1,
    "flowtype/require-valid-file-annotation": ["error", "always"],

    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single", "avoid-escape"],
    "semi": ["error", "always"],
    "no-var": ["error"],
    "brace-style": ["error"],
    "array-bracket-spacing": ["error", "never"],
    "block-spacing": ["error", "always"],
    "no-spaced-func": ["error"],
    "no-whitespace-before-property": ["error"],
    "space-before-blocks": ["error", "always"],
    "keyword-spacing": ["error"],

    "no-unused-vars": ["error", {"args": "none", "ignoreRestSiblings": true}]
  }
};
