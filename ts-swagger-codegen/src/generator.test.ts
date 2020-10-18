/* eslint-disable max-lines-per-function */
import { StringDictionary, generate } from "./generator";
import { readFileSync } from "fs";

describe("read pricing.yml", () => {
  let result: StringDictionary;

  beforeAll(() => {
    result = generate("test/pricing.yml");
  });

  const expectedDefinitions = [
    "Address",
    "Carrier",
    "Parcel",
    "PriceResult",
    "ProductDefinition",
    "Shipment",
    "ShipmentWithoutProduct"
  ];

  test("all definitions are mapped", () => {
    const expected = expectedDefinitions.map(d => `${d}.ts`).sort();
    expect(Object.keys(result).sort()).toEqual(expected);
  });

  expectedDefinitions.forEach(d => {
    test(d, () => {
      const expected = readFileSync(`test/${d}.ts.expected`, {
        encoding: "utf8"
      });

      expect(result[`${d}.ts`]).toEqual(expected);
    });
  });
});
