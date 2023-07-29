<!-- UserStories.svelte -->

<script>
	import LoadingCard from "./LoadingCard.svelte"

	/**
	 * @type Array<string>
	 */
	export let selectedStories = [];
  /**
	 * @type {any[]}
	 */
  export let userStories = [];

  /**
	 * @type {string}
	 */
   export let tags = '';

  /**
	 * @type {string}
	 */
   export let selectedProject = '';

  /**
	 * @type {() => Promise<any>}
	 */
  export async function fetchUserStories() {   

    try {
       const response = await fetch('/api/getUserStories', {
        method: 'POST',
        body: JSON.stringify({ tags, selectedProject }),
        headers: {
          'content-type': 'application/json'
        }
      });

      userStories = await response.json();
      selectedStories = userStories.reduce((result, story) => {
        const { title } = story
        if (!title.toLowerCase().includes('regression')) {
          result.push(story);
        }
        return result;
      }, []);
    } catch(error) {
      console.error('~[UserStories] error', { error })
    }

    return userStories;
  }

  let promise = fetchUserStories() // fetch user stories when component mounts

  let animationInProgress = true;

  // Function to handle the animation completion
  function onAnimationComplete() {
    animationInProgress = false;
  }

  // Function to check if the current card is the last one
  /**
	 * @param {number} i
	 */
  function isLastCard(i) {
    return i === userStories.length - 1;
  }

  // Bind the onAnimationComplete function to the animationend event of the last card
  /**
	 * @param {number} i
	 */
  function handleAnimationEnd(i) {
    if (isLastCard(i)) {
      onAnimationComplete();
    }
  }

  let storyAnimation = ''
  $: {
    storyAnimation = animationInProgress ? 'story-animation' : 'opacity-100'
  }
</script>

{#await promise}
  <div class='flex flex-row flex-wrap justify-between'>
    <LoadingCard incomingStream={false} />
    <LoadingCard incomingStream={false} />
    <LoadingCard incomingStream={false} />
    <LoadingCard incomingStream={false} />
    <LoadingCard incomingStream={false} />
    <LoadingCard incomingStream={false} />
    <LoadingCard incomingStream={false} />
    <LoadingCard incomingStream={false} />
    <LoadingCard incomingStream={false} />
    <LoadingCard incomingStream={false} />
    <LoadingCard incomingStream={false} />
    <LoadingCard incomingStream={false} />
    <LoadingCard incomingStream={false} />
    <LoadingCard incomingStream={false} />
    <LoadingCard incomingStream={false} />
    <LoadingCard incomingStream={false} />
  </div>
{:then userStories}
  <h1 class='mb-4 font-semibold text-lg'>User Stories with tag(s): "{tags}":</h1>

  <div class='flex flex-row flex-wrap justify-between stories-container'>
    {#each userStories as userStory, i (i)}
      <label
         class={`${ selectedStories.includes(userStory) ? 'bg-green-600/40' : 'bg-neutral-800/70'} 
          relative flex flex-row flex-wrap shadow-md p-3 w-[200px] mb-5 
          bg-pink story ${storyAnimation} border-l-2 ${userStory.type === 'Bug' ? 'border-l-red-700' : 'border-l-blue-500'}`
        }
        style={`--animation-delay: ${i/10 + 0.05};`}
        on:animationend={() => handleAnimationEnd(i)}
      >
        <input
          class="hidden"
          type="checkbox"
          bind:group={selectedStories}
          name="selectedStories"
          value={userStory}
        />
        
        <div class="flex flex-row flex-wrap w-full">
            <div class="w-full">
              <div class="flex items-end mb-4">
                <div class="flex items-end">
                  <a class='hover:underline' href={userStory.url} target="_blank">{userStory.id}</a>
                </div>
              </div>
              <div class="text-slate-200/90 mb-4 w-full break-words">
                {userStory.title}
              </div>
            </div>
        </div>
      </label>
    {/each}
  </div>
{:catch error}
  <div>Hello error! {error}</div>
{/await}

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

  /* Style for the stories */
  /* Resource: https://codepen.io/gelund/pen/VQoeqMa */
  .story {
    /* Adjust transition timing */
    /* transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;  */
    transition: all 500ms ease-in-out;
    will-change: transform; /* Enable hardware acceleration */

  }

  .story-animation {
    /* Start with 0 opacity to hide the stories */
    opacity: 0; 
     /* Apply the animation to all stories */
    animation: showStory 0.5s ease forwards;
    /* Calculate the animation delay based on the CSS variable */
    animation-delay: calc(var(--animation-delay) * (1s)); 
  }

  /* Animation to make stories appear one after another */
  @keyframes showStory {
    0% {
      opacity: 0;
      transform: translateY(50px); /* Adjust the value based on the desired animation */
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Hover style animation */
  .story:hover {
    cursor: pointer;

    /* Adjust the value to bump the card upward */
    transform: translateY(-5px) !important; 

    /* box-shadow: 0 7px 14px rgba(0, 0, 0, 0.1); */
    box-shadow: 0px 12px 30px 0px rgba(0, 0, 0, 0.2);
    transition: all 800ms cubic-bezier(0.19, 1, 0.22, 1);
  }

  /* Add more nth-child rules for additional stories */

</style>

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
          <div in:fade>
            <LoadingCard incomingStream={recommendation} />
          </div>
        {/if}
      </div>
    </div>
  {/each}
{/if} -->