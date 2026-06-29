import { defineConfig } from "tsup";

export default defineConfig([
	{
		entry: [
			"src/core/index.ts",
			"src/adapters/index.ts",
			"src/storage/index.ts",
		],
		format: [ "esm" ],
		target: "es2022",
		splitting: true,
		bundle: true,
		treeshake: true,
		minify: false,
		sourcemap: true,
		dts: true,
		clean: true,
		outExtension: () => ({ js: ".js" })
	},
	{
		entry: ["src/loader/index.ts"],
		format: ["iife"],
		target: "es2017",
		bundle: true,
		splitting: false,
		treeshake: true,
		minify: "terser",
		sourcemap: false,
		dts: false,
		clean: false,
		outDir: "dist/loader",
		outExtension: () => ({ js: ".min.js" }),
		esbuildOptions(options) {
			options.keepNames = false;
			options.minifyIdentifiers = true;
			options.minifySyntax = true;
			options.minifyWhitespace = true;
			options.legalComments = "none";
			options.charset = "utf8";
		}
	}
]);