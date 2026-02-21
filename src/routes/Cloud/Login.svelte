<script>
  import { fade } from "svelte/transition";
  import { _ } from "svelte-i18n";
  import { push } from "@keenmate/svelte-spa-router";
  import { reloadWindow } from "../../bridge";
  import { appState } from "../../stores";

  import {
    InputEmail,
    InputPassword,
    ButtonGroup,
    Button,
  } from "../../components/Forms";

  import cloud from "../../appwrite";
  import Alert from "../../shared/Alert.svelte";

  let showAlert = $state(false);
  let showAlertText = $state();

  let form = $state({
    email: "",
    pass: "",
  });

  let checkForm = $derived(form.email !== "" && form.pass !== "");

  let loginButtonLoading = $state(false);

  const login = () => {
    loginButtonLoading = true;
    if (!checkForm) {
      showAlert = true;
      showAlertText = $_("cloud.login.responses.empty");
      loginButtonLoading = false;
      return;
    }
    cloud.login(form.email, form.pass).then(
      () => {
        appState.setLogin(true);
        window.location.hash = "#/cloud";
        reloadWindow();
      },
      () => {
        showAlert = true;
        showAlertText = $_("cloud.login.responses.failed");
        loginButtonLoading = false;
      }
    );
  };
</script>

{#if !$appState.isUserLoggedIn}
  <div in:fade={{ duration: 100 }}>
    <h2>{$_('cloud.login.title')}</h2>
    <Alert danger bind:show={showAlert}>
      <span class="lnr lnr-warning">{showAlertText}</span>
    </Alert>
    <form onsubmit={(e) => { e.preventDefault(); login(); }}>
      <InputEmail
        label={$_('cloud.login.email')}
        placeholder="john.doe@email.tld"
        bind:value={form.email} />
      <InputPassword
        label={$_('cloud.login.password')}
        placeholder="******"
        bind:value={form.pass} />
      <ButtonGroup>
        <Button
          onclick={login}
          loading={loginButtonLoading}
          disabled={!checkForm}>
          {$_('cloud.login.button')}
        </Button>
      </ButtonGroup>
    </form>
    <a class="link" href="#/cloud/reset-password">
      <small>{$_('cloud.reset.title')}</small>
    </a>
    <h2>{$_('cloud.login.register')}</h2>
    <ButtonGroup>
      <Button onclick={() => push('/cloud/register')}>
        {$_('cloud.register.title')}
      </Button>
    </ButtonGroup>
  </div>
{/if}

<style>
  .link {
    cursor: pointer;
  }
  .link:hover {
    text-decoration: underline;
  }
</style>
