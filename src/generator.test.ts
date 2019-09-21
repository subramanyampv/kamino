/* eslint-disable max-lines-per-function */
import { generate } from "./generator";

test("read pricing.yml", () => {
  const result = generate("test/pricing.yml");
  expect(result["Carrier.ts"]).toEqual(
    `// Carrier.ts
export enum Carrier {
  TNT = "TNT",
  PostNL = "PostNL"
}
`
  );

  expect(result["ProductDefinition.ts"]).toEqual(
    `// ProductDefinition.ts
import { Carrier } from "./carrier";

export interface ProductDefinition {
  carrier: Carrier;
  productId: string;
  title?: string;
}
`
  );
});
