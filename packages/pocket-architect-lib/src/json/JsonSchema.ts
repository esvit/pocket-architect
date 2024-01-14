const SEMVER_REGEX = '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$';

export default {
  type: 'object',
  required: ['metadata', 'parts'],
  properties: {
    metadata: {
      type: 'object',
      required: ['name', 'initialVersion', 'version', 'architectureType', 'tenancyType'],
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        initialVersion: { type: 'string', pattern: SEMVER_REGEX },
        version: { type: 'string', pattern: SEMVER_REGEX },
        architectureType: { type: 'string', enum: ['monolith', 'multiservices'] },
        tenancyType: { type: 'string', enum: ['singletenant', 'multitenants'] },
      }
    },
    endpoints: {
      type: 'array',
      items: {
        type: 'object',
        required: ['operationName', 'partId', 'summary', 'url', 'method'],
        properties: {
          operationName: { type: 'string' },
          partId: { type: 'number' },
          entityId: { type: 'number' },
          summary: { type: 'string' },
          description: { type: 'string' },
          tag: { type: 'string' },
          url: { type: 'string' },
          method: { type: 'string', enum: ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'] },
        }
      }
    },
    parts: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'type'],
        properties: {
          parent: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          type: { type: 'string', enum: ['service', 'module', 'entity', 'valueObject'] },

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
                type: { type: 'string', enum: ['string', 'number', 'boolean', 'date', 'enum'] },
                mandatory: { type: 'boolean' },
                enum: { type: 'array', items: { type: 'string' } },
                description: { type: 'string' },
              },
            }
          },
          relationships: {
            type: 'array',
            items: {
              type: 'object',
              required: ['name', 'type', 'entity'],
              properties: {
                name: {type: 'string'},
                type: {type: 'string', enum: ['one', 'many']},
                entity: {type: 'string'},
                description: {type: 'string'},
              }
            }
          }
        }
      }
    }
  }
}