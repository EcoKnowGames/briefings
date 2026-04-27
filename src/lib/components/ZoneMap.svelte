<script lang="ts">
	let {
		mapCsv,
		zones
	}: {
		mapCsv: string;
		zones: { name: string; color: string }[];
	} = $props();

	interface Tile {
		zoneId: number;
		populations: number[];
	}

	function parseMap(csv: string): { grid: (Tile | null)[][]; bg: string; zoneColors: string[] } {
		const lines = csv.trim().split('\n');
		let bg = '#8B7355';
		const zoneColors: string[] = [];

		// Parse header comments
		const dataLines: string[] = [];
		for (const line of lines) {
			if (line.startsWith('#bg:')) {
				bg = line.slice(4).trim();
			} else if (line.startsWith('#zones:')) {
				const parts = line.slice(7).split(',');
				for (const p of parts) {
					const colorMatch = p.match(/:([^,]+)$/);
					if (colorMatch) zoneColors.push(colorMatch[1]);
				}
			} else if (!line.startsWith('#')) {
				dataLines.push(line);
			}
		}

		// Parse grid
		const grid: (Tile | null)[][] = [];
		for (const row of dataLines) {
			const tiles: (Tile | null)[] = [];
			// Split by comma but respect brackets
			const cells = row.match(/-1|(\d+)\[([^\]]+)\]/g) ?? [];
			for (const cell of cells) {
				if (cell === '-1') {
					tiles.push(null);
				} else {
					const m = cell.match(/(\d+)\[([^\]]+)\]/);
					if (m) {
						const zoneId = parseInt(m[1]);
						const populations = m[2].split(',').map(Number);
						tiles.push({ zoneId, populations });
					}
				}
			}
			grid.push(tiles);
		}

		return { grid, bg, zoneColors };
	}

	const { grid, bg, zoneColors } = parseMap(mapCsv);
	const rows = grid.length;
	const cols = Math.max(...grid.map((r) => r.length));

	// Hex tile dimensions
	const hexW = 40;
	const hexH = 36;
	const gapX = hexW * 0.76;
	const gapY = hexH * 0.88;

	const svgW = gapX * cols + hexW * 0.3;
	const svgH = gapY * rows + hexH * 0.5;

	function hexPath(cx: number, cy: number, r: number): string {
		const pts: string[] = [];
		for (let i = 0; i < 6; i++) {
			const angle = (Math.PI / 180) * (60 * i - 30);
			pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
		}
		return `M${pts.join('L')}Z`;
	}
</script>

<div class="flex w-full max-w-[440px] flex-col items-center gap-4">
	<svg viewBox="0 0 {svgW} {svgH}" class="w-full max-w-[400px] overflow-visible rounded-panel" style="background: {bg};">
		{#each grid as row, r}
			{#each row as tile, c}
				{@const offsetX = r % 2 === 1 ? gapX * 0.5 : 0}
				{@const cx = c * gapX + hexW / 2 + offsetX}
				{@const cy = r * gapY + hexH / 2}
				{#if tile}
					<path
						d={hexPath(cx, cy, hexH / 2)}
						fill={zoneColors[tile.zoneId] ?? '#ccc'}
						stroke="rgba(255,255,255,0.3)"
						stroke-width="1.5"
					/>
				{/if}
			{/each}
		{/each}
	</svg>

	{#if zones.length > 0}
		<div class="flex gap-4">
			{#each zones as zone, i}
				<div class="flex items-center gap-1.5">
					<div class="size-3 rounded-sm" style="background: {zoneColors[i] ?? zone.color};"></div>
					<span class="text-[10px] font-semibold">{zone.name}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>
