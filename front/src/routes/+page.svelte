<script lang="ts">
	import Chat from './Chat.svelte';
	import { currentUser } from '$lib/stores';
</script>

{#if $currentUser}
	<div class="flex flex-col w-full h-full mx-auto items-center m-4">
		<div class="space-y-2 text-center mb-2 sm:mb-4 md:mb-8">
			<h1
				class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-purple-400"
			>
				The Overengineered Chat
			</h1>
		</div>

        <div class="flex justify-center items-center w-full m-2">
		<h2 class="text-center">You are currently logged in as: <br> {$currentUser.username}</h2>
        </div>

		<Chat />
	</div>
{/if}
