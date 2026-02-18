<script>
  import { _ } from "svelte-i18n";
  import { push } from "svelte-spa-router";
  import cloud from "../../appwrite";

  import { InputEmail, ButtonGroup, Button } from "../../components/Forms";

  let email = $state("");
  let recoverLoading = $state(false);
  let recoverState = $state(false);

  let checkForm = $derived(email !== "");

  const recover = () => {
    recoverLoading = true;
    if (!checkForm) {
      recoverLoading = false;
      return;
    }
    cloud.recoverPassword(email).then(() => {
      email = "";
      recoverState = true;
      recoverLoading = true;
    });
  };
</script>

<h2>{$_('cloud.reset.title')}</h2>
{#if recoverState}
  <span class="lnr lnr-checkmark-circle"></span>
  {$_('cloud.reset.success')}
{:else}
  <form onsubmit={(e) => { e.preventDefault(); recover(); }}>
    <InputEmail
      label={$_('cloud.login.email')}
      placeholder="john.doe@email.tld"
      bind:value={email} />
    <ButtonGroup>
      <Button onclick={recover} loading={recoverLoading} disabled={!checkForm}>
        {$_('cloud.reset.button')}
      </Button>
    </ButtonGroup>
  </form>
{/if}

<h2>{$_('cloud.reset.login')}</h2>
<ButtonGroup>
  <Button onclick={() => push('/cloud')}>{$_('cloud.login.title')}</Button>
</ButtonGroup>
