<script lang="ts">
	import { asset } from '$app/paths';
	import SiteNav from '$lib/components/SiteNav.svelte';
	import BriefingHeader from '$lib/components/BriefingHeader.svelte';
	import CoverImage from '$lib/components/CoverImage.svelte';
	import ScenarioPanel from '$lib/components/ScenarioPanel.svelte';
	import InfoCard from '$lib/components/InfoCard.svelte';
	import EntityCard from '$lib/components/EntityCard.svelte';
	import ZoneCard from '$lib/components/ZoneCard.svelte';
	import ObjectiveCard from '$lib/components/ObjectiveCard.svelte';
	import ReadingLink from '$lib/components/ReadingLink.svelte';
	import ProseBlock from '$lib/components/ProseBlock.svelte';
	import CurrencyIcon from '$lib/components/CurrencyIcon.svelte';
	import HexIcon from '$lib/components/HexIcon.svelte';
	import ZoneMap from '$lib/components/ZoneMap.svelte';

	let { data } = $props();
	const b = data.briefing;
	const allEntities = [...b.introduceEntities, ...b.observeEntities];
</script>

<svelte:head>
	<title>{b.name} - EcoKnow Briefing</title>
	<meta name="description" content={b.situation.slice(0, 160)} />
</svelte:head>

<SiteNav />

<div class="relative flex min-h-screen w-full flex-col items-center overflow-clip bg-white">
	<div class="flex w-full max-w-[472px] flex-col items-center gap-12 px-4 pb-12">
		<BriefingHeader tag={b.tag} title={b.name} appVersion={b.appVersion} author={b.author} authorUrl={b.authorUrl} />

		{#if b.coverImage}
			<CoverImage coverImage={b.coverImage} />
		{/if}

		{#if b.situation}
			<!-- The Situation -->
			<section class="flex w-full max-w-[400px] flex-col gap-5">
				<h2 class="w-full text-[13px] font-bold">The Situation</h2>
				<ProseBlock text={b.situation} />
			</section>
		{/if}

		<ScenarioPanel
			rounds={b.rounds}
			actions={b.actions}
			credits={b.credits}
			scenarioJsonUrl={data.scenarioJsonUrl}
			playerUrl="https://ecoknowgames.github.io/examples/"
			externalPlay={b.play}
		/>

		<!-- Gameplay Summary -->
		<div class="w-full max-w-[400px]">
			<p class="max-w-[400px] text-[13px] leading-relaxed [&>strong]:font-bold">{@html b.gameplaySummary}</p>
		</div>

		{#if b.infoCard}
			<InfoCard title={b.infoCard.title} body={b.infoCard.body} image={b.infoCard.image} slug={b.slug} />
		{/if}

		{#if b.actionsIntro}
			<div class="w-full max-w-[400px]">
				<ProseBlock text={b.actionsIntro} />
			</div>
		{/if}

		<!-- Introduce These -->
		{#if b.introduceEntities.length > 0}
			<section class="flex w-full max-w-[440px] flex-col items-center gap-5">
				<h2 class="w-full max-w-[400px] text-[13px] font-bold">Introduce These</h2>
				<div class="flex w-full flex-wrap gap-4">
					{#each b.introduceEntities as entity}
						<EntityCard {entity} />
					{/each}
				</div>
			</section>
		{/if}

		<!-- To Different Areas -->
		{#if b.zones.length > 0}
			<section class="flex w-full max-w-[440px] flex-col items-center gap-5">
				<h2 class="w-full max-w-[400px] text-[13px] font-bold">To Different Areas</h2>
				<div class="flex w-full gap-6">
					{#each b.zones as zone}
						<ZoneCard name={zone.name} color={zone.color} />
					{/each}
				</div>
			</section>
		{/if}

		<!-- To Meet Objectives -->
		{#if b.objectives.length > 0}
			<section class="flex w-full max-w-[440px] flex-col items-center gap-5">
				<h2 class="w-full max-w-[400px] text-[13px] font-bold">To Meet Objectives</h2>
				<div class="flex w-full flex-col gap-5">
					{#each b.objectives as objective}
						<ObjectiveCard {objective} />
					{/each}
				</div>
			</section>
		{/if}

		<!-- Watch Out For -->
		{#if b.watchOut.length > 0}
			<section class="flex w-full max-w-[440px] flex-col items-center gap-5">
				<h2 class="w-full max-w-[400px] text-[13px] font-bold">Watch Out For</h2>
				<div class="flex w-full gap-4 rounded-panel border-2 border-eco-lightest-blue p-4">
					{#each b.watchOut as item}
						<div class="flex flex-1 flex-col gap-2.5">
							{#if item.iconUrl && item.iconUrl.includes('currency')}
								<div class="flex size-[60px] items-center justify-center rounded-panel bg-eco-lightest-blue">
									<CurrencyIcon />
								</div>
							{:else if item.iconUrl}
								<HexIcon iconUrl={item.iconUrl} color={item.iconBgColor ?? 'var(--color-eco-lightest-blue)'} />
							{/if}
							<h4 class="text-xs font-semibold">{item.name}</h4>
							<p class="text-[10px] leading-relaxed">{item.description}</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Why This Matters -->
		{#if b.whyThisMatters}
			<section class="flex w-full max-w-[400px] flex-col gap-5">
				<h2 class="w-full text-[13px] font-bold">Why This Matters</h2>
				<ProseBlock text={b.whyThisMatters} />
			</section>
		{/if}

		<!-- Further Reading -->
		{#if b.furtherReading.length > 0}
			<section class="flex w-full max-w-[440px] flex-col items-center gap-5">
				<h2 class="w-full max-w-[400px] text-[13px] font-bold">Further Reading</h2>
				<div class="flex w-full flex-col gap-5">
					{#each b.furtherReading as link}
						<ReadingLink title={link.title} description={link.description} url={link.url} />
					{/each}
				</div>
			</section>
		{/if}

		<!-- Collaborators -->
		<div class="flex flex-col items-center gap-5 pt-8">
			<p class="text-[13px]">A collaboration between:</p>
			<img src={asset('/collaborators.png')} alt="Collaborators" class="h-auto max-w-[350px]" />
		</div>
	</div>
</div>
