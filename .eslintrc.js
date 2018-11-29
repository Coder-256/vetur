module.exports = {
  extends: ["eslint:recommended", "prettier"],
  plugins: ["typescript"],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "typescript-eslint-parser"
  }
};
