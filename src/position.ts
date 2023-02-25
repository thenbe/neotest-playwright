import type * as P from '@playwright/test/reporter';
import type { Position, RangedPosition, RangelessPosition } from 'neotest';
import * as logger from 'neotest.logging';
import type { AdapterData } from './types/adapter';

type BasePosition = Omit<RangedPosition, 'id'>;

// WARN: remove debug code

/** Given a test position, return one or more positions based on what can be
 * dynamically discovered using the playwright cli. */
export const buildTestPosition = (
	basePosition: BasePosition,
	data: AdapterData,
): Position[] => {
	const line = basePosition.range[0];
	// const column = position.range[1];

	const specs = data.specs!.filter((spec) => {
		logger.debug('spec', spec);
		logger.debug('basePosition', basePosition);

		const specAbsolutePath = data.rootDir + '/' + spec.file;
		logger.debug('specAbsolutePath', specAbsolutePath);

		const fileMatch = specAbsolutePath === basePosition.path;
		logger.debug('fileMatch', fileMatch);

		if (!fileMatch) {
			return false;
		}

		const rowMatch = spec.line === line + 1;
		logger.debug('rowMatch', rowMatch);
		// const columnMatch = spec.column === column + 1;

		const match = rowMatch && fileMatch;
		logger.debug('match', match);

		return match;
	});

	if (specs.length === 0) {
		logger.debug('No match found');
		logger.debug('data.specs', data.specs);
		logger.debug('basePosition', basePosition);

		// TODO: return position with available data
		// throw new Error('No match found');
		return [basePosition];
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
	const projectId = spec.tests[0]?.projectName;
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
