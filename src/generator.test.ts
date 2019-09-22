/* eslint-disable max-lines-per-function */
import { StringDictionary, generate } from "./generator";
import { readFileSync } from "fs";

describe("read pricing.yml", () => {
  let result: StringDictionary;

  beforeAll(() => {
    result = generate("test/pricing.yml");
  });

  test("read pricing.yml", () => {
    const expected = readFileSync("test/Carrier.ts.expected", {
      encoding: "utf8"
    });

    expect(result["Carrier.ts"]).toEqual(expected);
  });

  test("ProductDefinition", () => {
    const expected = readFileSync("test/ProductDefinition.ts.expected", {
      encoding: "utf8"
    });
    expect(result["ProductDefinition.ts"]).toEqual(expected);
  });
});
