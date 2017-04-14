/**
 * Written by Kun R <kun@lodestreams.com>, Thu Apr 13 2017
 */

class Schema {
  setTitle(title) {
    this.title = title;
    return this;
  }

  setType(type) {
    this.type = type;
    return this;
  }

  setProperties(properties) {
    this.properties = properties;
    return this;
  }

  setRequired(required) {
    this.required = required;
    return this;
  }

  setAdditionalProperties(additionalProperties) {
    this.additionalProperties = additionalProperties;
    return this;
  }

  static mapType(ramlType) {
    if (ramlType === 'integer') return 'number';

    if (['string', 'number', 'object', 'array', 'boolean', 'null'].indexOf(ramlType) >= 0) {
      return ramlType;
    } else {
      return 'string';
    }
  }

  async convertRamlPro2SchemaPro(ramlProperties) {
    if (!ramlProperties) return {};

    const properties = {};
    const required = [];

    Object.keys(ramlProperties).forEach(propertyName => {
      const ramlProperty = ramlProperties[propertyName];
      const property = {
        type: Schema.mapType(ramlProperty.type),
        description: ramlProperty.description,
        enum: ramlProperty.enum,
        pattern: ramlProperty.pattern
      };

      properties[ramlProperty.key] = property;

      if (ramlProperty.required) required.push(ramlProperty.key);
    });

    return {
      properties,
      required
    };
  }

  toJSON() {
    return {
      title: this.title,
      type: this.type,
      required: this.required,
      properties: this.properties,
      additionalProperties: this.additionalProperties
    };
  }
}

async function convert(typeObj) {
  const schema = new Schema();

  const properties = await schema.convertRamlPro2SchemaPro(typeObj['properties']);

  return schema.setTitle(typeObj.name)
    .setType(typeObj.type)
    .setAdditionalProperties(typeObj.additionalProperties)
    .setProperties(properties.properties)
    .setRequired(properties.required)
    .toJSON();
}

module.exports = convert;
