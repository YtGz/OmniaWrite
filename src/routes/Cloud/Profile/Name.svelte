<script>
  import { _ } from "svelte-i18n";

  import cloud from "../../../appwrite";
  import Toast from "../../../shared/Toast.svelte";

  import { Input, Button, ButtonGroup } from "../../../components/Forms";

  let { name = $bindable() } = $props();

  let showToast = $state(false);
  let textToast = $state("");
  let loading = $state(false);

  const updateName = () => {
    loading = true;
    cloud.updateName(name).then(
      () => {
        loading = false;
        [showToast, textToast] = [true, $_("cloud.profile.name.success")];
      },
      () => {
        loading = false;
        [showToast, textToast] = [true, $_("cloud.profile.error")];
      }
    );
  };
</script>

<h2>{$_('cloud.profile.name.title')}</h2>

<form onsubmit={(e) => { e.preventDefault(); updateName(); }}>
  <Input
    label={$_('cloud.profile.name.fields.name')}
    placeholder="John Doe"
    bind:value={name} />
  <ButtonGroup>
    <Button onclick={updateName} {loading}>
      {$_('cloud.profile.action')}
    </Button>
  </ButtonGroup>
</form>

<Toast bind:show={showToast} text={textToast} />
