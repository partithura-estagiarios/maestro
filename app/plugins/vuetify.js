// plugins/vuetify.js
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true, // Crucial for Server-Side Rendering
    theme: {
      defaultTheme: "dark", // Options: 'light', 'dark', 'system'
      // disable: true, // Set to true to disable theme functionality
    },
    customVariables: ["../assets/settings.scss"],
    components,
    directives,
    defaults: {
      VTextField: {
        variant: "outlined",
      },
      VSelect: {
        variant: "outlined",
      },
      VNumberInput: {
        variant: "outlined",
      },
      VSheet: {
        border: "sm",
      },
      VChip: {
        variant: "outlined",
        density: "compact",
      },
      VBtn: {
        variant: "outlined",
        tile: true,
      },
    },
    styles: {
      configFile: "../assets/settings.scss",
    },
  });
  nuxtApp.vueApp.use(vuetify);
});
