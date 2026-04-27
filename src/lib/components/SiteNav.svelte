<script lang="ts">
	import { Home, ExternalLink, Wrench, Play, Menu, X } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';

	let open = $state(false);
</script>

<nav class="sticky top-0 z-50 flex w-full items-center justify-between bg-eco-dark px-4 py-4">
	<a
		href={resolve('/')}
		class="flex items-center gap-2 font-[Inter,Albert_Sans,sans-serif] text-[14px] text-white no-underline transition-opacity hover:opacity-80"
	>
		<img src={favicon} alt="" aria-hidden="true" class="h-5 w-5" />
		EcoKnow Creator
	</a>

	<!-- Desktop links -->
	<div class="hidden items-center gap-5 sm:flex">
		<a
			href={resolve('/')}
			class="flex items-center gap-1.5 font-[Inter,Albert_Sans,sans-serif] text-[10px] font-bold text-eco-green no-underline transition-opacity hover:opacity-80"
		>
			<Home size={14} />
			EcoKnow Creator
		</a>
		<a
			href="https://ecoknowgames.github.io/"
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-1.5 font-[Inter,Albert_Sans,sans-serif] text-[10px] font-bold text-eco-green no-underline transition-opacity hover:opacity-80"
		>
			<ExternalLink size={14} />
			EcoKnow Project Site
		</a>
		<a
			href={resolve('/tools')}
			class="flex items-center gap-1.5 font-[Inter,Albert_Sans,sans-serif] text-[10px] font-bold text-eco-green no-underline transition-opacity hover:opacity-80"
		>
			<Wrench size={14} />
			Tools
		</a>
		<a
			href={resolve('/play')}
			class="flex items-center gap-1.5 rounded-panel border-2 border-eco-green px-2.5 py-1 font-[Inter,Albert_Sans,sans-serif] text-[10px] font-bold text-eco-green no-underline transition-opacity hover:opacity-80"
		>
			<Play size={14} />
			Play Scenarios
		</a>
	</div>

	<!-- Mobile hamburger button -->
	<button
		class="cursor-pointer border-none bg-transparent p-0 text-eco-green sm:hidden"
		onclick={() => (open = !open)}
		aria-label="Toggle menu"
	>
		{#if open}
			<X size={20} />
		{:else}
			<Menu size={20} />
		{/if}
	</button>
</nav>

<!-- Mobile menu -->
{#if open}
	<div class="flex flex-col gap-1 bg-eco-dark px-4 pb-4 sm:hidden">
		<a
			href={resolve('/')}
			class="flex items-center gap-2 rounded-panel px-3 py-2.5 font-[Inter,Albert_Sans,sans-serif] text-[11px] font-bold text-eco-green no-underline transition-colors hover:bg-white/5"
			onclick={() => (open = false)}
		>
			<Home size={14} />
			EcoKnow Creator
		</a>
		<a
			href="https://ecoknowgames.github.io/"
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center gap-2 rounded-panel px-3 py-2.5 font-[Inter,Albert_Sans,sans-serif] text-[11px] font-bold text-eco-green no-underline transition-colors hover:bg-white/5"
			onclick={() => (open = false)}
		>
			<ExternalLink size={14} />
			EcoKnow Project Site
		</a>
		<a
			href={resolve('/tools')}
			class="flex items-center gap-2 rounded-panel px-3 py-2.5 font-[Inter,Albert_Sans,sans-serif] text-[11px] font-bold text-eco-green no-underline transition-colors hover:bg-white/5"
			onclick={() => (open = false)}
		>
			<Wrench size={14} />
			Tools
		</a>
		<a
			href={resolve('/play')}
			class="flex items-center gap-2 rounded-panel border-2 border-eco-green px-3 py-2.5 font-[Inter,Albert_Sans,sans-serif] text-[11px] font-bold text-eco-green no-underline transition-colors hover:bg-white/5"
			onclick={() => (open = false)}
		>
			<Play size={14} />
			Play Scenarios
		</a>
	</div>
{/if}
