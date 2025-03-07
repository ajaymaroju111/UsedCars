// import globals from "globals";
const globals = require("globals"); // This is a Node.js module
const pluginJs = require("@eslint/js"); // This is a Node.js module 

// import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  pluginJs.configs.recommended,
];