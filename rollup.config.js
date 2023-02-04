const typescript = require("@rollup/plugin-typescript");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const replace = require("@rollup/plugin-replace");
const serve = require("rollup-plugin-serve");
const html = require("@rollup/plugin-html");
const livereload = require("rollup-plugin-livereload");
const postcss = require("rollup-plugin-postcss");
const autoprefixer = require("autoprefixer");
const tailwindcss = require("tailwindcss");
const terser = require("@rollup/plugin-terser");

const { createHtmlTemplate } = require("./helper.js");

process.env.NODE_ENV = process.env.NODE_ENV || "production";
const isProduction = process.env.NODE_ENV === "production";

console.log(`Building for ${process.env.NODE_ENV} environment`);

module.exports = {
  input: "./src/main.tsx",
  output: [
    {
      file: "./dist/bundle.js",
      format: "iife",
      sourcemap: !isProduction,
    },
  ],
  plugins: [
    commonjs(),
    resolve(),
    replace({
      preventAssignment: true,
      values: {
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      },
    }),
    typescript(),
    isProduction && terser(),
    postcss({
      plugins: [autoprefixer(), tailwindcss()],
      extract: true,
      minimize: isProduction,
    }),
    html({
      title: "React Sample App",
      template: createHtmlTemplate,
    }),
    !isProduction &&
      serve({
        contentBase: "dist",
        port: 3000,
        open: true,
      }),
    !isProduction && livereload(),
  ],
};
