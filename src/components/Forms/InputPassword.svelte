<script>
  import { getRandomNumber } from "../../utils";
  import { Field } from ".";

  let { label, id = label + getRandomNumber(), value = $bindable(""), placeholder, autocomplete = "off", required = false } = $props();

  const regexMedium = RegExp(
    "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
  );
  const regexStrong = RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );

  let passwordIsMedium = $derived(regexMedium.test(value));
  let passwordIsStrong = $derived(regexStrong.test(value));
</script>

<Field {id} {label}>
  <input
    class:weak={value.length > 0 && !passwordIsMedium}
    class:medium={value.length > 0 && passwordIsMedium && !passwordIsStrong}
    class:strong={value.length > 0 && passwordIsStrong}
    {id}
    {placeholder}
    {autocomplete}
    {required}
    type="password"
    bind:value />
</Field>

<style lang="scss">
  input {
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    -o-appearance: none;
    width: 100%;
    margin: 0;
    padding: 0 0.25rem;
    border: none;
    border-radius: 0;
    box-shadow: none;
    height: 1.2rem;
    color: var(--text-color);
    display: inline-block;
    border-bottom: 1px solid #999;
    max-height: 1.2rem;
    font-size: 1rem;
    opacity: 0.65;
    background: linear-gradient(to bottom, transparent 95%, green 95%) no-repeat;
    background-size: 0 100%;
    transition: background-size 0.2s ease;

    &.strong {
      background: linear-gradient(to bottom, transparent 95%, green 95%)
        no-repeat;
      border-bottom: 1px solid green;
      background-size: 100% 100%;
      outline: 0;
      opacity: 1;
    }

    &.medium {
      background: linear-gradient(to bottom, transparent 95%, blue 95%)
        no-repeat;
      background-size: 50% 100%;
      outline: 0;
      opacity: 1;
    }

    &.weak {
      background: linear-gradient(to bottom, transparent 95%, red 95%) no-repeat;
      background-size: 25% 100%;
      outline: 0;
      opacity: 1;
    }
  }
</style>
