<script>
  import { getRandomNumber } from "../../utils";
  import { Field } from ".";

  let { label, id = label + getRandomNumber(), value = $bindable(), helper } = $props();
</script>

<Field {id} {label} {helper}>
  <textarea {id} rows="10" bind:value></textarea>
</Field>

<style lang="scss">
  textarea {
    width: 100%;
    height: auto;
    resize: vertical;
    background: none;
    border: 1px solid #999;
    color: var(--text-color);
    border-radius: 0.125rem;
    font-size: 0.8rem;
    opacity: 0.65;

    &:focus {
      opacity: 1;
    }
  }
</style>
