import { mount } from "svelte";
import { register, init } from "svelte-i18n";
import { version } from "../package.json";

import App from "./App.svelte";

import "normalize.css";
import "./css/index.scss";

register("en", () => import("./lang/en.json"));
register("de", () => import("./lang/de.json"));
register("it", () => import("./lang/it.json"));
register("es", () => import("./lang/es.json"));
register("fi", () => import("./lang/fi.json"));
register("nl", () => import("./lang/nl.json"));
register("pt", () => import("./lang/pt.json"));
register("ru", () => import("./lang/ru.json"));
register("tr", () => import("./lang/tr.json"));
register("ja", () => import("./lang/ja.json"));
register("sv", () => import("./lang/sv.json"));
register("ur", () => import("./lang/ur.json"));
register("zh_hans", () => import("./lang/zh_hans.json"));
register("zh_hant", () => import("./lang/zh_hant.json"));

init({
  fallbackLocale: "en",
  initialLocale: JSON.parse(localStorage.getItem("settings")).language || "en",
});

const app = mount(App, {
  target: document.body,
  props: {
    version,
  },
});

export default app;
