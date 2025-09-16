import {RendererProps} from 'amis-core';
import React, {useEffect, useState} from 'react';
import {InputJSONSchema} from 'amis-ui';
import {getVariables} from 'amis-editor-core';

interface OptionAutoFillProps extends RendererProps {
  value: any;
  onChange: (value: any) => void;

  // 编辑器里面的东西，用来获取上下文数据
  manager: any;
  node: any;
  formula: any;
}

export function OptionAutoFill(props: OptionAutoFillProps) {
  const {
    value,
    onChange,
    popOverContainer,
    className,
    node,
    manager,
    appLocale,
    appCorpusData,
    formula: propFormula
  } = props;
  const [variableSchema, setVariableSchema] = useState<any>({
    type: 'object',
    properties: {}
  });
  const formula: any = React.useMemo(() => {
    return (
      propFormula ?? {
        variables: async () => {
          const variables: Array<any> = await getVariables({
            props: {node, manager},
            appLocale,
            appCorpusData
          });
          // todo 根据接口返回的数据生成
          return [
            {
              label: '选项内数据(请根据实际数据自行填写)',
              children: [
                {
                  label: 'Label',
                  value: 'label'
                },
                {
                  label: 'Value',
                  value: 'value'
                }
              ]
            }
          ].concat(variables);
        }
      }
    );
  }, [manager, node, propFormula]);

  React.useEffect(() => {
    manager?.getContextSchemas(node, true).then((schemas: any) =>
      setVariableSchema(
        schemas.reduce(
          (schema: any, current: any) => {
            Object.assign(schema.properties, current.properties);
            delete schema.properties.$$id;
            return schema;
          },
          {
            type: 'object',
            properties: {}
          }
        )
      )
    );
    return;
  }, [manager, node]);

  return (
    <InputJSONSchema
      autoCreateMembers={false}
      className={className}
      value={value}
      onChange={onChange}
      schema={variableSchema}
      addButtonText="添加映射"
      formula={formula}
      popOverContainer={popOverContainer}
    />
  );
}

export default OptionAutoFill;
