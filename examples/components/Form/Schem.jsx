import React from 'react';
import TitleBar from 'amis/components/TitleBar';
import {render} from 'amis';

const Schema = {
  title: 'Person',
  type: 'object',
  properties: {
    firstName: {
      title: 'First Name',
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    age: {
      description: 'Age in years',
      type: 'integer',
      minimum: 0
    },
    tag: {
      type: 'array',
      description: 'Tags',
      default: ['IT'],
      items: {
        type: 'text'
      }
    },

    clients: {
      type: 'array',
      description: 'Tags',
      items: {
        type: 'object',
        properties: {
          firstName: {
            title: 'First Name',
            type: 'string'
          },
          lastName: {
            type: 'string'
          }
        }
      }
    }
  },
  required: ['firstName', 'lastName']
};

function property2control(property, key, schema) {
  const requiredList = schema.required || [];
  const rest = {};
  const validations = {};
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

function makeControls(properties, schema) {
  const keys = Object.keys(properties);
  return keys.map(key => property2control(properties[key], key, schema));
}

function JSONSchme2AMisSchema(schema) {
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

const amisFormSchema = JSONSchme2AMisSchema(Schema);

export default class JSONSchemaForm extends React.Component {
  state = {
    data: {}
  };

  renderForm() {
    return render({
      type: 'page',
      title: '',
      body: {
        ...amisFormSchema,
        onChange: values =>
          this.setState({
            data: {
              ...values
            }
          })
      }
    });
  }

  render() {
    return (
      <div>
        <TitleBar title="JSON Schema Form" />
        <div className="wrapper">
          <div>
            <h3>Schema</h3>
            <pre>
              <code>{JSON.stringify(Schema, null, 2)}</code>
            </pre>
          </div>

          <div>
            <h3>Form</h3>
            {this.renderForm()}
          </div>

          <div>
            <h3>Data</h3>
            <pre>
              <code>{JSON.stringify(this.state.data, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>
    );
  }
}
