import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  symbol: z.string().min(1, { message: "Token symbol is required" }),
  royaltyFee: z
    .string()
    .min(1, { message: "Royalty fee is required" })
    .refine(
      (val) => {
        const fee = Number(val);
        return fee >= 0 && fee <= 100;
      },
      {
        message: "Royalty fee should be between 0 and 100",
      }
    ),
  maxSupply: z.string().min(1, { message: "Max supply is required" }),
  file: z.instanceof(File, { message: "File is required" }),
});
