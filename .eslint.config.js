const prettierPlugin = require("eslint-plugin-prettier");
const typescriptParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const angularPlugin = require("@angular-eslint/eslint-plugin");

module.exports = [
  {
    ignores: [".cache/", ".git/", "node_modules/"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "@angular-eslint": angularPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...angularPlugin.configs.recommended.rules,
      ...prettierPlugin.configs?.rules,
      "prettier/prettier": "error",
    },
  },
];
