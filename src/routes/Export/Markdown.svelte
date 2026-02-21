<script>
  import { fade } from "svelte/transition";
  import { _ } from "svelte-i18n";
  import { appState } from "../../stores.svelte";
  import { Button, ButtonGroup } from "../../components/Forms";
  import exportMarkdown from "./Markdown/collectData";
  import { saveFile } from "../../bridge";
  import Done from "./Shared/Done.svelte";
  import Spinner from "../../shared/Spinner.svelte";

  let done = $state(false);
  let progress = $state(false);
  let file = $state();

  const download = async () => {
    progress = true;
    const data = await exportMarkdown(appState.currentProject);
    const blob = new Blob([data.document], {
      type: "text/plain",
    });
    file = await saveFile(blob, data.filename);
    done = true;
  };
</script>

<div in:fade={{ duration: 100 }}>
  {#if done}
    <Done {file} />
  {:else if progress}
    <Spinner />
  {:else}
    <p>{$_('export.markdown.explain')}</p>
    <ButtonGroup>
      <Button onclick={download}>{$_('export.action.export')}</Button>
    </ButtonGroup>
  {/if}
</div>
