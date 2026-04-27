/**
 * Minimal YAML parser for briefing files.
 * Handles the subset of YAML we need: scalars, maps, lists, multi-line strings.
 * For production use, consider adding js-yaml as a dependency.
 */
export async function loadYaml(url: string, fetchFn: typeof fetch): Promise<Record<string, unknown> | null> {
	try {
		const res = await fetchFn(url);
		if (!res.ok) return null;
		const text = await res.text();
		return parseSimpleYaml(text);
	} catch {
		return null;
	}
}

export function parseSimpleYaml(text: string): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	const lines = text.split('\n');
	let i = 0;

	while (i < lines.length) {
		const line = lines[i];

		// Skip comments and blanks
		if (line.trim() === '' || line.trim().startsWith('#')) {
			i++;
			continue;
		}

		const indent = line.length - line.trimStart().length;
		if (indent > 0) {
			i++;
			continue; // skip nested lines at top level (handled by block collectors)
		}

		const colonIdx = line.indexOf(':');
		if (colonIdx === -1) {
			i++;
			continue;
		}

		const key = line.slice(0, colonIdx).trim();
		const valueStr = line.slice(colonIdx + 1).trim();

		if (valueStr === '|') {
			// Multi-line scalar
			const blockLines: string[] = [];
			i++;
			while (i < lines.length) {
				const bl = lines[i];
				if (bl.trim() === '' || (bl.length - bl.trimStart().length) > 0) {
					blockLines.push(bl.replace(/^  /, ''));
					i++;
				} else {
					break;
				}
			}
			result[key] = blockLines.join('\n').trimEnd();
		} else if (valueStr === '') {
			// Could be a map or list
			i++;
			const children = collectBlock(lines, i, 2);
			i = children.endIndex;

			if (children.lines.length > 0 && children.lines[0].trimStart().startsWith('-')) {
				result[key] = parseList(children.lines);
			} else {
				result[key] = parseMap(children.lines);
			}
		} else {
			result[key] = parseScalar(valueStr);
			i++;
		}
	}

	return result;
}

function collectBlock(lines: string[], start: number, minIndent: number): { lines: string[]; endIndex: number } {
	const collected: string[] = [];
	let i = start;
	while (i < lines.length) {
		const line = lines[i];
		if (line.trim() === '') {
			collected.push(line);
			i++;
			continue;
		}
		const indent = line.length - line.trimStart().length;
		if (indent >= minIndent) {
			collected.push(line);
			i++;
		} else {
			break;
		}
	}
	return { lines: collected, endIndex: i };
}

function parseList(lines: string[]): unknown[] {
	const items: unknown[] = [];
	let i = 0;

	while (i < lines.length) {
		const line = lines[i];
		if (line.trim() === '') {
			i++;
			continue;
		}

		const trimmed = line.trimStart();
		if (trimmed.startsWith('- ')) {
			const content = trimmed.slice(2);
			// Check if it's a map item (has a colon)
			const colonIdx = content.indexOf(':');
			if (colonIdx > 0 && !content.startsWith('"') && !content.startsWith("'")) {
				// It's a map item starting on the dash line
				const mapLines = [content];
				const baseIndent = line.length - line.trimStart().length + 2;
				i++;
				while (i < lines.length) {
					const ml = lines[i];
					if (ml.trim() === '') {
						i++;
						continue;
					}
					const mIndent = ml.length - ml.trimStart().length;
					if (mIndent >= baseIndent && !ml.trimStart().startsWith('-')) {
						mapLines.push(ml.trimStart());
						i++;
					} else {
						break;
					}
				}
				items.push(parseMap(mapLines));
			} else {
				items.push(parseScalar(content));
				i++;
			}
		} else {
			i++;
		}
	}

	return items;
}

function parseMap(lines: string[]): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	let i = 0;

	while (i < lines.length) {
		const line = lines[i];
		if (line.trim() === '' || line.trim().startsWith('#')) {
			i++;
			continue;
		}

		const colonIdx = line.indexOf(':');
		if (colonIdx === -1) {
			i++;
			continue;
		}

		const key = line.slice(0, colonIdx).trim();
		const valueStr = line.slice(colonIdx + 1).trim();

		if (valueStr === '|') {
			const keyIndent = line.length - line.trimStart().length;
			const blockLines: string[] = [];
			i++;
			while (i < lines.length) {
				const bl = lines[i];
				const blIndent = bl.length - bl.trimStart().length;
				if (bl.trim() === '' || blIndent > keyIndent) {
					blockLines.push(bl.replace(new RegExp(`^ {${keyIndent + 4}}|^ {${keyIndent + 2}}`, ''), ''));
					i++;
				} else {
					break;
				}
			}
			result[key] = blockLines.join('\n').trimEnd();
		} else if (valueStr === '') {
			i++;
			// nested structure
			const children = collectBlock(lines, i, 2);
			i = children.endIndex;
			if (children.lines.length > 0 && children.lines[0].trimStart().startsWith('-')) {
				result[key] = parseList(children.lines);
			} else {
				result[key] = parseMap(children.lines);
			}
		} else {
			result[key] = parseScalar(valueStr);
			i++;
		}
	}

	return result;
}

function parseScalar(value: string): string | number | boolean {
	// Remove surrounding quotes
	if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
		return value.slice(1, -1);
	}
	// Remove inline comments
	const commentIdx = value.indexOf(' #');
	const clean = commentIdx >= 0 ? value.slice(0, commentIdx).trim() : value;

	if (clean === 'true') return true;
	if (clean === 'false') return false;
	if (/^-?\d+$/.test(clean)) return parseInt(clean, 10);
	if (/^-?\d+\.\d+$/.test(clean)) return parseFloat(clean);
	return clean;
}
