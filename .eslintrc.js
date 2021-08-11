module.exports = {
  extends: "@leocode/eslint-config/node",
  rules: {
    "no-return-await": "off",
    "@typescript-eslint/return-await": ["error", "always"],
  },
};
