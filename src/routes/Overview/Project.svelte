<script>
  import { get } from "svelte/store";
  import { _ } from "svelte-i18n";

  import { appState, chapters, scenes } from "../../stores";
  import { countCharsHtml, countWordsHtml } from "../../utils";
  import Grid from "../../components/Grid/Grid.svelte";
  import GridElement from "../../components/Grid/GridElement.svelte";
  import Spinner from "../../shared/Spinner.svelte";

  const analyze = new Promise(resolve => {
    const filteredChapters = get(chapters).filter(
      e => e.project == $appState.currentProject
    );
    const filteredScenes = filteredChapters.flatMap(e =>
      get(scenes).filter(s => s.chapter == e.id)
    );
    const filteredRest = filteredScenes
      .filter(e => e.content)
      .reduce(
        (prev, curr) => {
          return {
            words: prev.words + countWordsHtml(curr.content),
            chars: prev.chars + countCharsHtml(curr.content),
          };
        },
        { words: 0, chars: 0 }
      );

    resolve({
      chapters: filteredChapters.length,
      scenes: filteredScenes.length,
      words: filteredRest.words,
      chars: filteredRest.chars,
    });
  });
</script>

{#await analyze}
  <Spinner />
{:then analytics}
  <Grid columns={4}>
    <GridElement>
      <h3>{analytics.chapters}</h3>
      <p>{$_('overview.project.chapters')}</p>
    </GridElement>
    <GridElement>
      <h3>{analytics.scenes}</h3>
      <p>{$_('overview.project.scenes')}</p>
    </GridElement>
    <GridElement>
      <h3>{analytics.words}</h3>
      <p>{$_('overview.project.words')}</p>
    </GridElement>
    <GridElement>
      <h3>{analytics.chars}</h3>
      <p>{$_('overview.project.characters')}</p>
    </GridElement>
  </Grid>
{/await}
