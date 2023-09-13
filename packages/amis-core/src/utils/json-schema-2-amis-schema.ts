function property2control(property: any, key: any, schema: any) {
  const requiredList = schema.required || [];
  const rest: any = {};
  const validations: any = {};
  let type = 'text';

  if (property.type === 'integer') {
    type = 'number';

    typeof property.minimum === 'number' && (rest.min = property.minimum);
    // property.max
  } else if (property.type === 'array') {
    type = 'combo';
    const items = property.items;

    if (items.type === 'object') {
      rest.controls = makeControls(items.properties, items);
      rest.multiLine = true;
    } else {
      type = 'array';
      rest.inline = true;
      rest.items = property2control(items, 'item', property);
    }
  } else if (property.type === 'string' && Array.isArray(property.enum)) {
    type = 'select';
    rest.options = property.enum;
  }

  if (typeof property.minimum === 'number') {
    validations.minimum = property.minimum;
  }

  return {
    name: key,
    type,
    required: !!~requiredList.indexOf(key),
    label: property.title || property.description,
    desc: property.title && property.description,
    value: property.default,
    validations,
    ...rest
  };
}

function makeControls(properties: any, schema: any) {
  const keys = Object.keys(properties);
  return keys.map(key => property2control(properties[key], key, schema));
}

export function JSONSchme2AMisSchema(schema: any) {
  if (schema.type !== 'object') {
    throw new Error('JSONSchme2AMisSchema 只支持 object 转换');
  }

  return {
    title: schema.title,
    type: 'form',
    mode: 'horizontal',
    controls: makeControls(schema.properties, schema)
  };
}
