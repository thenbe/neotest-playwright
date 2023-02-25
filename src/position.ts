import type * as P from '@playwright/test/reporter';
import type { Position, RangedPosition, RangelessPosition } from 'neotest';
import * as lib from 'neotest.lib';
import type { AdapterData } from './types/adapter';

type BasePosition = Omit<RangedPosition, 'id'>;

// WARN: remove debug code

/** Given a test position, return one or more positions based on what can be
 * dynamically discovered using the playwright cli. */
export const buildTestPosition = (basePosition: BasePosition): Position[] => {
	const [_data, err] = lib.subprocess.call(
		'require("neotest-playwright.discover")._get_data',
	);

	const data = _data as AdapterData;

	// logger.debug('err---------', err);
	// logger.debug('raw_result---------', raw_result);

	const line = basePosition.range[0];
	// const column = position.range[1];

	const specs = data.specs!.filter((spec) => {
		const rowMatch = spec.line === line + 1;
		// const columnMatch = spec.column === column + 1;
		const specAbsolutePath = data.rootDir + '/' + spec.file;
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
