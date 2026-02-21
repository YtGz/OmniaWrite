<script>
  import { _ } from "svelte-i18n";
  import { push } from "@keenmate/svelte-spa-router";
  import { scenes } from "../../stores.svelte";
  import { Input, ButtonGroup, Button } from "../../components/Forms";
  import Modal from "../../shared/Modal.svelte";

  let { show = $bindable(), data = $bindable() } = $props();

  const editScene = () => {
    scenes.setSceneTitle(data.id, data.title);
    show = false;
  };

  const removeScene = sceneId => {
    let confirmed = confirm($_("sidebar.delete.scene"));
    if (confirmed == true) {
      show = false;
      push("/write");
      window.setTimeout(() => scenes.removeScene(sceneId), 200);
    }
  };
</script>

<Modal bind:show>
  {#snippet header()}<h2>{$_('sidebar.editScene')}</h2>{/snippet}
  <form onsubmit={(e) => { e.preventDefault(); editScene(); }}>
    <Input
      label={$_('sidebar.modal.title')}
      bind:value={data.title}
      autocomplete="off"
      autofocus="true"
      placeholder={$_('placeholder.title')} />

    <ButtonGroup>
      <Button onclick={editScene} disabled={data.title.length === 0}>
        {$_('sidebar.modal.edit.buttonSave')}
      </Button>
      <Button onclick={() => removeScene(data.id)} color="red">
        {$_('sidebar.modal.edit.buttonDelete')}
      </Button>
    </ButtonGroup>
  </form>
</Modal>
