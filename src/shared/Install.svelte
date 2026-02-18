<script>
  import { intern, settings } from "../stores";
  import { _, locales } from "svelte-i18n";
  import { Button, ButtonGroup, Select, Checkbox } from "../components/Forms";
  import Modal from "./Modal.svelte";
  import Disclaimer from "./Disclaimer.svelte";

  let disclaimer = $state(false);
  let showDisclaimer = $state(false);

  let languages = $derived($locales.map(locale => ({
    value: locale,
    text: $_(`settings.appereance.language.${locale}`),
  })));
</script>

<Modal show={true} persistent={true}>
  {#snippet header()}<h2>OmniaWrite</h2>{/snippet}
  <div class="install">
    <Select
      label={$_('settings.appereance.language.title')}
      bind:value={$settings.language}
      options={languages} />
    <Checkbox
      bind:value={disclaimer}
      label={$_('install.disclaimer.title')}
      helper={$_('install.disclaimer.action')} />
    <ButtonGroup>
      <Button
        disabled={!disclaimer}
        onclick={() => ($intern.installed = true)}>
        {$_('install.action')}
      </Button>
    </ButtonGroup>
    <p class="link" onclick={() => (showDisclaimer = true)}>
      {$_('install.disclaimer.show')}
    </p>
  </div>
</Modal>

<Modal bind:show={showDisclaimer}>
  {#snippet header()}<h2>{$_('install.disclaimer.title')}</h2>{/snippet}
  <Disclaimer />
</Modal>

<style lang="scss">
  .install {
    text-align: center;
  }

  .link {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
</style>
