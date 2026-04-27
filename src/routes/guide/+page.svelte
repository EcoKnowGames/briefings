<script lang="ts">
	import { X, FileBracesCorner, FileText, Copy, Check, ChevronDown, ChevronUp, Play } from '@lucide/svelte';
	import { asset } from '$app/paths';
	import SiteNav from '$lib/components/SiteNav.svelte';
	import LiveBlock from '$lib/components/LiveBlock.svelte';
	import ProseBlock from '$lib/components/ProseBlock.svelte';
	import HexIcon from '$lib/components/HexIcon.svelte';
	import CurrencyIcon from '$lib/components/CurrencyIcon.svelte';
	import ReadingLink from '$lib/components/ReadingLink.svelte';

	let { data } = $props();

	// --- Scenario state ---
	interface GuideEntity {
		id: string;
		icon: string;
		colour: string;
	}

	let scenarioName = $state(data.defaultScenario.name);
	let scenarioEntities: GuideEntity[] = $state(data.defaultScenario.entities);
	let scenarioKey = $state(0); // incremented to remount entity-dependent LiveBlocks

	// Build entity lookup map reactively
	let entityMap = $derived(
		Object.fromEntries(
			scenarioEntities.map((e) => [
				e.id,
				{
					icon: e.icon,
					color: colorToCss(e.colour),
					name: humanizeId(e.id)
				}
			])
		) as Record<string, { icon: string; color: string; name: string }>
	);

	// Generate example YAML from current scenario entities
	let entityDescCode = $derived.by(() => {
		const ents = scenarioEntities.slice(0, 2);
		if (ents.length === 0) return 'entity_descriptions:\n  EntityId: |\n    Description here.';
		return (
			'entity_descriptions:\n' +
			ents
				.map(
					(e) =>
						`  ${e.id}: |\n    Description of ${humanizeId(e.id)} and its\n    role in the ecosystem.`
				)
				.join('\n')
		);
	});

	let objectivesCode = $derived.by(() => {
		const first = scenarioEntities[0];
		const entLine = first
			? `  - title: ${humanizeId(first.id)} Population\n    entity: ${first.id}\n    description: Maintain a healthy population.\n    goal: Keep ${humanizeId(first.id)} above 500 for 3 rounds`
			: `  - title: Population Target\n    entity: EntityId\n    description: Maintain a healthy population.\n    goal: Keep above 500 for 3 rounds`;
		return `objectives:\n${entLine}\n  - title: Financial Sustainability\n    icon: currency\n    description: Don't overspend on introductions.\n    goal: Keep budget above 2,000 for 2 rounds`;
	});

	let watchOutCode = $derived.by(() => {
		const first = scenarioEntities[0];
		const entLine = first
			? `  - entity: ${first.id}\n    description: Watch out for ${humanizeId(first.id)} levels getting out of control.`
			: `  - entity: EntityId\n    description: Watch out for this entity.`;
		return `watch_out:\n${entLine}\n  - icon: currency\n    name: Overspending\n    description: Spending too much too early can leave you short on funds later.`;
	});

	// --- Scenario loading ---
	async function loadScenario(slug: string) {
		try {
			const res = await fetch(asset(`/scenarios/${slug}/scenario.json`));
			if (!res.ok) return;
			const json = await res.json();
			applyScenario(json, slug);
		} catch {
			/* ignore */
		}
	}

	function applyScenario(json: any, name: string) {
		const s = json.Scenario ?? json;
		scenarioName = s.Name ?? name;
		scenarioEntities = ((s.Entities as any[]) ?? []).map((e: any) => ({
			id: e.ID as string,
			icon: e.Icon as string,
			colour: e.Colour as string
		}));
		scenarioKey++;
	}

	let isCustom = $state(false);
	let fullExampleCopied = $state(false);
	let entityPanelOpen = $state(true);
	let copiedEntityId = $state('');
	let customFileName = $state('');
	let dragging = $state(false);

	async function handleFile(file: File) {
		try {
			const text = await file.text();
			const json = JSON.parse(text);
			applyScenario(json, file.name.replace('.json', ''));
			isCustom = true;
			customFileName = file.name;
		} catch {
			/* ignore invalid files */
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		const file = e.dataTransfer?.files[0];
		if (file) handleFile(file);
	}

	function handleInputChange(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (file) handleFile(file);
	}

	function clearCustom() {
		scenarioName = data.defaultScenario.name;
		scenarioEntities = data.defaultScenario.entities;
		isCustom = false;
		customFileName = '';
		scenarioKey++;
	}

	// --- Icon resolution ---
	const CUSTOM_ICONS = new Set([
		'benguet_pine_high_contrast',
		'bamboo_high_contrast',
		'coffee_plant_high_contrast',
		'currency',
		'faeces_high_contrast',
		'fertiliser_high_contrast',
		'litter_high_contrast',
		'long_grass_high_contrast'
	]);

	function resolveGuideIcon(ref: string): string {
		if (!ref) return '';
		const name = ref.replace(/^Icons\//, '');
		if (name.includes('.')) return name;
		if (CUSTOM_ICONS.has(name)) return asset(`/icons/${name}.svg`);
		if (!name.endsWith('_high_contrast')) return '';
		const base = name.replace(/_high_contrast$/, '');
		const folder = base.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
		return asset(`/fluentui-emoji/assets/${encodeURIComponent(folder)}/High Contrast/${name}.svg`);
	}

	function colorToCss(colour: string): string {
		if (!colour || colour.length < 6) return '#888888';
		return `#${colour.slice(0, 2)}${colour.slice(2, 4)}${colour.slice(4, 6)}`;
	}

	function humanizeId(id: string): string {
		const name = id.includes('_')
			? id
					.split('_')
					.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
					.join(' ')
			: id.replace(/([A-Z])/g, ' $1').trim();
		return name.charAt(0).toUpperCase() + name.slice(1);
	}

	function parseMarkdown(input: string): string {
		return input
			.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
			.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
	}

	type Data = Record<string, unknown> | null;
	type AnyRecord = Record<string, unknown>;
	type AnyList = unknown[];
</script>

<svelte:head>
	<title>Adding Scenarios - EcoKnow Briefings</title>
</svelte:head>

<SiteNav />
<div class="mx-auto flex max-w-[800px] flex-col gap-10 px-4 pb-24 pt-15">
	<header class="flex flex-col gap-4">
		<div class="flex items-center gap-3">
			<FileText size={32} />
			<h1 class="text-2xl font-bold">Briefing Docs</h1>
		</div>
		<p class="text-[13px] leading-relaxed text-gray-500">
			Assuming you've already exported a Scenario JSON file. If not, get started with the <a href="https://ecoknowgames.github.io/how_to.html" target="_blank" rel="noopener noreferrer" class="font-semibold text-eco-blue underline">EcoKnow Creator guide</a> by Brad.
		</p>
	</header>

	<!-- Overview -->
	<section class="flex flex-col gap-4">
		<h2 class="text-base font-bold">Quick start</h2>
		<p class="text-[13px] leading-relaxed">
			Each scenario is a folder inside <code>static/scenarios/</code>. The folder name becomes the URL
			slug.
		</p>
		<p class="text-[13px] leading-relaxed">
			A scenario folder can contain up to three data files:
		</p>
		<div class="overflow-x-auto"><table class="w-full min-w-[500px] text-[11px] leading-relaxed">
			<thead>
				<tr class="border-b border-gray-200 text-left">
					<th class="pb-2 pr-3 font-bold">File</th>
					<th class="pb-2 pr-3 font-bold">Status</th>
					<th class="pb-2 font-bold">Description</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-b border-gray-100">
					<td class="py-2 pr-3 align-top"><code class="whitespace-nowrap rounded bg-eco-lightest-blue px-1.5 py-0.5 text-xs font-bold text-eco-blue">scenario.json</code></td>
					<td class="py-2 pr-3 align-top"><span class="whitespace-nowrap rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">Required</span></td>
					<td class="py-2 align-top text-gray-500">The scenario file exported from the EcoKnow Creator. Contains entities, win conditions, map grid and all game data.</td>
				</tr>
				<tr class="border-b border-gray-100">
					<td class="py-2 pr-3 align-top"><code class="whitespace-nowrap rounded bg-eco-lightest-blue px-1.5 py-0.5 text-xs font-bold text-eco-blue">briefing.yaml</code></td>
					<td class="py-2 pr-3 align-top"><span class="whitespace-nowrap rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">Optional</span></td>
					<td class="py-2 align-top text-gray-500">Adds descriptions, context and educational content. Without this, the page uses auto-generated content from the JSON.</td>
				</tr>
				<tr class="border-b border-gray-100">
					<td class="py-2 pr-3 align-top"><code class="whitespace-nowrap rounded bg-eco-lightest-blue px-1.5 py-0.5 text-xs font-bold text-eco-blue">map.csv</code></td>
					<td class="py-2 pr-3 align-top"><span class="whitespace-nowrap rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">Optional</span></td>
					<td class="py-2 align-top text-gray-500">A custom map with zone definitions. Zone names and colours are extracted and displayed on the briefing page.</td>
				</tr>
				<tr>
					<td class="py-2 pr-3 align-top"><code class="whitespace-nowrap rounded bg-eco-lightest-blue px-1.5 py-0.5 text-xs font-bold text-eco-blue">*.jpg / *.png</code></td>
					<td class="py-2 pr-3 align-top"><span class="whitespace-nowrap rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">Optional</span></td>
					<td class="py-2 align-top text-gray-500">Images referenced by <code>info_card.image</code> in your briefing YAML. Place them in the scenario folder.</td>
				</tr>
			</tbody>
		</table></div>
	</section>

	<!-- What you get for free -->
	<section class="flex flex-col gap-4">
		<h2 class="text-base font-bold">Just the scenario file?</h2>
		<p class="text-[13px] leading-relaxed">
			With just <code>scenario.json</code>, the briefing page automatically generates:
		</p>
		<div class="overflow-x-auto"><table class="w-full min-w-[500px] text-[11px] leading-relaxed">
			<thead>
				<tr class="border-b border-gray-200 text-left">
					<th class="pb-2 pr-3 font-bold">Feature</th>
					<th class="pb-2 pr-3 font-bold">Source</th>
					<th class="pb-2 font-bold">Details</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-b border-gray-100">
					<td class="py-2 pr-3 align-top font-semibold">Title &amp; author</td>
					<td class="py-2 pr-3 align-top text-gray-500"><code>Name</code>, <code>Author</code></td>
					<td class="py-2 align-top text-gray-500">Displayed in the header and navigation bar</td>
				</tr>
				<tr class="border-b border-gray-100">
					<td class="py-2 pr-3 align-top font-semibold">Gameplay summary</td>
					<td class="py-2 pr-3 align-top text-gray-500"><code>Rounds</code>, <code>ActionsPerRound</code>, <code>StartCurrency</code></td>
					<td class="py-2 align-top text-gray-500">Auto-generated paragraph with round, action and credit counts</td>
				</tr>
				<tr class="border-b border-gray-100">
					<td class="py-2 pr-3 align-top font-semibold">Entity cards</td>
					<td class="py-2 pr-3 align-top text-gray-500"><code>Entities[]</code></td>
					<td class="py-2 align-top text-gray-500">Icons and colours, split into "Introduce" and "Observe" groups</td>
				</tr>
				<tr class="border-b border-gray-100">
					<td class="py-2 pr-3 align-top font-semibold">Objectives</td>
					<td class="py-2 pr-3 align-top text-gray-500"><code>WinConditions[]</code></td>
					<td class="py-2 align-top text-gray-500">Icons, thresholds and round targets from each win condition</td>
				</tr>
				<tr class="border-b border-gray-100">
					<td class="py-2 pr-3 align-top font-semibold">Cover image</td>
					<td class="py-2 pr-3 align-top text-gray-500"><code>CoverImageBase64</code></td>
					<td class="py-2 align-top text-gray-500">Displayed below the title if present in the scenario</td>
				</tr>
				<tr>
					<td class="py-2 pr-3 align-top font-semibold">Creator version</td>
					<td class="py-2 pr-3 align-top text-gray-500"><code>AppVersion</code></td>
					<td class="py-2 align-top text-gray-500">Shown under the scenario title</td>
				</tr>
			</tbody>
		</table></div>
		<p class="text-[13px] leading-relaxed">
			The <code>briefing.yaml</code> lets you override any of these defaults and add educational
			context that doesn't exist in the game data.
		</p>
	</section>

	<!-- briefing.yaml reference -->
	<section class="flex flex-col gap-4">
		<h2 class="text-base font-bold">But you can go further...</h2>
		<p class="text-[13px] leading-relaxed">
			Every field is optional. Add only what you need. Edit the code below to see the preview update
			in real time, then use the copy button to grab the YAML for your briefing file.
		</p>

		{#if isCustom}
			<!-- Clear custom scenario -->
			<button
				onclick={clearCustom}
				class="flex w-full cursor-pointer items-center gap-3 rounded-panel border-none bg-eco-lightest-blue px-5 py-4 text-[13px] font-semibold text-eco-dark transition-opacity hover:opacity-80"
			>
				<X size={18} class="text-eco-blue" />
				Clear "{customFileName}"
			</button>
		{:else}
			<!-- Drop zone -->
			<label
				class="flex w-full cursor-pointer items-center gap-3 rounded-panel border-2 border-dashed px-5 py-6 transition-colors {dragging
					? 'border-eco-blue bg-eco-lightest-blue'
					: 'border-gray-300 hover:border-eco-light-blue'}"
				ondragover={(e) => {
					e.preventDefault();
					dragging = true;
				}}
				ondragleave={() => (dragging = false)}
				ondrop={handleDrop}
			>
				<FileBracesCorner size={22} class="shrink-0 text-eco-light-blue" />
				<span class="text-[13px] font-semibold text-eco-light-blue"
					>Drop your Scenario.json here to preview your entities</span
				>
				<input type="file" accept=".json" class="hidden" onchange={handleInputChange} />
			</label>
		{/if}

	</section>

	<!-- author_url -->
	<section class="flex flex-col gap-4">
		<h3 class="text-[13px] font-bold">author_url</h3>
		<p class="text-[13px] leading-relaxed">
			Makes the author name in the navigation bar a clickable link.
		</p>
		<LiveBlock initialCode="author_url: https://example.com/researcher-profile">
			{#snippet preview(data: Data)}
				<div class="flex items-center gap-1.5 text-[11px] text-gray-500">
					Created by
					{#if data?.author_url}
						<a
							href={data.author_url as string}
							class="font-bold text-eco-blue underline"
							target="_blank"
							rel="noopener noreferrer">Dr. Example</a
						>
					{:else}
						<strong class="font-bold">Dr. Example</strong>
					{/if}
				</div>
			{/snippet}
		</LiveBlock>
	</section>

	<!-- situation -->
	<section class="flex flex-col gap-4">
		<h3 class="text-[13px] font-bold">situation</h3>
		<p class="text-[13px] leading-relaxed">
			The prose shown under "The Situation" heading. Overrides the scenario's
			<code>Description</code> field. Supports <strong>bold</strong> (<code>**text**</code>) and
			<em>italic</em> (<code>*text*</code>) markdown. Use <code>|</code> for multi-line text.
		</p>
		<LiveBlock
			initialCode={`situation: |
  A former copper mine has left behind **toxic tailings**
  that are contaminating the surrounding soil and waterways.

  Your task is to use *phytoremediation* techniques to
  restore the ecosystem.`}
		>
			{#snippet preview(data: Data)}
				<h2 class="mb-4 text-[13px] font-bold">The Situation</h2>
				{#if data?.situation}
					<ProseBlock text={data.situation as string} />
				{:else}
					<p class="text-[13px] text-gray-400">No situation text</p>
				{/if}
			{/snippet}
		</LiveBlock>
	</section>

	<!-- gameplay_summary -->
	<section class="flex flex-col gap-4">
		<h3 class="text-[13px] font-bold">gameplay_summary</h3>
		<p class="text-[13px] leading-relaxed">
			A short paragraph shown below the scenario panel. Supports HTML for emphasis. If omitted, an
			auto-generated summary of rounds, actions and credits is shown.
		</p>
		<LiveBlock
			initialCode={`gameplay_summary: |
  You have <strong>12 rounds</strong> to rehabilitate
  the mine site while keeping your budget above 2,000.`}
		>
			{#snippet preview(data: Data)}
				{#if data?.gameplay_summary}
					<p class="max-w-[400px] text-[13px] leading-relaxed [&>strong]:font-bold">
						{@html data.gameplay_summary as string}
					</p>
				{:else}
					<p class="text-[13px] text-gray-400">Auto-generated from scenario data</p>
				{/if}
			{/snippet}
		</LiveBlock>
	</section>

	<!-- play -->
	<section class="flex flex-col gap-4">
		<h3 class="text-[13px] font-bold">play</h3>
		<p class="text-[13px] leading-relaxed">
			Replaces the default <strong>Copy Scenario</strong> + <strong>Launch Player</strong> flow with a
			single button that links to a hosted version of the game. Useful when your scenario is already
			running on a public URL and players don't need to load it manually. The optional
			<code>label</code> overrides the button text (defaults to <code>"Play Scenario"</code>).
		</p>
		<LiveBlock
			initialCode={`play:
  url: https://example.com/play/grasslands
  label: Play on EcoKnow Live`}
		>
			{#snippet preview(data: Data)}
				{@const play = data?.play as AnyRecord | undefined}
				{#if play?.url}
					<a
						href={play.url as string}
						target="_blank"
						rel="noopener noreferrer"
						class="flex w-fit items-center gap-3 rounded-panel bg-eco-blue px-2.5 py-1.5 font-[Inter,Albert_Sans,sans-serif] text-[10px] font-bold text-eco-white no-underline transition-all active:scale-95 hover:brightness-110"
					>
						<span>{(play.label as string | undefined) ?? 'Play Scenario'}</span>
						<Play size={16} />
					</a>
				{:else}
					<p class="text-[13px] text-gray-400">Default copy-and-launch flow</p>
				{/if}
			{/snippet}
		</LiveBlock>
	</section>

	<!-- info_card -->
	<section class="flex flex-col gap-4">
		<h3 class="text-[13px] font-bold">info_card</h3>
		<p class="text-[13px] leading-relaxed">
			A highlighted card with background context. Great for explaining a key concept. The optional
			<code>image</code> field references a file in the scenario folder.
		</p>
		<LiveBlock
			initialCode={`info_card:
  title: What are "Mine Tailings"?
  image: your-image.jpg
  body: |
    The toxic waste material left over after the
    valuable metals have been extracted.

    In this case, from extracting Copper Ore.`}
		>
			{#snippet preview(data: Data)}
				{@const card = data?.info_card as AnyRecord | undefined}
				{#if card?.title}
					<div
						class="flex w-full items-center overflow-hidden rounded-panel border-2 border-eco-mid-blue bg-white"
					>
						<div class="flex flex-1 flex-col gap-3 p-4">
							<h3 class="text-[13px] font-bold">{card.title}</h3>
							<div class="text-[13px] leading-relaxed">
								{#each ((card.body as string) ?? '').split('\n\n').filter((p: string) => p.trim()) as paragraph}
									<p class="mb-2 last:mb-0">{paragraph}</p>
								{/each}
							</div>
						</div>
						{#if card.image}
							<div
								class="flex w-[181px] shrink-0 items-center justify-center self-stretch border-l-2 border-eco-mid-blue bg-gray-100 text-[11px] text-gray-400"
							>
								{card.image}
							</div>
						{/if}
					</div>
				{:else}
					<p class="text-[13px] text-gray-400">No info card</p>
				{/if}
			{/snippet}
		</LiveBlock>
	</section>

	<!-- actions_intro -->
	<section class="flex flex-col gap-4">
		<h3 class="text-[13px] font-bold">actions_intro</h3>
		<p class="text-[13px] leading-relaxed">
			Introductory text shown before the entity cards. Supports markdown. A sensible default is
			provided if omitted.
		</p>
		<LiveBlock
			initialCode={`actions_intro: |
  You can **introduce** species into zones or
  **harvest** them to manage populations.`}
		>
			{#snippet preview(data: Data)}
				{#if data?.actions_intro}
					<ProseBlock text={data.actions_intro as string} />
				{:else}
					<p class="text-[13px] text-gray-400">Default intro text</p>
				{/if}
			{/snippet}
		</LiveBlock>
	</section>

	<!-- entity_descriptions -->
	<section class="flex flex-col gap-4">
		<h3 class="text-[13px] font-bold">entity_descriptions</h3>
		<p class="text-[13px] leading-relaxed">
			Descriptions shown on each entity card. Keys must match the entity <code>ID</code> from your
			scenario JSON exactly. Supports markdown. Without this, entity cards show with no description
			text.
		</p>
		{#key scenarioKey}
			<LiveBlock initialCode={entityDescCode}>
				{#snippet preview(data: Data)}
					{@const descs = data?.entity_descriptions as AnyRecord | undefined}
					{#if descs && Object.keys(descs).length > 0}
						<h2 class="mb-4 text-[13px] font-bold">Introduce These</h2>
						<div class="flex w-full flex-wrap gap-4">
							{#each Object.entries(descs) as [id, desc]}
								{@const ent = entityMap[id]}
								<div class="flex min-w-[80px] flex-1 flex-col items-center gap-2.5">
									<HexIcon
										iconUrl={resolveGuideIcon(ent?.icon ?? '')}
										color={ent?.color ?? '#ccc'}
									/>
									<h4 class="text-xs font-semibold">{ent?.name ?? humanizeId(id)}</h4>
									<p class="self-start text-[10px] leading-relaxed">
										{@html parseMarkdown(desc as string)}
									</p>
								</div>
							{/each}
						</div>
					{:else}
						<p class="text-[13px] text-gray-400">No entity descriptions</p>
					{/if}
				{/snippet}
			</LiveBlock>
		{/key}
		<p class="text-[11px] leading-relaxed text-gray-500">
			Tip: Open your <code>scenario.json</code> and look at
			<code>Scenario.Entities[].ID</code> to find the exact IDs to use as keys.
		</p>
	</section>

	<!-- objectives -->
	<section class="flex flex-col gap-4">
		<h3 class="text-[13px] font-bold">objectives</h3>
		<p class="text-[13px] leading-relaxed">
			Override the auto-generated objectives. If omitted, objectives are built from the scenario's
			<code>WinConditions</code> with their icons, thresholds and round requirements. Each objective
			can reference an <code>entity</code> (by ID) to inherit its icon, or specify a custom
			<code>icon</code>.
		</p>
		{#key scenarioKey}
			<LiveBlock initialCode={objectivesCode}>
				{#snippet preview(data: Data)}
					{@const objectives = data?.objectives as AnyList | undefined}
					{#if objectives && objectives.length > 0}
						<h2 class="mb-4 text-[13px] font-bold">To Meet Objectives</h2>
						<div class="flex w-full flex-col gap-5">
							{#each objectives as obj}
								{@const o = obj as AnyRecord}
								{@const entityId = o.entity as string | undefined}
								{@const iconName = o.icon as string | undefined}
								{@const ent = entityId ? entityMap[entityId] : undefined}
								{@const isCurrency = iconName === 'currency'}
								{@const iconUrl = isCurrency
									? ''
									: entityId && ent
										? resolveGuideIcon(ent.icon)
										: iconName
											? resolveGuideIcon(`Icons/${iconName}`)
											: ''}
								<div
									class="flex w-full items-center gap-4 rounded-panel border-2 border-eco-light-blue p-4"
								>
									<div class="shrink-0">
										{#if isCurrency}
											<div
												class="flex size-[60px] items-center justify-center rounded-panel bg-eco-lightest-blue"
											>
												<CurrencyIcon />
											</div>
										{:else if iconUrl}
											<HexIcon
												{iconUrl}
												color={ent?.color ?? 'var(--color-eco-lightest-blue)'}
											/>
										{:else}
											<div
												class="flex size-[60px] items-center justify-center rounded-panel bg-eco-lightest-blue"
											></div>
										{/if}
									</div>
									<div class="flex min-w-0 flex-1 flex-col gap-2">
										<h4 class="text-xs font-bold">{o.title ?? ''}</h4>
										<p class="text-[10px] leading-relaxed">{o.description ?? ''}</p>
										<p class="text-[10px] font-bold text-eco-mid-blue">{o.goal ?? ''}</p>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<p class="text-[13px] text-gray-400">Auto-generated from Win Conditions</p>
					{/if}
				{/snippet}
			</LiveBlock>
		{/key}
	</section>

	<!-- watch_out -->
	<section class="flex flex-col gap-4">
		<h3 class="text-[13px] font-bold">watch_out</h3>
		<p class="text-[13px] leading-relaxed">
			Highlighted warnings shown in the "Watch Out For" section. Each item can reference an
			<code>entity</code>
			(inherits icon and name), a custom <code>icon</code>, or both a custom <code>icon</code> and
			<code>name</code>.
		</p>
		{#key scenarioKey}
			<LiveBlock initialCode={watchOutCode}>
				{#snippet preview(data: Data)}
					{@const items = data?.watch_out as AnyList | undefined}
					{#if items && items.length > 0}
						<h2 class="mb-4 text-[13px] font-bold">Watch Out For</h2>
						<div
							class="flex w-full gap-4 rounded-panel border-2 border-eco-lightest-blue p-4"
						>
							{#each items as item}
								{@const w = item as AnyRecord}
								{@const entityId = w.entity as string | undefined}
								{@const iconName = w.icon as string | undefined}
								{@const ent = entityId ? entityMap[entityId] : undefined}
								{@const isCurrency = iconName === 'currency'}
								{@const iconUrl = isCurrency
									? ''
									: entityId && ent
										? resolveGuideIcon(ent.icon)
										: iconName
											? resolveGuideIcon(`Icons/${iconName}`)
											: ''}
								{@const displayName =
									(w.name as string) ?? ent?.name ?? (entityId ? humanizeId(entityId) : '')}
								<div class="flex flex-1 flex-col gap-2.5">
									{#if isCurrency}
										<div
											class="flex size-[60px] items-center justify-center rounded-panel bg-eco-lightest-blue"
										>
											<CurrencyIcon />
										</div>
									{:else if iconUrl}
										<HexIcon
											{iconUrl}
											color={ent?.color ?? 'var(--color-eco-lightest-blue)'}
										/>
									{/if}
									<h4 class="text-xs font-semibold">{displayName}</h4>
									<p class="text-[10px] leading-relaxed">{w.description ?? ''}</p>
								</div>
							{/each}
						</div>
					{:else}
						<p class="text-[13px] text-gray-400">No watch out items</p>
					{/if}
				{/snippet}
			</LiveBlock>
		{/key}
	</section>

	<!-- why_this_matters -->
	<section class="flex flex-col gap-4">
		<h3 class="text-[13px] font-bold">why_this_matters</h3>
		<p class="text-[13px] leading-relaxed">
			Educational context shown under "Why This Matters". This is where you connect the scenario to
			real-world science, ecology or current events. Supports markdown.
		</p>
		<LiveBlock
			initialCode={`why_this_matters: |
  This scenario is based on real environmental
  challenges faced by communities near mining
  operations in the Philippines.

  **Your decisions mirror the choices real
  stakeholders must make when balancing
  environmental restoration with limited budgets.**`}
		>
			{#snippet preview(data: Data)}
				{#if data?.why_this_matters}
					<h2 class="mb-4 text-[13px] font-bold">Why This Matters</h2>
					<ProseBlock text={data.why_this_matters as string} />
				{:else}
					<p class="text-[13px] text-gray-400">No "Why This Matters" section</p>
				{/if}
			{/snippet}
		</LiveBlock>
	</section>

	<!-- further_reading -->
	<section class="flex flex-col gap-4">
		<h3 class="text-[13px] font-bold">further_reading</h3>
		<p class="text-[13px] leading-relaxed">
			A list of external links shown as cards under "Further Reading".
		</p>
		<LiveBlock
			initialCode={`further_reading:
  - title: Phytoremediation
    description: How plants are used to remove pollutants from contaminated soil, water, and air.
    url: https://en.wikipedia.org/wiki/Phytoremediation
  - title: Lotka-Volterra Equations
    description: The mathematical models behind the population dynamics in EcoKnow.
    url: https://en.wikipedia.org/wiki/Lotka-Volterra_equations`}
		>
			{#snippet preview(data: Data)}
				{@const links = data?.further_reading as AnyList | undefined}
				{#if links && links.length > 0}
					<h2 class="mb-4 text-[13px] font-bold">Further Reading</h2>
					<div class="flex w-full flex-col gap-5">
						{#each links as link}
							{@const l = link as AnyRecord}
							<ReadingLink
								title={(l.title as string) ?? ''}
								description={(l.description as string) ?? ''}
								url={(l.url as string) ?? '#'}
							/>
						{/each}
					</div>
				{:else}
					<p class="text-[13px] text-gray-400">No further reading links</p>
				{/if}
			{/snippet}
		</LiveBlock>
	</section>

	<!-- Full Example -->
	<section class="flex flex-col gap-4">
		<h2 class="text-base font-bold">Full example</h2>
		<p class="text-[13px] leading-relaxed">
			Here's a complete <code>briefing.yaml</code> showing all fields together. Remember, every field
			is optional &mdash; start with just <code>entity_descriptions</code> and add more as needed.
		</p>
		<div class="relative overflow-x-auto rounded-panel bg-gray-50 p-4">
			<button
				class="absolute right-3 top-3 cursor-pointer rounded border-none bg-transparent p-1 text-gray-400 transition-colors hover:text-gray-600"
				title="Copy to clipboard"
				onclick={() => {
					const code = document.getElementById('full-example')?.textContent ?? '';
					navigator.clipboard.writeText(code);
					fullExampleCopied = true;
					setTimeout(() => (fullExampleCopied = false), 2000);
				}}
			>
				{#if fullExampleCopied}
					<Check size={16} />
				{:else}
					<Copy size={16} />
				{/if}
			</button>
			<pre class="text-xs leading-relaxed"><code id="full-example"
					>author_url: https://example.com/profile

situation: |
  A former copper mine has left behind **toxic tailings**
  that are contaminating the surrounding soil and waterways.

gameplay_summary: |
  You have &lt;strong&gt;12 rounds&lt;/strong&gt; to rehabilitate
  the mine site while keeping your budget healthy.

play:
  url: https://example.com/play/copper-tailings
  label: Play on EcoKnow Live

info_card:
  title: What are "Mine Tailings"?
  body: |
    The toxic waste material left over after the
    valuable metals have been extracted.

actions_intro: |
  You can **introduce** species into zones or
  **harvest** them to manage populations.

entity_descriptions:
  VetiverGrass: |
    Vetiver grass tolerates heavy metals and
    stabilises soil to prevent erosion.
  Fish: |
    Fish help filter heavy metals from water.

objectives:
  - title: Healthy Waters
    entity: Fish
    description: Ensure fish populations recover.
    goal: Keep Fish above 400 for 3 rounds

watch_out:
  - entity: HeavyMetal
    description: The toxic run off you need to clean up.
  - icon: currency
    name: Overspending
    description: Don't spend too much too early.

why_this_matters: |
  This scenario is based on real environmental challenges
  faced by communities near mining operations.

further_reading:
  - title: Phytoremediation
    description: How plants remove pollutants from soil.
    url: https://en.wikipedia.org/wiki/Phytoremediation</code
				></pre>
		</div>
	</section>

</div>

<!-- Sticky entity panel -->
{#if scenarioEntities.length > 0}
	<div class="fixed bottom-0 left-0 right-0 z-50 flex flex-col border-t border-gray-200 bg-white shadow-lg transition-transform {entityPanelOpen ? 'translate-y-0' : 'translate-y-[calc(100%-36px)]'}">
		<button
			class="flex w-full cursor-pointer items-center gap-2 border-none bg-transparent px-4 py-2 text-left"
			onclick={() => (entityPanelOpen = !entityPanelOpen)}
		>
			{#if entityPanelOpen}
				<ChevronDown size={14} class="text-gray-400" />
			{:else}
				<ChevronUp size={14} class="text-gray-400" />
			{/if}
			<span class="text-[11px] font-bold text-gray-400">Entities: {scenarioName}</span>
		</button>
		{#if entityPanelOpen}
			<div class="flex flex-wrap gap-1.5 px-4 pb-3">
				{#each scenarioEntities as ent}
					<button
						class="flex cursor-pointer items-center gap-1 rounded border-none bg-gray-100 px-2 py-1 font-mono text-[11px] text-gray-600 transition-colors hover:bg-eco-lightest-blue hover:text-eco-blue active:bg-eco-light-blue"
						onclick={() => {
							navigator.clipboard.writeText(ent.id);
							copiedEntityId = ent.id;
							setTimeout(() => { if (copiedEntityId === ent.id) copiedEntityId = ''; }, 2000);
						}}
					>
						{ent.id}
						{#if copiedEntityId === ent.id}
							<Check size={12} />
						{:else}
							<Copy size={12} class="opacity-30" />
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>
{/if}
