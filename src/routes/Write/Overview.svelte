<script>
  import { fade } from "svelte/transition";
  import { appState, chapters, scenes } from "../../stores.svelte";
  import { push } from "@keenmate/svelte-spa-router";
  import { _ } from "svelte-i18n";
  import { Grid, GridElement } from "../../components/Grid";

  import Placeholder from "../../shared/Placeholder.svelte";
  import { formatDistance } from "../../utils";

  let sceneData = $derived.by(() => {
    let data = [];
    chapters
      .filter(chapter => chapter.project == appState.currentProject)
      .forEach(chapter => {
        scenes
          .filter(scene => scene.chapter == chapter.id)
          .forEach(scene => {
            data.push(scene);
          });
      });
    return data
      .sort((b, a) => {
        if (a.lastEdit < b.lastEdit) {
          return -1;
        }
        if (a.lastEdit > b.lastEdit) {
          return 1;
        }
        return 0;
      })
      .slice(0, 10);
  });
</script>

<div in:fade={{ duration: 100 }}>
  <Grid>
    {#each sceneData as scene}
      <GridElement onclick={() => push('/write/' + scene.id)}>
        <h2>{scene.title}</h2>
        <small>
          {$_('write.overview.opened')}
          {formatDistance(scene.lastEdit)}
        </small>
      </GridElement>
    {:else}
      <Placeholder>{$_('write.overview.placeholder')}</Placeholder>
    {/each}
  </Grid>
</div>
