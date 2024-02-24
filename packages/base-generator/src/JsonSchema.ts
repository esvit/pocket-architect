const SEMVER_REGEX = '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$';

export default {
  type: 'object',
  required: ['metadata', 'schema'],
  properties: {
    metadata: {
      type: 'object',
      required: ['name', 'initialVersion', 'version', 'architectureType', 'tenancyType'],
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        initialVersion: { type: 'string', pattern: SEMVER_REGEX },
        version: { type: 'string', pattern: SEMVER_REGEX },
        architectureType: { type: 'string', enum: ['monolithic', 'multiservices'] },
        tenancyType: { type: 'string', enum: ['singletenant', 'multitenants'] },
      }
    },
    apps: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'generator'],
        properties: {
          name: { type: 'string' },
          generator: { type: 'string' },
          options: { type: 'object' }
        }
      }
    },
    schema: {
      type: 'object',
      required: ['objects', 'relations'],
      properties: {
        objects: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name', 'type'],
            properties: {
              parentId: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              type: { type: 'string', enum: ['service', 'bounded-context', 'entity', 'value-object', 'domain', 'aggregate'] },

              attributes: {
                type: 'array',
                items: {
                  type: 'object',
                  if: {
                    properties: { type: { "enum": ["enum"] } }
                  }, then: {
                    required: ["enum"]
                  }, else: {
                    required: ['name', 'type']
                  },
                  properties: {
                    name: { type: 'string' },
                    type: { type: 'string', enum: ['id', 'string', 'number', 'boolean', 'date', 'enum'] },
                    mandatory: { type: 'boolean' },
                    enum: { type: 'array', items: { type: 'string' } },
                    description: { type: 'string' },
                  },
                }
              },
              methods: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['name', 'parameters', 'return'],
                  properties: {
                    name: { type: 'string' },
                    type: { type: 'string', enum: ['command', 'query'] },
                    description: { type: 'string' },
                    parameters: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['name', 'type'],
                        properties: {
                          name: { type: 'string' },
                          type: { type: 'string', enum: ['string', 'number', 'boolean', 'date', 'enum'] },
                          mandatory: { type: 'boolean' },
                          enum: { type: 'array', items: { type: 'string' } },
                          description: { type: 'string' },
                        },
                      }
                    },
                    return: {
                      type: 'object',
                      required: ['type'],
                      properties: {
                        type: { type: 'string', enum: ['string', 'number', 'boolean', 'date', 'enum'] },
                        enum: { type: 'array', items: { type: 'string' } },
                        description: { type: 'string' },
                      }
                    }
                  }
                }
              }
            }
          }
        },
        relations: {
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'name', 'type', 'source', 'target'],
            properties: {
              id: {type: 'string'},
              name: {type: 'string'},
              type: {type: 'string', enum: ['1:1', 'n:n', '1:n', 'n:1']},
              source: {type: 'object'},
              target: {type: 'object'},
              description: {type: 'string'},
            }
          }
        }
      }
    }
  }
}
