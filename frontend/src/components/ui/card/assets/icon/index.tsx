import { VisaLogo } from "./visa.tsx";
import { MastercardLogo } from "./mastercard.tsx";
import { AmexLogo } from "./amex.tsx";
import { DefaultLogo } from "./default.tsx";

export const Logos = {
  visa: VisaLogo,
  mastercard: MastercardLogo,
  amex: AmexLogo,
  default: DefaultLogo,
};

export type CardLogoType = keyof typeof Logos;

export { VisaLogo, MastercardLogo, AmexLogo, DefaultLogo };
