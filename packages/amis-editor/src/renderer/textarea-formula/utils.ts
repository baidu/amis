import {isExpression, resolveVariableAndFilter} from 'amis-core';
import {translateSchema} from 'amis-editor-core';
import type {VariableItem} from 'amis-ui/lib/components/formula/Editor';

/**
 * 从amis数据域中取变量数据
 * @param node
 * @param manager
 * @returns
 */
export async function resolveVariablesFromScope(node: any, manager: any) {
  await manager?.getContextSchemas(node);
  const dataPropsAsOptions: VariableItem[] =
    manager?.dataSchema?.getDataPropsAsOptions();
  const variables: VariableItem[] =
    manager?.variableManager?.getVariableFormulaOptions() || [];

  if (dataPropsAsOptions) {
    // FIXME: 系统变量最好有个唯一标识符
    const systemVarIndex = dataPropsAsOptions.findIndex(
      item => item.label === '系统变量'
    );

    if (!!~systemVarIndex) {
      variables.forEach(item => {
        if (Array.isArray(item?.children) && item.children.length) {
          dataPropsAsOptions.splice(systemVarIndex, 0, item);
        }
      });
    } else {
      variables.forEach(item => {
        if (Array.isArray(item?.children) && item.children.length) {
          dataPropsAsOptions.push(item);
        }
      });
    }

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

  // 如果存在应用语言类型，则进行翻译
  if (that.appLocale && that.appCorpusData) {
    return translateSchema(variablesArr, that.appCorpusData);
  }

  return variablesArr;
}
