import "i18next";
import type en from "./locales/en.json";

// Augments react-i18next so `t()` only accepts keys that exist in en.json.
// `en` is the canonical source of keys: any locale missing a key will fail typecheck.
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof en;
    };
    // i18next v23+ defaults this to false, which makes `t()` accept any string.
    // Enabling it rejects keys that don't exist in the resources at compile time.
    strictKeyChecks: true;
  }
}
