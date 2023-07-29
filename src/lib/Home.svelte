<script>
	import { signIn, accountId } from "$lib/MSAL.svelte";

  let showSign = accountId === '';
  // Create a reactive statement with setTimeout to update showSign when accountId changes
  $: {
    setTimeout(() => {
      showSign = accountId === '';
    }, 500);
  }

</script>
<div class="w-full">
	<div
		class="text-center md:text-center font-bold text-slate-200 text-4xl md:text-5xl mb-8 md:mb-16 w-full"
	>
		👋 Welcome to Change Control 
		<br class="hidden md:block" /> with Open AI
	</div>
	<div class="flex flex-wrap justify-center items-center mr-auto">
		{#if showSign}
			<button on:click={signIn}
				class="w-full md:w-auto text-center bg-pink-600 hover:bg-pink-700 mb-4 flex-none rounded-full text-white font-medium py-3 px-6 mr-8"
			>
				Sign in
			</button>
		{:else}
			<button
				on:click
				class="w-full md:w-auto text-center bg-pink-600 hover:bg-pink-700 mb-4 flex-none rounded-full text-white font-medium py-3 px-6 mr-8"
			>
				Start Change Control Form
			</button>
			<a
				href="https://www.youtube.com/watch?v=Z3LrfdctOpU"
				target="_blank"
				class="w-full md:w-auto text-center bg-white/20 hover:bg-white/50 mb-4 flex-none rounded-full text-white font-medium py-3 px-6"
			>
				Learn how it's built
			</a>
		{/if}
	</div>
</div>
