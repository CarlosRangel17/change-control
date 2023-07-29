<script>
	/**
	 * @type {any}
	 */
	export let incomingStream;
</script>

<div class="relative flex flex-row flex-wrap bg-neutral-800/70 shadow-md p-6 w-25 mb-5">
    <div class="flex flex-row flex-wrap w-full">
      <div class="w-full">
        <div class="flex items-end mb-4">
          <div class="flex items-end">
            <div
              class="bg-gradient-to-r from-white/90 via-white/40 to-white/90 background-animate h-6 w-40 rounded-full"
            />
          </div>
        </div>
        <div class="text-slate-200/90 mb-4 w-full">
          <div
            class="w-full h-2 rounded-full bg-gradient-to-r from-white/20 via-white/10 to-white/20 background-animate mb-2"
          />
          <div
            class="w-full h-2 rounded-full bg-gradient-to-r from-white/20 via-white/10 to-white/20 background-animate mb-2"
          />
          <div
            class="w-1/2 h-2 rounded-full bg-gradient-to-r from-white/20 via-white/10 to-white/20 background-animate"
          />
        </div>
      </div>
    </div>
  </div>
<style>
	body {
		font-family: 'Inter', sans-serif;
	}

	.background-animate {
		background-size: 400%;

		-webkit-animation: AnimationName 3s ease infinite;
		-moz-animation: AnimationName 3s ease infinite;
		animation: AnimationName 3s ease infinite;
	}

	@keyframes AnimationName {
		0%,
		100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}
</style>
