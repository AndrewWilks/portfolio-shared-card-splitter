import { VisaLogo } from "./visa.tsx";
import { MastercardLogo } from "./mastercard.tsx";
import { AmexLogo } from "./amex.tsx";
import { DefaultLogo } from "./default.tsx";

export const rounded = {
  visa: VisaLogo,
  mastercard: MastercardLogo,
  amex: AmexLogo,
  default: DefaultLogo,
};

export type CardRoundedType = keyof typeof rounded;

export { AmexLogo, DefaultLogo, MastercardLogo, VisaLogo };
