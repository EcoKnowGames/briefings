<script lang="ts">
	import { GitBranch, Play, ExternalLink, FileText, Target, MessageCircle } from '@lucide/svelte';
	import { resolve, asset } from '$app/paths';
	import SiteNav from '$lib/components/SiteNav.svelte';
</script>

<svelte:head>
	<title>EcoKnow Creator</title>
</svelte:head>

<SiteNav />

<div class="flex min-h-screen flex-col items-center gap-10 px-4 py-15">
	<div class="flex w-full max-w-[800px] flex-col gap-3">
		<h1 class="text-2xl font-bold">EcoKnow Creator</h1>
		<p class="max-w-[600px] text-[13px] leading-relaxed text-gray-500">
			Welcome to EcoKnow Creator. This site is designed to guide you through how to contribute to
			EcoKnow Creator (Creator) through various guides, tools and community generated environmental
			scenarios.
		</p>
	</div>

	<!-- Hero card: Creator -->
	<div class="flex w-full max-w-[800px] flex-col overflow-hidden rounded-panel border-2 border-gray-200 sm:flex-row">
		<img src={asset('/tools/eco-know-creator.png')} alt="EcoKnow Creator" class="aspect-[440/300] w-full object-cover sm:aspect-auto sm:w-[240px] sm:shrink-0" />
		<div class="flex flex-1 flex-col gap-4 p-6">
			<h2 class="text-lg font-bold">Creator</h2>
			<p class="text-[13px] leading-relaxed text-gray-500">
				Play and Build Scenarios. Export session data.
			</p>
			<p class="text-[13px] leading-relaxed text-gray-500">
				Before you start, check out the Scenario Briefings.
			</p>
			<div class="flex items-center gap-3">
				<a
					href="https://github.com/EcoKnowGames/creator"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-1.5 rounded-panel border-2 border-gray-200 px-3 py-2 text-[11px] font-semibold text-black no-underline transition-colors hover:bg-gray-50"
				>
					<GitBranch size={14} />
					GitHub
				</a>
				<a
					href={resolve('/play')}
					class="flex items-center gap-1.5 rounded-panel bg-eco-dark px-3 py-2 text-[11px] font-semibold text-white no-underline transition-opacity hover:opacity-90"
				>
					<Play size={14} />
					Play Scenarios
				</a>
			</div>
		</div>
	</div>

	<!-- Three cards -->
	<div class="flex w-full max-w-[800px] flex-col gap-5 sm:flex-row">
		<!-- How To Guide -->
		<div class="flex flex-1 flex-col overflow-hidden rounded-panel border-2 border-gray-200">
			<img src={asset('/tools/how-to-guide.png')} alt="How To Guide" class="aspect-[440/300] w-full object-cover" />
			<div class="flex flex-1 flex-col gap-3 p-4">
				<h3 class="text-[13px] font-bold">How To Guide</h3>
				<p class="flex-1 text-[11px] leading-relaxed text-gray-500">
					Brad walks through building your first Scenario from scratch with EcoKnow Creator.
				</p>
				<a
					href="https://ecoknowgames.github.io/how_to.html"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center justify-center gap-1.5 rounded-panel bg-eco-dark px-3 py-2 text-[11px] font-semibold text-white no-underline transition-opacity hover:opacity-90"
				>
					<ExternalLink size={14} />
					Launch
				</a>
			</div>
		</div>

		<!-- Contribute.md -->
		<div class="flex flex-1 flex-col overflow-hidden rounded-panel border-2 border-gray-200">
			<img src={asset('/tools/contributing.png')} alt="Contributing" class="aspect-[440/300] w-full object-cover" />
			<div class="flex flex-1 flex-col gap-3 p-4">
				<h3 class="text-[13px] font-bold">Contribute.md</h3>
				<p class="flex-1 text-[11px] leading-relaxed text-gray-500">
					Learn how to get involved with source code contributions with the EcoKnow Creator contribution.md
				</p>
				<a
					href="https://github.com/EcoKnowGames/creator/blob/main/CONTRIBUTING.md"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center justify-center gap-1.5 rounded-panel bg-eco-dark px-3 py-2 text-[11px] font-semibold text-white no-underline transition-opacity hover:opacity-90"
				>
					<ExternalLink size={14} />
					Launch
				</a>
			</div>
		</div>

		<!-- Scenario Briefings -->
		<div class="flex flex-1 flex-col overflow-hidden rounded-panel border-2 border-gray-200">
			<img src={asset('/tools/briefings.png')} alt="Scenario Briefings" class="aspect-[440/300] w-full object-cover" />
			<div class="flex flex-1 flex-col gap-3 p-4">
				<h3 class="text-[13px] font-bold">Scenario Briefings</h3>
				<p class="flex-1 text-[11px] leading-relaxed text-gray-500">
					The source of this website and a neat way to distribute Scenarios through briefings.
				</p>
				<div class="flex flex-col gap-2">
					<a
						href="https://github.com/EcoKnowGames/briefings"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center justify-center gap-1.5 rounded-panel border-2 border-gray-200 px-3 py-2 text-[11px] font-semibold text-black no-underline transition-colors hover:bg-gray-50"
					>
						<GitBranch size={14} />
						GitHub
					</a>
					<a
						href={resolve('/play')}
						class="flex items-center justify-center gap-1.5 rounded-panel bg-eco-dark px-3 py-2 text-[11px] font-semibold text-white no-underline transition-opacity hover:opacity-90"
					>
						<Play size={14} />
						Play Scenarios
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Additional links -->
	<div class="flex w-full max-w-[800px] flex-col gap-5 border-t-2 border-gray-100 pt-10 sm:flex-row">
		<a
			href={resolve('/mission')}
			class="flex flex-1 items-center gap-3 rounded-panel border-2 border-gray-200 p-5 text-black no-underline transition-colors hover:bg-gray-50"
		>
			<Target size={20} class="shrink-0 text-gray-400" />
			<div class="flex flex-col gap-1">
				<h3 class="text-[13px] font-bold">Our Mission</h3>
				<p class="text-[11px] leading-relaxed text-gray-500">Why we're building this.</p>
			</div>
		</a>
		<a
			href={resolve('/guide')}
			class="flex flex-1 items-center gap-3 rounded-panel border-2 border-gray-200 p-5 text-black no-underline transition-colors hover:bg-gray-50"
		>
			<FileText size={20} class="shrink-0 text-gray-400" />
			<div class="flex flex-col gap-1">
				<h3 class="text-[13px] font-bold">Briefing Docs</h3>
				<p class="text-[11px] leading-relaxed text-gray-500">How to add your own scenario.</p>
			</div>
		</a>
		<a
			href="https://github.com/orgs/EcoKnowGames/discussions"
			target="_blank"
			rel="noopener noreferrer"
			class="flex flex-1 items-center gap-3 rounded-panel border-2 border-gray-200 p-5 text-black no-underline transition-colors hover:bg-gray-50"
		>
			<MessageCircle size={20} class="shrink-0 text-gray-400" />
			<div class="flex flex-col gap-1">
				<h3 class="text-[13px] font-bold">Discussions</h3>
				<p class="text-[11px] leading-relaxed text-gray-500">Join the conversation on GitHub.</p>
			</div>
		</a>
	</div>
</div>
