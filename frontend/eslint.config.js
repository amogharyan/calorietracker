import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginPrettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig
(
  [
    {
      files:
      [
        "**/*.{js,mjs,cjs,jsx}"
      ],
      plugins:
      {
        js,
        react: pluginReact,
        prettier: pluginPrettier
      },
      extends:
      [
        "js/recommended",
        pluginReact.configs.flat.recommended,
        configPrettier
      ],
      languageOptions:
      {
        globals: globals.browser
      },
      rules:
      {
        "prettier/prettier": "error",
        "react/react-in-jsx-scope": "off"
      }
    }
  ]
);