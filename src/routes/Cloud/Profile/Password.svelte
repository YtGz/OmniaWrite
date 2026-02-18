<script>
  import { _ } from "svelte-i18n";

  import cloud from "../../../appwrite";
  import Toast from "../../../shared/Toast.svelte";

  import {
    InputPassword,
    Button,
    ButtonGroup,
  } from "../../../components/Forms";

  let old_password = $state("");
  let new_password = $state("");
  let new_password_confirm = $state("");

  let textToast = $state("");
  let showToast = $state(false);
  let loading = $state(false);

  const updatePassword = () => {
    if (
      new_password === new_password_confirm &&
      new_password !== "" &&
      new_password_confirm !== "" &&
      old_password !== ""
    ) {
      loading = true;
      cloud.updatePassword(new_password, old_password).then(
        () => {
          loading = false;
          old_password = new_password = new_password_confirm = "";
          [showToast, textToast] = [true, $_("cloud.profile.password.success")];
        },
        () => {
          loading = false;
          [showToast, textToast] = [true, $_("cloud.profile.error")];
        }
      );
    } else {
      [showToast, textToast] = [true, $_("cloud.profile.password.match")];
    }
  };
</script>

<h2>{$_('cloud.profile.password.title')}</h2>

<form onsubmit={(e) => { e.preventDefault(); updatePassword(); }}>
  <InputPassword
    label={$_('cloud.profile.password.fields.old')}
    placeholder="******"
    bind:value={old_password} />
  <InputPassword
    label={$_('cloud.profile.password.fields.new')}
    placeholder="******"
    bind:value={new_password} />
  <InputPassword
    label={$_('cloud.profile.password.fields.confirm')}
    placeholder="******"
    bind:value={new_password_confirm} />
  <ButtonGroup>
    <Button onclick={updatePassword} {loading}>
      {$_('cloud.profile.action')}
    </Button>
  </ButtonGroup>
</form>

<Toast bind:show={showToast} text={textToast} />
