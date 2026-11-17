import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// eslint-config-next 16 expone flat config nativo (ya no se usa FlatCompat).
const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
];

export default eslintConfig;
