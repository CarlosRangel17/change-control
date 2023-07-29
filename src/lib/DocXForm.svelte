<!-- DataInput.svelte -->
<script>
  // import { defineConfig, searchForWorkspaceRoot } from 'vite'

  /**
   * @type {any[]}
  */
 export let selectedStories = []

   /**
   * @type {string}
  */
  export let selectedProject = ''

  /**
	 * @type {() => Promise<any>}
	 */
  export async function generateDocument() {   

    try {
       const response = await fetch('/api/getDocument', {
        method: 'POST',
        body: JSON.stringify({ selectedStories, selectedProject }),
        headers: {
          'content-type': 'application/json'
        }
      });

      const { filePath } = await response.json()

      // Create a temporary link element and click it to trigger the download
      const tempLink = document.createElement('a');
      tempLink.href = filePath; // '/public/documents/document.docx';
      tempLink.download = 'document.docx';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      
    } catch(error) {
      console.error('~[UserStories] error', { error })
    }
  }
</script>

<form on:submit|preventDefault={generateDocument}>
  <!-- <h2>Bullet Points:</h2>
  {#each bulletPoints as bullet, index}
    <div>
      <input bind:value={bulletPoints[index]} />
      <button type="button" on:click={() => bulletPoints.splice(index, 1)}>Remove</button>
    </div>
  {/each}
  <button type="button" on:click={addBulletPoint}>Add Bullet Point</button>

  <h2>Other Data:</h2>
  <textarea bind:value={otherData} /> -->

  <button type="submit">Generate Word Document</button>
</form>
