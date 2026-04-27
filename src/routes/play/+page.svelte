<script lang="ts">
	import { Play, DiamondPlus, BookOpen } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import SiteNav from '$lib/components/SiteNav.svelte';

	let { data } = $props();
	const scenarios = $derived(data.scenarios);
</script>

<svelte:head>
	<title>EcoKnow Scenario Briefings</title>
</svelte:head>

<SiteNav />

<div class="flex min-h-screen flex-col items-center gap-10 px-4 py-15">
	<div class="flex w-full max-w-[800px] items-center gap-3">
		<Play size={32} />
		<h1 class="text-2xl font-bold">Play Scenarios</h1>
	</div>

	<div class="flex w-full max-w-[800px] flex-wrap gap-5">
		{#each scenarios as scenario (scenario.slug)}
			<div class="flex w-full sm:w-[calc(33.333%-14px)] flex-col overflow-hidden rounded-panel border-2 border-gray-200">
				{#if scenario.coverImage}
					<img
						src={scenario.coverImage}
						alt={scenario.name}
						class="aspect-[440/300] w-full object-cover"
					/>
				{:else}
					<div class="flex aspect-[440/300] items-center justify-center bg-gray-100 text-[13px] text-gray-400">
						No cover
					</div>
				{/if}
				<div class="flex flex-1 flex-col gap-3 p-4">
					<h3 class="text-[13px] font-bold">{scenario.name}</h3>
					<p class="flex-1 text-[11px] leading-relaxed text-gray-500">{scenario.description}</p>
					{#if scenario.author}
						<p class="text-[10px] text-gray-400">by {scenario.author}</p>
					{/if}
					<a
						href={resolve(`/play/${scenario.slug}`)}
						class="flex items-center justify-center gap-1.5 rounded-panel bg-eco-dark px-3 py-2 text-[11px] font-semibold text-white no-underline transition-opacity hover:opacity-90"
					>
		<BookOpen size={14} />
		Read Brief
					</a>
				</div>
			</div>
		{/each}

			<!-- Add your scenario -->
			<a
				href={resolve('/guide')}
				class="flex w-full sm:w-[calc(33.333%-14px)] flex-col items-center justify-center gap-3 rounded-panel border-2 border-dashed border-gray-300 p-6 text-center no-underline transition-colors hover:border-eco-light-blue hover:bg-gray-50"
			>
				<DiamondPlus size={32} class="text-gray-300" />
				<h3 class="text-[13px] font-bold text-gray-400">Add your scenario here!</h3>
				<p class="text-[11px] leading-relaxed text-gray-400">
					Learn how to create and publish your own scenario briefing.
				</p>
			</a>
	</div>
</div>
