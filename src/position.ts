import type * as P from '@playwright/test/reporter';
import type { Position, RangedPosition, RangelessPosition } from 'neotest';
import * as logger from 'neotest.logging';
import { emitError } from './helpers';
import { data } from './adapter-data';

type BasePosition = Omit<RangedPosition, 'id'>;

// WARN: remove debug code

/** Given a test position, return one or more positions based on what can be
 * dynamically discovered using the playwright cli. */
export const buildTestPosition = (basePosition: BasePosition): Position[] => {
	const line = basePosition.range[0];
	// const column = position.range[1];

	if (!data.specs) {
		throw new Error('No specs found');
	}

	const specs = data.specs.filter((spec) => {
		const specAbsolutePath = data.rootDir + '/' + spec.file;

		const fileMatch = specAbsolutePath === basePosition.path;

		if (!fileMatch) {
			return false;
		}

		const rowMatch = spec.line === line + 1;
		// const columnMatch = spec.column === column + 1;

		const match = rowMatch && fileMatch;

		return match;
	});

	if (specs.length === 0) {
		logger.debug('No match found');

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

	// filter out positions belonging to ignored projects
	const projects = data.projects;

	positions = positions.filter((position) => {
		const projectId = position.project_id;

		if (!projectId) {
			// The main position doesn't have a project id
			return true;
		}

		return projects.includes(projectId);
	});

	return positions;
};

// TODO: add to readme. testDir should be defined in playwright config.

/** Convert a playwright spec to a neotest position. */
const specToPosition = (
	spec: P.JSONReportSpec,
	basePosition: BasePosition,
): RangelessPosition | RangedPosition => {
	const projectId = spec.tests[0]?.projectName;

	if (!projectId) {
		const msg = `No project id found for spec: ${spec.title}`;
		emitError(msg);
		throw new Error(msg);
	}

	const { range, ...rest } = basePosition;
	const position = {
		...rest,
		id: spec.id,
		name: projectId,
		project_id: projectId,
	};

	return position;
};
