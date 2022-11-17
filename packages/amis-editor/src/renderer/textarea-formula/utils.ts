import {isExpression, resolveVariableAndFilter} from 'amis-core';

/**
 * 从amis数据域中取变量数据
 * @param node
 * @param manager
 * @returns
 */
export async function resolveVariablesFromScope(node: any, manager: any) {
  await manager?.getContextSchemas(node);
  const dataPropsAsOptions = manager?.dataSchema?.getDataPropsAsOptions();

  if (dataPropsAsOptions) {
    return dataPropsAsOptions
      .map((item: any) => ({
        selectMode: 'tree',
        ...item
      }))
      .filter((item: any) => item.children?.length);
  }
  return [];
}

/**
 * 整合 props & amis数据域 中的 variables
 * @param that  为组件的实例 this
 **/
export async function getVariables(that: any) {
  let variablesArr: any[] = [];
  const {variables, requiredDataPropsVariables} = that.props;
  if (!variables || requiredDataPropsVariables) {
    // 从amis数据域中取变量数据
    const {node, manager} = that.props.formProps || that.props;
    let vars = await resolveVariablesFromScope(node, manager);
    if (Array.isArray(vars)) {
      if (!that.isUnmount) {
        variablesArr = vars;
      }
    }
  }
  if (variables) {
    if (Array.isArray(variables)) {
      variablesArr = [...variables, ...variablesArr];
    } else if (typeof variables === 'function') {
      variablesArr = [...variables(that), ...variablesArr];
    } else if (isExpression(variables)) {
      variablesArr = [
        ...resolveVariableAndFilter(
          that.props.variables as any,
          that.props.data,
          '| raw'
        ),
        ...variablesArr
      ];
    }
  }

  return variablesArr;
}
