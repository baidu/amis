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
