import {
  registerGlobalVariableHandler,
  GlobalVariableItemFull,
  GlobalVarContext,
  GlobalVariableItem
} from './globalVar';

function loadClientData(key: string, variables: Array<GlobalVariableItem>) {
  const str = localStorage.getItem(key);
  let data: any = {};

  try {
    data = JSON.parse(str || '{}');
  } catch (e) {
    console.error(`parse localstorage "${key} error"`, e);
  }

  let filterData: any = {};
  variables.forEach(item => {
    if (data.hasOwnProperty(item.key)) {
      filterData[item.key] = data[item.key];
    }
  });

  return filterData;
}

function saveClientData(
  key: string,
  values: any,
  variables: Array<GlobalVariableItem>
) {
  const str = localStorage.getItem(key);
  let data: any = {};

  try {
    data = JSON.parse(str || '{}');
  } catch (e) {
    console.error(`parse localstorage "${key} error"`, e);
  }
  Object.assign(data, values);
  localStorage.setItem(key, JSON.stringify(data));
}

function bulkClientGetter({variables}: GlobalVarContext) {
  return loadClientData('amis-client-vars', variables);
}

function bulkClientSetter(values: any, context: GlobalVarContext) {
  return saveClientData('amis-client-vars', values, context.variables);
}

function pageBulkClientGetter(context: GlobalVarContext) {
  const variables = context.variables;
  const key = `amis-client-vars-${context.pageId || location.pathname}`;
  return loadClientData(key, variables);
}

function pageBulkClientSetter(values: any, context: GlobalVarContext) {
  const key = `amis-client-vars-${context.pageId || location.pathname}`;
  return saveClientData(key, values, context.variables);
}

/**
 * 注册全局变量处理器，用来处理 storageOn 为 client 的变量
 *
 * 并且根据变量的 scope 来决定是 page 还是全局的
 *
 * 将数据存入 localStorage
 */
registerGlobalVariableHandler(function (
  variable,
  context
): GlobalVariableItemFull | void {
  if (variable.storageOn === 'client') {
    return {
      ...variable,
      bulkGetter:
        variable.scope === 'page' ? pageBulkClientGetter : bulkClientGetter,
      bulkSetter:
        variable.scope === 'page' ? pageBulkClientSetter : bulkClientSetter
    };
  }
});
