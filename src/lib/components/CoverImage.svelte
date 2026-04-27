<script lang="ts">
	let { coverImage }: { coverImage: string } = $props();
</script>

<div class="h-[300px] w-full max-w-[440px] overflow-hidden rounded-panel bg-white">
	<img src={coverImage} alt="Scenario cover" class="h-full w-full object-cover" />
</div>
