<script>
  import { getRandomNumber } from "../../utils";
  import { Field } from ".";

  let { label, id = label + getRandomNumber(), value = $bindable(), min, max, step, helper } = $props();
</script>

<Field {id} {label} {helper}>
  <input {id} {min} {max} {step} type="range" bind:value />
</Field>

<style>
  input {
    width: 100%;
  }
</style>
