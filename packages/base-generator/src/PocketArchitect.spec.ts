import PocketArchitect from "./PocketArchitect";

describe('PocketArchitect', () => {
  test('load', async () => {
    const res = await PocketArchitect.load(`${__dirname}/../../../.pocket-architect.json5`);
    // await PocketArchitect.write(`${__dirname}/../../../.pocket-architect.json`, res);

    expect(res.metadata.name).toEqual('MyApp');
    expect(res.parts[0].name).toEqual('main');
    expect(res.parts[1].name).toEqual('webservice1');

    expect(res.parts[0].parts[0].name).toEqual('applications');
  });
});
