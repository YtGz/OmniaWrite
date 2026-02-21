<script>
  import { _ } from "svelte-i18n";
  import {
    InputEmail,
    Textarea,
    ButtonGroup,
    Button,
  } from "../components/Forms";

  import Modal from "./Modal.svelte";

  import { ui } from "../stores.svelte";

  let email = $state("");
  let description = $state("");

  let sent = $state(false);
  let loading = $state(false);

  let checkForm = $derived(email !== "" && description !== "");

  const send = () => {
    if (!checkForm) {
      return false;
    }
    loading = true;
    fetch(
      "https://doorbell.io/api/applications/11083/submit?key=E2XjFpPM7gFQpj78ekxtNua2Qdcl2PqzqvxBBaDq6I30UOErH40aoAtkwYHWnTgx",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          message: description,
        }),
      }
    ).then(response => {
      loading = false;
      if (response.ok) {
        sent = true;
      }
    });
    return true;
  };
</script>

<Modal bind:show={ui.support.show}>
  {#snippet header()}<h2>{$_('feedback.title')}</h2>{/snippet}
  {#if !sent}
    <p>{$_('feedback.sub')}</p>
    <hr />
    <form onsubmit={(e) => { e.preventDefault(); send(); }}>
      <InputEmail
        label={$_('feedback.email')}
        bind:value={email}
        required={true}
        placeholder="john.does@email.ltd" />
      <Textarea bind:value={description} label={$_('feedback.description')} />
      <ButtonGroup>
        <Button onclick={send} {loading} disabled={!checkForm}>
          {$_('feedback.action')}
        </Button>
      </ButtonGroup>
    </form>
  {:else}
    <center>
      <span class="lnr lnr-checkmark-circle" style="font-size: 4rem"></span>
      <h2>{$_('feedback.success')}</h2>
    </center>
  {/if}
</Modal>
