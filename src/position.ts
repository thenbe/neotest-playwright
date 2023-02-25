import type * as P from '@playwright/test/reporter';
import type { Position, RangedPosition, RangelessPosition } from 'neotest';
import { options } from './adapter-options';
import { flattenSpecs } from './report';
import { readReport } from './report-io';

type BasePosition = Omit<RangedPosition, 'id'>;

// WARN: remove debug code

// TODO: optimize format for efficient retrieval
let report: P.JSONReport | null = null;
let data: P.JSONReportSpec[] | null = null;
let rootDir: string | null = null;

/** Given a test position, return one or more positions based on what can be
 * dynamically discovered using the playwright cli. */
export const buildTestPosition = (basePosition: BasePosition): Position[] => {
	const line = basePosition.range[0];
	// const column = position.range[1];

	// TODO: move to own function
	if (!data || !rootDir) {
		report = readReport(options.tempDataFile);
		data = flattenSpecs(report!.suites[0]!);
		rootDir = report.config.rootDir;
		// throw new Error('No data');
	}

	const specs = data.filter((spec) => {
		const rowMatch = spec.line === line + 1;
		// const columnMatch = spec.column === column + 1;
		const specAbsolutePath = rootDir + '/' + spec.file;
		const fileMatch = specAbsolutePath === basePosition.path;
		return rowMatch && fileMatch;
	});

	if (specs.length === 0) {
		// TODO: return position with available data
		throw new Error('No match found');
	}

	let positions: Position[] = [];

	/** The parent of the range-less positions */
	const main = {
		...basePosition,
		// TODO: convert type to namespace? If so, ensure there's at lease one match
		// TODO: use treesitter id?
	} satisfies Position;

	positions.push(main);

	specs.map((spec) => positions.push(specToPosition(spec, basePosition)));

	return positions;
};

/** Convert a playwright spec to a neotest position. */
const specToPosition = (
	spec: P.JSONReportSpec,
	basePosition: BasePosition,
): RangelessPosition | RangedPosition => {
	const projectId = spec.tests[0]?.projectId;
	const name = `${projectId} - ${spec.title}`;

	const { range, ...rest } = basePosition;
	const position = {
		...rest,
		id: spec.id,
		name,
		project_id: projectId,
	};

	return position;
};
