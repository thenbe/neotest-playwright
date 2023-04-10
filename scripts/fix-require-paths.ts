import MagicString from 'magic-string';
import fs from 'node:fs';
import glob from 'tiny-glob';

const NO_REPLACE = [
	'neotest',
	'neotest.async',
	'neotest.lib',
	'neotest.logging',
	'say',
];

const PREFIX = 'neotest-playwright';

const transform = (file: string) => {
	const contents = fs.readFileSync(file, 'utf-8');

	const magicString = new MagicString(contents);

	// look for all require statements, if they are in the NO_REPLACE array, don't replace them
	// else, add the prefix to them like so: require('neotest-playwright.submodule')
	magicString.replace(/require\(["']([^"']+)["']\)/g, (match, p1: string) => {
		// skip imports that are already prefixed either by tstl or previous runs
		// of this script
		const alreadyPrefixed = p1.startsWith(PREFIX);

		if (NO_REPLACE.includes(p1) || alreadyPrefixed) {
			console.log(`[FIX-PATHS] [SKIP] ${p1}`);
			return match;
		}

		console.log(`[FIX-PATHS] [ FIX] ${p1} -> ${PREFIX}.${p1}`);
		return `require('${PREFIX}.${p1}')`;
	});

	// Save
	fs.writeFileSync(file, magicString.toString());
};

const main = async () => {
	// match all files in the src/dto folder, and transform them into the ./converted folder
	const files = await glob('./lua/**/*.lua');

	files.forEach((file) => {
		transform(file);
	});
};

main()
	.catch(console.error)
	.finally(() => process.exit(0));
