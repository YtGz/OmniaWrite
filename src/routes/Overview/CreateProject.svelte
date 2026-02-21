<script>
  import { _ } from "svelte-i18n";
  import { projects } from "../../stores.svelte";
  import { Input, ButtonGroup, Button, Select } from "../../components/Forms";

  import Modal from "../../shared/Modal.svelte";

  let { showCreateProject = $bindable(false), onchangeProject } = $props();

  let form = $state({
    title: "",
    author: "",
    description: "",
    publisher: "",
    language: "",
  });

  let checkForm = $derived(form.title !== "");

  const createProject = () => {
    if (!checkForm) return false;

    let id = projects.createProject(...Object.values(form));
    showCreateProject = false;
    onchangeProject?.(id);
  };

  const languages = ["en", "de", "ru", "es", "pt", "fr", "it"].map(language => {
    return {
      value: language,
      text: $_(`settings.appereance.language.${language}`),
    };
  });
</script>

<Modal bind:show={showCreateProject}>
  {#snippet header()}<h2>{$_('overview.modals.newProject.header')}</h2>{/snippet}
  <form onsubmit={(e) => { e.preventDefault(); createProject(); }}>
    <Input
      label={$_('export.title')}
      bind:value={form.title}
      autofocus="true"
      autocomplete="off"
      placeholder={$_('placeholder.title')} />
    <Input
      label={$_('export.author')}
      bind:value={form.author}
      placeholder="John Doe"
      autocomplete="off" />
    <Input
      label={$_('export.publisher')}
      bind:value={form.publisher}
      autocomplete="off"
      placeholder="OmniaWrite"
      helper={$_('export.helpers.publisher')} />
    <Select
      label={$_('export.language')}
      bind:value={form.language}
      options={languages}
      required="true"
      helper={$_('export.helpers.language')} />
    <Input
      label={$_('export.description')}
      placeholder="This book is awesome..."
      bind:value={form.description}
      helper={$_('export.helpers.description')} />
    <ButtonGroup>
      <Button onclick={createProject} disabled={!checkForm}>
        {$_('overview.modals.newProject.button')}
      </Button>
    </ButtonGroup>
  </form>
</Modal>
