import type { App } from "vue";
import * as components from "./components";
import "./scss/index.scss";

const plugin = {
  install(app: App) {
    // console.log('components :>> ', components);
    for (const prop in components) {
      // @ts-expect-error: I want to index import using string
      const component = components[prop];
      app.component(component.name, component);
    }
  },
};

// export { default as nuxt } from "./nuxt";
// presets
export { presetCore } from "./presets/core";
export {
    colors as defaultThemeColors, presetThemeDefault
} from "./presets/theme-default";
export { plugin as anu };
