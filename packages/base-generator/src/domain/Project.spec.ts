import {Project} from './Project';
import {LayerType, LayerId} from './Layer';
import {ArchitectureType, TenancyType} from './Metadata';

describe('Project', () => {
  test('create', async () => {
    const layers = [
      {id: '1', name: 'Layer 1', type: LayerType.Domain},
      {id: '2', name: 'Layer 1 - Child 1', parent: 'Layer 1', type: LayerType.BoundedContext},
      {id: '3', name: 'Layer 1 - Child 1 - SubChild 1', parent: 'Layer 1 - Child 1', type: LayerType.Entity},
      {id: '4', name: 'Layer 1 - Child 1 - SubChild 2', parent: 'Layer 1 - Child 1', type: LayerType.Entity},
      {id: '5', name: 'Layer 1 - Child 2', parent: 'Layer 1', type: LayerType.Aggregate},
    ];
    const project = Project.create({
      metadata: {
        name: 'Test',
        version: '1.0.0',
        description: 'Test',
        initialVersion: '1.0.0',
        architectureType: ArchitectureType.Monolithic,
        tenancyType: TenancyType.SingleTenant
      },
      layers
    });
    expect(project.getLayerById(new LayerId('2')).toJSON()).toEqual({
      id: '2',
      "name": "Layer 1 - Child 1",
      "parent": "Layer 1",
      "type": "bounded-context"
    });
    expect(project.listLayers.map(i => i.toJSON())).toEqual([
      {
        id: '1',
        "name": "Layer 1",
        "type": "domain"
      },
      {
        id: '2',
        "name": "Layer 1 - Child 1",
        "parent": "Layer 1",
        "type": "bounded-context"
      },
      {
        id: '3',
        "name": "Layer 1 - Child 1 - SubChild 1",
        "parent": "Layer 1 - Child 1",
        "type": "entity"
      },
      {
        id: '4',
        "name": "Layer 1 - Child 1 - SubChild 2",
        "parent": "Layer 1 - Child 1",
        "type": "entity"
      },
      {
        id: '5',
        "name": "Layer 1 - Child 2",
        "parent": "Layer 1",
        "type": "aggregate"
      }
    ]);
    expect(project.layers[0].toJSON()).toEqual({
      id: '1',
      "name": "Layer 1",
      "type": "domain",
    });
    expect(project.layers[0].layers[0].toJSON()).toEqual({
      id: '2',
      "name": "Layer 1 - Child 1",
      "parent": "Layer 1",
      "type": "bounded-context",
    });
    expect(project.layers[0].layers[1].toJSON()).toEqual({
      id: '5',
      "name": "Layer 1 - Child 2",
      "parent": "Layer 1",
      "type": "aggregate",
    });
  });
  test('changeParent', async () => {
    const layers = [
      {id: '1', name: 'Layer 1', type: LayerType.Domain},
      {id: '2', name: 'Layer 1 - Child 1', parent: 'Layer 1', type: LayerType.BoundedContext},
      {id: '3', name: 'Layer 1 - Child 1 - SubChild 1', parent: 'Layer 1 - Child 1', type: LayerType.Entity},
      {id: '4', name: 'Layer 1 - Child 2', parent: 'Layer 1', type: LayerType.Aggregate},
    ];
    const project = Project.create({
      metadata: {
        name: 'Test',
        version: '1.0.0',
        description: 'Test',
        initialVersion: '1.0.0',
        architectureType: ArchitectureType.Monolithic,
        tenancyType: TenancyType.SingleTenant
      },
      layers
    });
    const node1 = project.getLayerById(new LayerId('3'));
    const node2 = project.getLayerById(new LayerId('4'));
    project.changeParent(node1, node2);
    expect(project.getLayerById(new LayerId('3')).toJSON()).toEqual({
      id: '3',
      "name": "Layer 1 - Child 1 - SubChild 1",
      "parent": "Layer 1 - Child 2",
      "type": "entity"
    });
  });
});
