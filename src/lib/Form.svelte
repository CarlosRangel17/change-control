<script>
	import { createEventDispatcher } from 'svelte'
	import LoadingIndicator from './Loading.svelte';

	/**
	 * @type string
	 */
	export let selectedProject;
	/**
	 * @type Array<string>
	 */
	export let selectedStories;
	/**
	 * @type string
	 */
	export let specificDescriptors;
	/**
	 * @type Boolean
	 */
	export let loading;
	/**
	 * @type Boolean
	 */
	export let loadingUserStories;

	/**
	 * @type {any[]}
	 */
	 export let userStories = []

	/**
	 * @type string
	 */
	export let tags

	const dispatch = createEventDispatcher();

	/**
	 * @type {() => boolean}
	*/
	const loadUserStories = () => dispatch('loadUserStories')

	/**
	 * @type Boolean
	 */
	let readyToSubmit

	let projects = [
		{ value: 'Mattress Matcher', title: 'Mattress Matcher' },
		{ value: 'Explore', title: 'X-Ray' },
		{ value: 'Delivery Tracker', title: 'Delivery Tracker' }
	];

	let isSearchUserStoriesDisabled = true
	$:{
		isSearchUserStoriesDisabled = tags.length === 0 || selectedProject === ''
	} 
</script>

<div class="pt-6 md:pt-10 text-slate-200">
	<div>
		<div class="mb-8">
			<div class="mb-4 font-semibold text-lg">What project is the change control for?</div>
			<div class="flex items-center">
				{#each projects as project (project.value)}
					<button
						on:click={() => {
							selectedProject = project.value;
						}}
						class={`${
							selectedProject === project.value ? 'bg-pink-600/40' : ''
						} text-slate-200 font-bold mr-2 text-sm mt-2 py-2 px-4 rounded-full border border-pink-600`}
					>
						{project.title}
					</button>
				{/each}
			</div>
		</div>
		<div class="mb-8">
			<label for='tags' class="mb-4 font-semibold text-lg">Enter the release tag:</label>
			<div class="flex items-center">
				<input 
					class='text-slate-200 font-bold mr-2 mt-2 text-sm py-2 px-4 rounded-full border border-pink-600 bg-transparent'
					bind:value={tags}
					type='text' 
					name='tags'
				/>
			</div>
		</div>
		{#if userStories.length === 0}
			<div class="mt-8">
				<button
					on:click={loadUserStories}
					disabled={isSearchUserStoriesDisabled}
					class={`${
						loading
							? 'bg-pink-400/50'
							: 'bg-pink-600 hover:bg-gradient-to-r from-pink-700 via-pink-600 to-pink-700 '
						} ${isSearchUserStoriesDisabled ? ' cursor-not-allowed bg-white/20 hover:bg-white/30 from-transparent via-gray-600 to-transparent' : ''} 
						mt-4 w-full h-10 text-white font-bold p-3 rounded-full flex items-center justify-center`
					}
				>
					{#if loadingUserStories}
						<LoadingIndicator />
					{:else}
						<p>Search User Stories</p>
					{/if}
				</button>
			</div>
		<!-- {:else}
			<div>
				<div class="mb-4 font-semibold text-lg">
					Select all user stories that you want the change control to include.
				</div>
				<div class="flex items-center flex-wrap">
					{#each userStories as userStory}
						<label
							class={`${
								selectedStories.includes(userStory) ? 'bg-pink-600/40' : ''
							} text-slate-200 font-bold mr-2 mt-2 text-sm py-2 px-4 rounded-full border border-pink-600`}
						>
							<input
								class="hidden"
								type="checkbox"
								bind:group={selectedStories}
								name="categories"
								value={userStory.id}
							/>
							<a href={userStory.url} target="_blank">{userStory.id}</a> | {userStory.title}
						</label>
					{/each}
				</div>
			</div> -->
		{/if}
		<div class="mt-8">
			<!-- <div class="mb-4 font-semibold text-lg">
				Write any other specifications here. Be as picky as you'd like.
			</div>
			<textarea
				bind:value={specificDescriptors}
				class="bg-white/40 border border-white/0 p-2 rounded-md placeholder:text-slate-800 text-slate-900 w-full h-20 font-medium"
				placeholder="Ex. Must have at least 2 seasons and be on Netflix or Hulu."
			/> -->
			{#if readyToSubmit}
				<button
					on:click
					class={`${
						loading
							? 'bg-green-400/50'
							: 'bg-green-600 hover:bg-gradient-to-r from-green-700 via-green-600 to-green-700 '
					} mt-4 w-full h-10 text-white font-bold p-3 rounded-full flex items-center justify-center`}
				>
					{#if loading}
						<LoadingIndicator />
					{:else}
						<p>Create Change Control Document</p>
					{/if}
				</button>
			{/if}
		</div>
	</div>
</div>
