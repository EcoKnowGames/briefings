<script lang="ts">
	import { GitBranch, ExternalLink, Wrench } from '@lucide/svelte';
	import { asset } from '$app/paths';
	import SiteNav from '$lib/components/SiteNav.svelte';
</script>

<svelte:head>
	<title>Tools - EcoKnow Creator</title>
</svelte:head>

<SiteNav />

<div class="flex min-h-screen flex-col items-center gap-10 px-4 py-15">
	<div class="flex w-full max-w-[800px] flex-col gap-3">
		<div class="flex items-center gap-3">
			<Wrench size={32} />
			<h1 class="text-2xl font-bold">Tools</h1>
		</div>
		<p class="max-w-[600px] text-[13px] leading-relaxed text-gray-500">
			If you're planning to build Scenarios with EcoKnow Creator, you'll need a few helpful tools
			to get started.
		</p>
	</div>

	<div class="flex w-full max-w-[800px] flex-col gap-5 sm:flex-row">
		<!-- Simulate Matrices -->
		<div class="flex flex-1 flex-col overflow-hidden rounded-panel border-2 border-gray-200">
			<img src={asset('/tools/simulate-matrices.png')} alt="Simulate Matrices" class="aspect-[440/300] w-full object-cover" />
			<div class="flex flex-1 flex-col gap-3 p-4">
				<h3 class="text-[13px] font-bold">Simulate Matrices</h3>
				<p class="flex-1 text-[11px] leading-relaxed text-gray-500">
					Build and test Matrices for Creator.
				</p>
				<div class="flex flex-col gap-2">
					<a
						href="https://github.com/EcoKnowGames/simulate"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center justify-center gap-1.5 rounded-panel border-2 border-gray-200 px-3 py-2 text-[11px] font-semibold text-black no-underline transition-colors hover:bg-gray-50"
					>
						<GitBranch size={14} />
						GitHub
					</a>
					<a
						href="https://ecoknowgames.github.io/simulate/"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center justify-center gap-1.5 rounded-panel bg-eco-dark px-3 py-2 text-[11px] font-semibold text-white no-underline transition-opacity hover:opacity-90"
					>
						<ExternalLink size={14} />
						Launch
					</a>
				</div>
			</div>
		</div>

		<!-- Map Editor -->
		<div class="flex flex-1 flex-col overflow-hidden rounded-panel border-2 border-gray-200">
			<img src={asset('/tools/map-editor.png')} alt="Map Editor" class="aspect-[440/300] w-full object-cover" />
			<div class="flex flex-1 flex-col gap-3 p-4">
				<h3 class="text-[13px] font-bold">Map Editor</h3>
				<p class="flex-1 text-[11px] leading-relaxed text-gray-500">
					Layout, Zone and Populate maps for Creator.
				</p>
				<div class="flex flex-col gap-2">
					<a
						href="https://github.com/EcoKnowGames/map"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center justify-center gap-1.5 rounded-panel border-2 border-gray-200 px-3 py-2 text-[11px] font-semibold text-black no-underline transition-colors hover:bg-gray-50"
					>
						<GitBranch size={14} />
						GitHub
					</a>
					<a
						href="https://ecoknowgames.github.io/map/"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center justify-center gap-1.5 rounded-panel bg-eco-dark px-3 py-2 text-[11px] font-semibold text-white no-underline transition-opacity hover:opacity-90"
					>
						<ExternalLink size={14} />
						Launch
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
