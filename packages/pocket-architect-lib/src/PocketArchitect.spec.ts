import PocketArchitect from "./PocketArchitect";

describe('PocketArchitect', () => {
  test('load', async () => {
    const res = await PocketArchitect.load(`${__dirname}/../../../json/pocket.json5`);

    expect(res.application.name).toEqual('MyApp');
    expect(res.toJson()).toEqual({});
  });
});
