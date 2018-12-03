module.exports = {
  env: { node: true, mocha: true, es6: true },
  extends: ["eslint:recommended", "prettier"],
  plugins: ["typescript"],
  parser: "vue-eslint-parser",
  parserOptions: { parser: "typescript-eslint-parser" },
  plugins: ["mocha"],
  rules: {
    "no-console": "off",
    "no-unused-vars": "off"
  }
};
