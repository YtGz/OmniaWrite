<script>
  import Button from "../components/Forms/Button.svelte";
  import ButtonGroup from "../components/Forms/ButtonGroup.svelte";
  import { checkBrowser } from "../utils";

  import add from "date-fns/add";

  import Modal from "./Modal.svelte";
  import Select from "../components/Forms/Select.svelte";

  /**
   * @name isIgnoreSet
   * @returns {bool} True if set, false if not
   **/
  const isIgnoreSet = () => {
    let cookies = document.cookie.split(";");

    for (let cookie of cookies) {
      if (cookie.trim().startsWith("ignoreModal")) return true;
    }

    return false;
  };

  let show = $state(!checkBrowser() && !isIgnoreSet());

  // Options for our Select Field.
  let options = [
    {
      value: 0,
      text: "This session",
    },
    {
      value: 1,
      text: "1 day",
    },
    {
      value: 2,
      text: "2 days",
    },
    {
      value: 3,
      text: "3 days",
    },
    {
      value: 5,
      text: "5 days",
    },
    {
      value: 7,
      text: "7 days",
    },
  ];

  // Variable that stores the input of the Select field
  let daysIgnored = $state();

  /**
   * @name setIgnoreCookie
   * @description Sets the IgnoreModal cookie with expiration date
   **/
  const setIgnoreCookie = () => {
    let date = add(new Date(), { days: daysIgnored });

    if (daysIgnored == 0) {
      document.cookie = "ignoreModal=true;expires=0;path=/";
    } else {
      document.cookie = "ignoreModal=true;expires=" + date + ";path=/";
    }

    show = false;
  };
</script>

<Modal bind:show>
  {#snippet header()}<h4>Your Browser Choice</h4>{/snippet}
  <p>
    We respect your Browser Choice. But we kindly request for you to use the
    desktop apps or use the Brave Browser.
  </p>
  <p>
    For more information regarding browser choice and/or downloads, check out
    the
    <a href="https://www.omniawrite.com/get-started/">Get Started</a>
    page of our website.
  </p>
  <form onsubmit={(e) => { e.preventDefault(); setIgnoreCookie(); }}>
    <Select
      label="Don't show this for:"
      {options}
      bind:value={daysIgnored} />
    <ButtonGroup>
      <Button onclick={setIgnoreCookie}>Update</Button>
    </ButtonGroup>
  </form>
</Modal>
