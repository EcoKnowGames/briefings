<script lang="ts">
	import { Target } from '@lucide/svelte';
	import SiteNav from '$lib/components/SiteNav.svelte';
</script>

<svelte:head>
	<title>Mission - EcoKnow Creator</title>
</svelte:head>

<SiteNav />

<div class="flex min-h-screen flex-col items-center gap-10 px-4 py-15">
	<div class="flex w-full max-w-[800px] flex-col gap-6">
		<div class="flex items-center gap-3">
			<Target size={32} />
			<h1 class="text-2xl font-bold">Our Mission</h1>
		</div>
		<div class="flex flex-col gap-4 text-[13px] leading-relaxed text-gray-500">
			<p>
				Ecological modelling has traditionally been locked away in specialist software, accessible
				only to researchers with the right training and tools. EcoKnow Creator exists to change
				that.
			</p>
			<p>
				We're building open tools that turn socio-ecological models into games - games that reflect
				real-world challenges around sustainability, biodiversity loss and community resilience. The
				goal isn't to simplify the science, but to make it something people can actually participate
				in.
			</p>
			<p>
				When a farmer in the Philippines, a student in Namibia, or a policy maker in the UK can all
				explore the same population dynamics model through an accessible scenario, it becomes a
				conversation. People can empathise with perspectives they've never considered,
				challenge assumptions, and apply that thinking to real decision making processes.
			</p>
		</div>
		<a
			href="https://ecoknowgames.github.io/"
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center justify-center gap-1.5 self-start rounded-panel bg-eco-dark px-4 py-2.5 text-[11px] font-semibold text-white no-underline transition-opacity hover:opacity-90"
		>
			Find Out More
		</a>
	</div>
</div>
