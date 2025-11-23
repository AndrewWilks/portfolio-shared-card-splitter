import { VisaLogo } from "./visa.tsx";
import { MastercardLogo } from "../rounded/index.tsx";
import { AmexLogo } from "../rounded/index.tsx";
import { DefaultLogo } from "../rounded/index.tsx";

export const icons = {
  visa: VisaLogo,
  mastercard: MastercardLogo,
  amex: AmexLogo,
  default: DefaultLogo,
};

export type CardIconType = keyof typeof icons;

export { AmexLogo, DefaultLogo, MastercardLogo, VisaLogo };
