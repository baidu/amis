import {isExpression, resolveVariableAndFilter} from 'amis-core';
import {translateSchema} from 'amis-editor-core';
import type {VariableItem} from 'amis-ui/lib/components/formula/Editor';
import {updateComponentContext} from '../../util';

/**
 * 从amis数据域中取变量数据
 * @param node
 * @param manager
 * @returns
 */
export async function resolveVariablesFromScope(node: any, manager: any) {
  await manager?.getContextSchemas(node);
  // 获取当前组件内相关变量，如表单、增删改查
  const dataPropsAsOptions: VariableItem[] = updateComponentContext(
    (await manager?.dataSchema?.getDataPropsAsOptions()) ?? []
  );

  const variables: VariableItem[] =
    manager?.variableManager?.getVariableFormulaOptions() || [];

  return [...dataPropsAsOptions, ...variables].filter(
    (item: any) => item.children?.length
  );
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
