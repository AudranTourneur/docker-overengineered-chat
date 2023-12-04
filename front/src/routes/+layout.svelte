<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.postcss';
	import { getTRPCClient } from '$lib/trpc';

	let isLoaded = false;

	onMount(async () => {
		console.log('Loading...');
        const client = getTRPCClient()
        client.registerOrLogin.mutate(null)
		isLoaded = true;
	});
</script>

{#if isLoaded}
	<slot />
{/if}
