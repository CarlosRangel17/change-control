<script>
	import * as animateScroll from 'svelte-scrollto';
	import { fade } from 'svelte/transition';
	import Form from '$lib/Form.svelte';
	import Home from '$lib/Home.svelte';
	import Footer from '$lib/Footer.svelte';
	import Header from '$lib/Header.svelte';
	import RecommendationCard from '$lib/RecommendationCard.svelte';
	import LoadingCard from '$lib/LoadingCard.svelte';
	import UserStories from "$lib/UserStories.svelte";
	import DocXForm from '$lib/DocXForm.svelte'
	
	let loadingUserStories = false
	let loading = false;
	let error = '';
	let endStream = false;
	let makeRecommendation = false;
	let tags = ''

	/**
	 * @type {string}
	 */
	let searchResponse = '';
	/**
	 * @type {Array<string | {title: string, description: string}>}
	 */
	let recommendations = [];

	/**
	 * @param {string} target
	 */

	$: {
		if (searchResponse) {
			let lastLength = recommendations.length;
			let x = searchResponse?.split('\n');
			recommendations = x.map((d, i) => {
				if ((x.length - 1 > i || endStream) && d !== '') {
					// @ts-ignore
					const [, title, description] = d.match(/\d\.\s*(.*?):\s*(.*)/);
					return { title, description };
				} else {
					return d;
				}
			});
			if (recommendations.length > lastLength) {
				animateScroll.scrollToBottom({ duration: 1500 });
			}
		}
	}

	/**
	 * @type {string}
	 */
	let selectedProject = '';
	/**
	 * @type {Array<string>}
	 */
	let selectedStories = [];
	let specificDescriptors = '';

	async function search() {
		if (loading) return;
		recommendations = [];
		searchResponse = '';
		endStream = false;
		loading = true;

		let fullSearchCriteria = `Give me a list of 5 ${selectedProject} recommendations ${
			selectedStories ? `that fit all of the following categories: ${selectedStories}` : ''
		}. ${
			specificDescriptors
				? `Make sure it fits the following description as well: ${specificDescriptors}.`
				: ''
		} ${
			selectedStories || specificDescriptors
				? `If you do not have 5 recommendations that fit these criteria perfectly, do your best to suggest other ${selectedProject}'s that I might like.`
				: ''
		} Please return this response as a numbered list with the ${selectedProject}'s title, followed by a colon, and then a brief description of the ${selectedProject}. There should be a line of whitespace between each item in the list.`;
		const response = await fetch('/api/getRecommendation', {
			method: 'POST',
			body: JSON.stringify({ searched: fullSearchCriteria }),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.ok) {
			try {
				const data = response.body;
				if (!data) {
					return;
				}

				const reader = data.getReader();
				const decoder = new TextDecoder();

				while (true) {
					const { value, done } = await reader.read();
					const chunkValue = decoder.decode(value);

					searchResponse += chunkValue;

					if (done) {
						endStream = true;
						break;
					}
				}
			} catch (err) {
				error = 'Looks like OpenAI timed out :(';
			}
		} else {
			error = await response.text();
		}
		loading = false;
	}
	function clearForm() {
		recommendations = [];
		searchResponse = '';
		endStream = false;
		selectedProject = '';
		selectedStories = [];
		specificDescriptors = '';
		displayUserStories = false;
		userStories = [];
	}
	
	/**
	 * @type {any[]}
	 */
	let userStories = []
	let displayUserStories = false 
	const loadUserStories = () => displayUserStories = true

	$: {
		console.log('test!!', userStories )
		if (userStories.length > 0) {
			let lastLength = userStories.length;
			if (userStories.length >= lastLength) {
				animateScroll.scrollToBottom({ duration: 1500 });
			}
		}
	}
</script>

<div>
	<div class="h-screen w-full bg-cover fixed" style="background-image: url(/background.png)">
		<div
			class={`${
				makeRecommendation ? 'backdrop-blur-md' : ''
			}  flex flex-col items-center justify-center min-h-screen w-full h-full bg-gradient-to-br from-slate-900/80 to-black/70`}
		/>
	</div>

	<div class="absolute inset-0 px-6 flex flex-col h-screen overflor-auto">
		<Header
			on:click={() => {
				makeRecommendation = false;
			}}
		/>

		{#if !makeRecommendation}
			<div
				in:fade
				class="flex-grow max-w-4xl mx-auto w-full md:pt-20  flex flex-col items-center justify-center"
			>
				<Home
					on:click={() => {
						makeRecommendation = true;
					}}
				/>
			</div>
		{:else}
			<div in:fade class="w-full max-w-4xl mx-auto">
				<div class="w-full mb-8">
					<Form
						bind:selectedProject
						bind:selectedStories
						bind:loading
						bind:loadingUserStories
						bind:specificDescriptors
						bind:tags
						bind:userStories
						on:loadUserStories={loadUserStories}
						on:click={() => console.log('submit!')}
					/>
					{#if displayUserStories}
						<button
							on:click={clearForm}
							class="bg-white/20 hover:bg-white/30 mt-4 w-full h-10 text-white font-bold p-3 rounded-full flex items-center justify-center"
						>
							Clear Search
						</button>
					{/if}
					<!-- {#if recommendations.length > 0 && endStream}
						<button
							on:click={clearForm}
							class="bg-white/20 hover:bg-white/30 mt-4 w-full h-10 text-white font-bold p-3 rounded-full flex items-center justify-center"
						>
							Clear Search
						</button>
					{/if} -->
				</div>
				<div class="md:pb-20 max-w-4xl mx-auto w-full">
					{#if displayUserStories}
						<UserStories 
								bind:tags 
								bind:userStories
								bind:selectedStories
								bind:selectedProject
							/>
						<DocXForm 
							bind:selectedStories
							bind:selectedProject
						/>
					{/if}
					<!-- Form
						- Release Date
						- Release Start Time
						- Release End Time
						- <T> Tester Approval
						- <T> App Approver
						- <T> Business Unit Approver(s)
						- <T> Business Unit Impacted 
						- <T> Systems Involved 
						- <T> Reason for Change 
						- <API> Description of Change 
						- <T> Description ADO Board
						- <T> Does backup exist 
						- <T> Describe back out of procedures 
						- <T> Who is performing change control 
						- <T> Testing plan 
						- Testing plan testers 
					 -->
					<!-- {#if loading && !searchResponse && !recommendations}
						<div class="fontsemibold text-lg text-center mt-8 mb-4">
							Please be patient as I think. Good things are coming 😎.
						</div>
					{/if}
					{#if error}
						<div class="fontsemibold text-lg text-center mt-8 text-red-500">
							Woops! {error}
						</div>
					{/if} -->
					<!-- {#if userStories.length > 0}
						{console.log('!! userStories', { userStories })}
						{#each userStories as userStory}
							<div>
								<div class="mb-8">
									{userStory.id}
									{#if typeof userStory !== 'string' && userStory.id}
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
									{:else}
									
									{/if}
								</div>
							</div>
						{/each}
					{/if} -->
					<!-- {#if recommendations}
						{#each recommendations as recommendation, i (i)}
							<div>
								{#if recommendation !== ''}
									<div class="mb-8">
										{#if typeof recommendation !== 'string' && recommendation.title}
											<RecommendationCard {recommendation} />
										{:else}
											<div in:fade>
												<LoadingCard incomingStream={recommendation} />
											</div>
										{/if}
									</div>
								{/if}
							</div>
						{/each}
					{/if} -->
				</div>
			</div>
		{/if}
		<Footer />
	</div>
</div>
