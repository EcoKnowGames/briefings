<script lang="ts">
	import { Copy, Check, Play } from '@lucide/svelte';

	let {
		rounds,
		actions,
		credits,
		scenarioJsonUrl,
		playerUrl = '#',
		externalPlay
	}: {
		rounds: number;
		actions: number;
		credits: number;
		scenarioJsonUrl: string;
		playerUrl?: string;
		externalPlay?: { url: string; label?: string };
	} = $props();

	let copied = $state(false);
	let copying = $state(false);

	async function copyScenario() {
		if (copying) return;
		copying = true;
		try {
			const res = await fetch(scenarioJsonUrl);
			const text = await res.text();
			await navigator.clipboard.writeText(text);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			try {
				const res = await fetch(scenarioJsonUrl);
				const text = await res.text();
				const textarea = document.createElement('textarea');
				textarea.value = text;
				document.body.appendChild(textarea);
				textarea.select();
				document.execCommand('copy');
				document.body.removeChild(textarea);
				copied = true;
				setTimeout(() => (copied = false), 2000);
			} catch {
				alert('Failed to copy scenario. Please try again.');
			}
		} finally {
			copying = false;
		}
	}
</script>

<div class="flex w-full max-w-[440px] overflow-hidden rounded-panel border-2 border-eco-mid-blue">
	<!-- Play Panel -->
	<div class="flex min-w-0 flex-1 flex-col gap-4 border-r-2 border-eco-mid-blue p-4">
		<h3 class="text-xs font-bold text-eco-blue">Ready to Play?</h3>
		{#if externalPlay}
			<div class="text-[10px] leading-snug">
				<p>This scenario is hosted online — click below to launch it in your browser.</p>
			</div>
			<div class="flex flex-col gap-2">
				<a
					href={externalPlay.url}
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center justify-between rounded-panel bg-eco-blue px-2.5 py-1.5 font-[Inter,Albert_Sans,sans-serif] text-[10px] font-bold text-eco-white no-underline transition-all active:scale-95 hover:brightness-110"
				>
					<span>{externalPlay.label ?? 'Play Scenario'}</span>
					<Play size={16} />
				</a>
			</div>
		{:else}
			<div class="text-[10px] leading-snug">
				<p>Copy the Scenario to your clipboard and paste it into the Player:</p>
				<p>&nbsp;</p>
				<p><strong class="font-bold">Play → Load External Scenario</strong></p>
			</div>
			<div class="flex flex-col gap-2">
				<button
					class="flex cursor-pointer items-center justify-between rounded-panel border-none bg-eco-mid-blue px-3 py-1.5 font-sans text-[10px] font-bold tracking-wide text-eco-white transition-all active:scale-95 hover:brightness-110"
					onclick={copyScenario}
				>
					<span>{copied ? 'Copied!' : copying ? 'Copying...' : 'Copy Scenario to Clipboard'}</span>
					{#if copied}
						<Check size={16} />
					{:else}
						<Copy size={16} />
					{/if}
				</button>
				<a
					href={playerUrl}
					class="flex items-center justify-between rounded-panel bg-eco-blue px-2.5 py-1.5 font-[Inter,Albert_Sans,sans-serif] text-[10px] font-bold text-eco-white no-underline transition-all active:scale-95 hover:brightness-110"
				>
					<span>Launch Scenario Player</span>
					<Play size={16} />
				</a>
			</div>
		{/if}
	</div>

	<!-- Data Panel -->
	<div class="flex min-w-[140px] flex-col justify-center bg-eco-lightest-blue px-4">
		<div class="flex items-center gap-2 p-2.5">
			<span class="text-xl font-bold text-eco-blue">{rounds}</span>
			<span class="text-[13px] text-eco-blue">Rounds</span>
		</div>
		<div class="flex items-center gap-2 p-2.5">
			<span class="text-xl font-bold text-eco-blue">{actions}</span>
			<span class="text-[13px] text-eco-blue">Actions</span>
		</div>
		<div class="flex items-center gap-2 p-2.5">
			<span class="text-xl font-bold text-eco-blue">{credits.toLocaleString()}</span>
			<span class="text-[13px] text-eco-blue">Credits</span>
		</div>
	</div>
</div>
