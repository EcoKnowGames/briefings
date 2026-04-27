import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	const scenariosDir = 'static/scenarios';
	const dirs = readdirSync(scenariosDir, { withFileTypes: true })
		.filter((d) => d.isDirectory())
		.map((d) => d.name);

	const scenarios = dirs
		.map((slug) => {
			const jsonPath = join(scenariosDir, slug, 'scenario.json');
			if (!existsSync(jsonPath)) return null;

			const data = JSON.parse(readFileSync(jsonPath, 'utf-8'));
			const s = data.Scenario;
			const coverBase64 = s.CoverImageBase64 as string | undefined;
			return {
				slug,
				name: (s.Name as string) || slug,
				author: (s.Author as string) || '',
				description: ((s.Description as string) ?? '').slice(0, 200),
				coverImage: coverBase64 ? `data:image/png;base64,${coverBase64}` : ''
			};
		})
		.filter((s): s is NonNullable<typeof s> => s !== null);

	return { scenarios };
};
