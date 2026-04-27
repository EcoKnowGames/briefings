<script lang="ts">
	import { Copy, Check } from '@lucide/svelte';
	import { parseSimpleYaml } from '$lib/yaml.js';
	import { tick } from 'svelte';
	import type { Snippet } from 'svelte';

	let {
		initialCode,
		preview
	}: {
		initialCode: string;
		preview: Snippet<[Record<string, unknown> | null]>;
	} = $props();

	let code = $state(initialCode);
	let copied = $state(false);

	let parsed = $derived.by(() => {
		try {
			const result = parseSimpleYaml(code);
			return Object.keys(result).length > 0 ? result : null;
		} catch {
			return null;
		}
	});

	let lineCount = $derived(code.split('\n').length);

	async function copyCode() {
		try {
			await navigator.clipboard.writeText(code);
		} catch {
			const ta = document.createElement('textarea');
			ta.value = code;
			document.body.appendChild(ta);
			ta.select();
			document.execCommand('copy');
			document.body.removeChild(ta);
		}
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	async function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Tab') {
			e.preventDefault();
			const ta = e.target as HTMLTextAreaElement;
			const start = ta.selectionStart;
			const end = ta.selectionEnd;
			code = code.substring(0, start) + '  ' + code.substring(end);
			await tick();
			ta.selectionStart = ta.selectionEnd = start + 2;
		}
	}
</script>

<div class="overflow-hidden rounded-panel border border-gray-300">
	<!-- Preview -->
	<div class="bg-white p-5">
		{@render preview(parsed)}
	</div>

	<!-- Code Editor -->
	<div class="relative overflow-x-auto border-t border-gray-300 bg-gray-50">
		<button
			onclick={copyCode}
			class="absolute right-3 top-3 z-10 cursor-pointer rounded border-none bg-transparent p-1 text-gray-400 transition-colors hover:text-gray-600"
			title="Copy to clipboard"
		>
			{#if copied}
				<Check size={16} />
			{:else}
				<Copy size={16} />
			{/if}
		</button>
		<div class="flex">
			<div
				class="flex flex-col items-end py-4 pl-4 pr-3 font-mono text-xs leading-[1.625] text-gray-300 select-none"
			>
				{#each { length: lineCount } as _, i}
					<span>{i + 1}</span>
				{/each}
			</div>
			<textarea
				bind:value={code}
				onkeydown={handleKeydown}
				class="flex-1 resize-none bg-transparent py-4 pr-12 font-mono text-xs leading-[1.625] text-gray-700 outline-none"
				rows={Math.max(lineCount, 3)}
				wrap="off"
				spellcheck={false}
			></textarea>
		</div>
	</div>
</div>
