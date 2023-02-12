import type * as P from '@playwright/test/reporter';
import { flattenSpecs } from './report';

export interface SpecData {
	/** The unique id of the spec. */
	playwrightId: string;
	/** The name of the spec with the project name prepended. */
	titleWithProject: string;
}

/** A map of treesitter id's to their corresponding playwright id's. */
interface IdMap {
	[key: string]: SpecData[];
}

/** Function to write the mapping to a plain text file */
export const writeIdMap = (idMap: IdMap, filePath: string) => {
	const [handle, errmsg] = io.open(filePath, 'w');

	if (!handle) {
		throw new Error(`Could not open file ${filePath}: ${errmsg}`);
	}

	for (const [tsId, playwrightIds] of pairs(idMap)) {
		// write. seperate with comma. newline at end
		handle.write(`${tsId} ${playwrightIds.join(',')}
`);
	}

	handle.close();
};

/** Function to read the mapping from a plain text file */
export const readIdMap = (filePath: string): IdMap => {
	const [handle, errmsg] = io.open(filePath, 'r');

	if (!handle) {
		throw new Error(`Could not open file ${filePath}: ${errmsg}`);
	}

	const idMap: IdMap = {};

	for (const [line] of handle.lines()) {
		const [tsId, playwrightIds] = line.split(' ');
		// @ts-ignore
		idMap[tsId!] = playwrightIds!.split(',');
	}

	handle.close();

	return idMap;
};

export const withTreesitterIds = (report: P.JSONReport) => {
	const idMap: IdMap = {};

	const root = report.suites[0]!;

	const specs = flattenSpecs(root);

	for (const spec of specs) {
		const isNamespaced = spec.file !== spec.title;

		let tsId: string;

		if (isNamespaced) {
			tsId = `${spec.file}::${spec.suiteTitle}::${spec.title}`;
		} else {
			tsId = `${spec.file}::${spec.title}`;
		}

		const titleWithProject = `${spec.tests[0]?.projectId}::${spec.title}`;

		const extra: SpecData = {
			playwrightId: spec.id,
			titleWithProject,
		};

		if (idMap[tsId]) {
			idMap[tsId]!.push(extra);
		} else {
			idMap[tsId] = [extra];
		}
	}

	return idMap;
};
