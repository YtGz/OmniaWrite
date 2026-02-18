<script>
  import { _ } from "svelte-i18n";
  import { push } from "svelte-spa-router";
  import { scenes } from "../../stores";
  import { Input, ButtonGroup, Button } from "../../components/Forms";
  import Modal from "../Modal.svelte";

  let { show = $bindable(), chapter = $bindable() } = $props();

  let title = $state("");

  const createScene = () => {
    const id = scenes.createScene(chapter, title);
    show = false;
    title = "";
    push("/write/" + id);
  };
</script>

<Modal bind:show>
  {#snippet header()}<h2>{$_('sidebar.modal.newScene.header')}</h2>{/snippet}
  <form onsubmit={(e) => { e.preventDefault(); createScene(); }}>
    <Input
      label={$_('sidebar.modal.title')}
      bind:value={title}
      autofocus="true"
      autocomplete="off"
      placeholder={$_('placeholder.title')} />
    <ButtonGroup>
      <Button onclick={createScene} disabled={title.length === 0}>
        {$_('sidebar.modal.newScene.button')}
      </Button>
    </ButtonGroup>
  </form>
</Modal>
