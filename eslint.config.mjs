"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import globals from "globals";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
export default tseslint.config({
    ignores: [
        "node_modules/",
        "build/",
        "coverage/",
        "*.config.js",
        "jest.config.js",
        "babel.config.js"
    ]
}, {
    files: ["**/*.ts"],
    extends: [tseslint.configs.recommended],
    languageOptions: {
        globals: __assign(__assign({}, globals.node), globals.jest),
        parserOptions: {
            project: "./tsconfig.json",
            ecmaVersion: 2020,
            sourceType: "module"
        }
    },
    plugins: {
        prettier: prettierPlugin
    },
    rules: __assign(__assign({}, prettierConfig.rules), { "prettier/prettier": "warn", "@typescript-eslint/no-unused-vars": ["warn", {
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_",
                "caughtErrorsIgnorePattern": "^_|error"
            }], "@typescript-eslint/explicit-function-return-type": "off", "@typescript-eslint/no-explicit-any": "warn", "@typescript-eslint/no-var-requires": "off", "@typescript-eslint/no-require-imports": "off" })
});
