<script>
  import { fade } from "svelte/transition";
  import { state } from "../stores";
  import { _ } from "svelte-i18n";
  import { Grid, GridElement } from "../components/Grid";

  import Placeholder from "../shared/Placeholder.svelte";
  import Modal from "../shared/Modal.svelte";
  import Cloud from "./Export/Cloud.svelte";
  import RTF from "./Export/RTF.svelte";
  import Markdown from "./Export/Markdown.svelte";

  const types = [
    {
      title: $_("export.rtf.title"),
      subtitle: $_("export.rtf.subtitle"),
      component: RTF,
    },
    {
      title: $_("export.markdown.title"),
      subtitle: $_("export.markdown.subtitle"),
      component: Markdown,
    },
  ];

  let selected = $state(false);
  let selectedComponent = $state();
</script>

<Modal bind:show={selected}>
  {#snippet header()}<h2>{selectedComponent.title}</h2>{/snippet}
  <svelte:component this={selectedComponent.component} />
</Modal>
<div class="export" in:fade={{ duration: 100 }}>
  {#if $state.currentProject}
    <Grid>
      <GridElement
        onclick={() => ([selected, selectedComponent] = [true, { title: $_('export.cloud.title'), component: Cloud }])}>
        <h1>{$_('export.cloud.title')}</h1>
        <p>{$_('export.cloud.subtitle')}</p>
      </GridElement>
    </Grid>
    <Grid>
      {#each types as type}
        <GridElement
          onclick={() => ([selected, selectedComponent] = [true, type])}>
          <h1>{type.title}</h1>
        </GridElement>
      {/each}
    </Grid>
  {:else}
    <Placeholder />
  {/if}
</div>

<style>
  .export {
    margin: auto;
    max-width: 800px;
  }
</style>
