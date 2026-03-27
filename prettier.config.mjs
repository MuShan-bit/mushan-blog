const prettierConfig = {
  plugins: ["prettier-plugin-tailwindcss"],
  printWidth: 100,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  tailwindFunctions: ["cn", "clsx", "twMerge"],
  proseWrap: "preserve",
};

export default prettierConfig;
