<script>
  import { _ } from "svelte-i18n";

  import cloud from "../../../appwrite";
  import Toast from "../../../shared/Toast.svelte";

  import {
    InputEmail,
    InputPassword,
    ButtonGroup,
    Button,
  } from "../../../components/Forms";

  let { email = $bindable() } = $props();

  let password = $state("");
  let showToast = $state(false);
  let textToast = $state("");
  let loading = $state(false);

  const updateEmail = () => {
    loading = true;
    cloud.updateEmail(email, password).then(
      () => {
        loading = false;
        password = "";
        [showToast, textToast] = [true, $_("cloud.profile.email.success")];
      },
      () => {
        loading = false;
        [showToast, textToast] = [true, $_("cloud.profile.error")];
      }
    );
  };
</script>

<h2>{$_('cloud.profile.email.title')}</h2>

<form onsubmit={(e) => { e.preventDefault(); updateEmail(); }}>
  <InputEmail
    label={$_('cloud.profile.email.fields.email')}
    placeholder="john.doe@email.tld"
    bind:value={email} />
  <InputPassword
    label={$_('cloud.profile.email.fields.password')}
    placeholder="******"
    bind:value={password} />
  <ButtonGroup>
    <Button onclick={updateEmail} {loading}>
      {$_('cloud.profile.action')}
    </Button>
  </ButtonGroup>
</form>

<Toast bind:show={showToast} text={textToast} />
