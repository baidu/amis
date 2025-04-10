import {
  EditorManager,
  JSONGetById,
  JSONGetParentById,
  JSONGetPathById,
  JSONPipeIn,
  JSONPipeOut,
  JSONUpdate,
  addModal,
  diff,
  getVariables,
  modalsToDefinitions,
  patchDiff
} from 'amis-editor-core';
import React from 'react';
import {observer} from 'mobx-react';
import {JSONTraverse, JSONValueMap, RendererProps, guid} from 'amis-core';
import {
  Button,
  FormField,
  InputBox,
  InputJSONSchema,
  Select,
  Switch
} from 'amis-ui';
import type {EditorModalBody} from 'amis-editor-core/lib/store/editor';

export interface DialogActionPanelProps extends RendererProps {
  manager: EditorManager;
  subscribeSchemaSubmit: (
    fn: (schema: any, value: any, id: string, diff?: any) => any,
    once?: boolean
  ) => () => void;
  subscribeActionSubmit: (fn: (value: any) => any) => () => void;
  addHook: (fn: Function, type?: 'validate' | 'init' | 'flush') => () => void;
}

export interface LocalModal {
  label: string;
  value: any;
  tip: string;
  modal: EditorModalBody;
  isNew?: boolean;
  isModified?: boolean;
  isActive?: boolean;

  // 是否被引用
  isRefered?: boolean;
  // 是否为当前动作内嵌的弹窗
  isCurrentActionModal?: boolean;

  /**
   * 传参配置
   */
  data?: any;
}

function DialogActionPanel({
  classnames: cx,
  render,
  data,
  manager,
  onChange,
  onBulkChange,
  node,
  addHook,
  subscribeSchemaSubmit,
  appLocale,
  appCorpusData
}: DialogActionPanelProps) {
  const eventKey = data.eventKey;

  if (!eventKey) {
    return <div>上下文数据错误</div>;
  }
  const actionIndex = data.actionIndex;

  const store = manager.store;
  const [modals, setModals] = React.useState<Array<LocalModal>>([]);
  const currentModal = modals.find(item => item.isActive);

  // 订阅由面板触发的 schema 变跟事件
  // 写入 store 之前执行，可以对 schema 进行修改
  React.useEffect(() => {
    subscribeSchemaSubmit((schema: any, nodeSchema: any, id: string) => {
      const rawActions = JSONGetById(schema, id)?.onEvent[eventKey]?.actions;
      if (!rawActions || !Array.isArray(rawActions)) {
        return;
      }

      const actionSchema =
        rawActions[
          typeof actionIndex === 'undefined'
            ? rawActions.length - 1
            : actionIndex
        ];
      const modals: Array<LocalModal> = actionSchema?.__actionModals;
      if (!Array.isArray(modals)) {
        // 不是编辑确定触发的，直接返回
        return schema;
      }

      const currentModal = modals.find(item => item.isActive)!;

      schema = {...schema, definitions: {...schema.definitions}};
      // 可能编辑了其他弹窗，同时所选弹窗里面如果公用了弹窗
      // 会标记为 isModified
      modals
        .filter(
          item => item.isModified && item !== currentModal && item.modal.$$ref
        )
        .forEach(({modal, isRefered}) => {
          const {$$originId: originId, ...def} = modal as any;
          if (originId) {
            const parent = JSONGetParentById(schema, originId);
            if (id === originId) {
              return;
            } else if (!parent) {
              // 找不到就丢回去，上层去处理
              def.$$originId = originId;
            } else if (isRefered === false) {
              const modalType = def.type === 'drawer' ? 'drawer' : 'dialog';

              // 这样处理是为了不要修改原来的 $$id
              const origin = parent[modalType] || {};
              const changes = diff(
                origin,
                modal,
                (path, key) => key === '$$id'
              );
              if (changes) {
                const newModal = patchDiff(origin, changes);
                delete newModal.$$originId;
                delete newModal.$$ref;
                schema = JSONUpdate(
                  schema,
                  parent.$$id,
                  {
                    ...parent,
                    __actionModals: undefined,
                    args: undefined,
                    dialog: undefined,
                    drawer: undefined,
                    actionType: def.actionType ?? modalType,
                    [modalType]: newModal
                  },
                  true
                );
              }

              // 不要写下面的 defintions 了
              return;
            } else {
              const modalType = def.type === 'drawer' ? 'drawer' : 'dialog';
              schema = JSONUpdate(
                schema,
                parent.$$id,
                {
                  ...parent,
                  __actionModals: undefined,
                  args: undefined,
                  dialog: undefined,
                  drawer: undefined,
                  actionType: def.actionType ?? modalType,
                  [modalType]: JSONPipeIn({
                    $ref: modal.$$ref!
                  })
                },
                true
              );
            }
          }
          schema.definitions[modal.$$ref!] = JSONPipeIn(def);
        });

      // 处理当前选中的弹窗
      let newActionSchema: any = null;
      const modalType =
        currentModal.modal.type === 'drawer' ? 'drawer' : 'dialog';
      let originActionId = null;
      let newRefName = '';

      if (currentModal.isCurrentActionModal) {
        // 选中的是当前动作内嵌的弹窗
        // 直接更新当前动作即可
        newActionSchema = {
          ...actionSchema,
          __actionModals: undefined,
          args: undefined,
          dialog: undefined,
          drawer: undefined,
          actionType: currentModal.modal.actionType ?? modalType,
          data: currentModal.data,
          [modalType]: {
            ...currentModal.modal,
            data: undefined
          }
        };
      } else if (currentModal.modal.$$ref) {
        // 选中的是引用的弹窗
        newActionSchema = {
          ...actionSchema,
          __actionModals: undefined,
          args: undefined,
          dialog: undefined,
          drawer: undefined,
          actionType: currentModal.modal.actionType ?? modalType,
          data: currentModal.data,
          [modalType]: {
            $ref: currentModal.modal.$$ref
          }
        };

        const originInd = (currentModal.modal as any).$$originId;
        // 可能弹窗内容更新了

        schema.definitions[currentModal.modal.$$ref] = JSONPipeIn({
          ...currentModal.modal,
          $$originId: undefined,
          $$ref: undefined
        });

        if (originInd) {
          const parent = JSONGetParentById(schema, originInd);
          if (parent && parent.actionType) {
            originActionId = originInd;
            newRefName = currentModal.modal.$$ref;
          } else {
            // 没找到很可能是在主页面里面的弹窗
            // 还得继续把 originId 给到上一层去处理
            schema.definitions[currentModal.modal.$$ref].$$originId = originInd;
            newActionSchema[modalType].$$originId = originInd;
          }
        }
      } else {
        // 选的是别的工作内嵌的弹窗
        // 需要把目标弹窗转成 definition
        // 然后都引用这个 definition
        let refKey: string = '';
        [schema, refKey] = addModal(schema, currentModal.modal);
        // 需要记录原始的弹窗 id，方便上层处理合并
        schema.definitions[refKey].$$originId = currentModal.modal.$$id;
        newActionSchema = {
          ...actionSchema,
          __actionModals: undefined,
          args: undefined,
          dialog: undefined,
          drawer: undefined,
          actionType: currentModal.modal.actionType ?? modalType,
          data: currentModal.data,
          [modalType]: JSONPipeIn({
            $ref: refKey
          })
        };

        originActionId = currentModal.value;
        newRefName = refKey;
      }

      schema = JSONUpdate(
        schema,
        actionSchema.$$id,
        JSONPipeIn(newActionSchema),
        true
      );

      // 自己就是个弹窗，可能有 definition 里面引用自己
      if (['dialog', 'drawer', 'confirmDialog'].includes(schema.type)) {
        const id = schema.$$originId || schema.$$id;
        Object.keys(schema.definitions).forEach(key => {
          const definition = schema.definitions[key];
          const exits = JSONGetById(definition, id);
          if (exits) {
            schema.definitions[key] = JSONUpdate(
              schema.definitions[key],
              id,
              {
                ...schema,
                definitions: undefined
              },
              true
            );
          }
        });
      }

      // 如果弹窗里面又弹窗指向自己，那么也要更新
      const currentModalId = currentModal.modal.$$id;
      let refIds: string[] = [];
      JSONTraverse(currentModal.modal, (value: any, key: string, host: any) => {
        if (key === '$ref' && host.$$originId === currentModalId) {
          refIds.push(host.$$id);
        }
      });
      if (refIds.length) {
        let refKey = '';
        [schema, refKey] = addModal(schema, currentModal.modal);
        schema = JSONUpdate(schema, actionSchema.$$id, {
          [modalType]: JSONPipeIn({
            $ref: refKey
          })
        });
        refIds.forEach(refId => {
          schema = JSONUpdate(schema, refId, {
            $ref: refKey,
            $$originId: undefined
          });
        });
      }

      // 原来的动作也要更新
      if (originActionId && newRefName) {
        schema = JSONUpdate(
          schema,
          originActionId,
          JSONPipeIn({
            $ref: newRefName
          }),
          true
        );
      }
      return schema;
    }, true);
  }, []);

  const [errors, setErrors] = React.useState<{
    dialog?: string;
    data?: string;
  }>({});
  React.useEffect(() => {
    const unHook = addHook((data: any): any => {
      const modals = data.__actionModals;
      if (!modals || !Array.isArray(modals)) {
        throw new Error('程序异常');
      }

      const currentModal = modals.find((item: any) => item.isActive);
      if (!currentModal) {
        setErrors({
          ...errors,
          dialog: '请选择一个弹窗'
        });

        return false;
      }

      const required = currentModal.modal.inputParams?.required;
      if (Array.isArray(required) && required.length) {
        if (!currentModal.data) {
          setErrors({
            ...errors,
            data: '参数不能为空'
          });

          return false;
        } else if (required.some(key => !currentModal.data[key])) {
          setErrors({
            ...errors,
            data: '参数中存在必填参数未赋值'
          });

          return false;
        }
      }

      // TODO 校验参数赋值是否满足了弹窗的参数要求
    }, 'validate');
    return () => unHook();
  }, []);

  // 初始化弹窗列表
  React.useEffect(() => {
    const actionSchema =
      typeof actionIndex === 'undefined'
        ? {}
        : node.schema?.onEvent[eventKey]?.actions?.[actionIndex];
    const dialogBody =
      actionSchema[
        actionSchema.actionType === 'drawer' ? 'drawer' : 'dialog'
      ] || actionSchema.args;

    const schema = store.schema;
    const modals: Array<LocalModal> = store.modals.map(modal => {
      const isCurrentActionModal = modal.$$id === dialogBody?.$$id;

      return {
        label: `${
          modal.editorSetting?.displayName || modal.title || '未命名弹窗'
        }${
          isCurrentActionModal
            ? '<当前动作内嵌弹窗>'
            : modal.$$ref
            ? ''
            : '<内嵌弹窗>'
        }`,
        tip:
          (modal as any).actionType === 'confirmDialog'
            ? '确认框'
            : modal.type === 'drawer'
            ? '抽屉弹窗'
            : '弹窗',
        value: modal.$$id,
        modal: modal,
        isCurrentActionModal,
        data: modal.data,
        // 当前编辑的弹窗不让再里面再次弹出
        disabled: modal.$$ref
          ? modal.$$ref === schema.$$ref
          : modal.$$id === schema.$$id
      };
    });

    let dialogId = dialogBody?.$$id || '';
    const ref = dialogBody?.$ref;
    if (ref) {
      dialogId = modals.find(item => item.modal.$$ref === ref)?.value || '';
    }

    // 初始化有问题的情况
    const newData: any = {
      // 目的是提到当前层，而不是在原型链上
      // 当前面板中要设置的值，都要初始来一下，否则可能会丢失
      waitForAction: data.waitForAction,
      outputVar: data.outputVar
    };
    // if (!dialogId) {
    //   dialogId = guid();
    //   const placeholder = {
    //     $$id: dialogId,
    //     type: 'dialog',
    //     title: '未命名弹窗',
    //     body: [
    //       {
    //         type: 'tpl',
    //         tpl: '弹窗内容'
    //       }
    //     ]
    //   };
    //   modals.push({
    //     label: '未命名弹窗<当前动作内嵌弹窗>',
    //     tip: '弹窗',
    //     value: dialogId,
    //     isCurrentActionModal: true,
    //     modal: placeholder
    //   });
    //   newData['dialog'] = placeholder;
    // }

    const arr = modals.map(item => ({
      ...item,
      isActive: dialogId === item.value,
      data:
        dialogId === item.value
          ? JSONPipeOut(actionSchema.data ?? item.data)
          : JSONPipeOut(item.data)
    }));
    setModals(arr);
    newData.__actionModals = arr;
    onBulkChange(newData);
  }, []);

  // 处理弹窗切换
  const handleDialogChange = React.useCallback(
    (option: any) => {
      const arr = modals.map(item => ({
        ...item,
        isActive: item.value === option.value
      }));
      onBulkChange({
        __actionModals: arr
      });
      setModals(arr);
      setErrors({
        ...errors,
        dialog: '',
        data: ''
      });
    },
    [modals]
  );

  // 打开子弹窗后，因为子弹窗里面可能会创建新弹窗，会在 defintions 里面
  // 所以需要合并一下
  const mergeDefinitions = React.useCallback(
    (members: Array<LocalModal>, definitions: any, modal: any) => {
      const refs: Array<string> = [];
      JSONTraverse(modal, (value, key) => {
        if (key === '$ref') {
          refs.push(value);
        }
      });

      let arr = members;
      Object.keys(definitions).forEach(key => {
        // 要修改就复制一份，避免污染原始数据
        if (arr === members) {
          arr = members.concat();
        }

        const {$$originId, ...definition} = definitions[key];

        // 当前弹窗不需要合并
        if (
          $$originId === modal.$$id ||
          (definition.$$ref && definition.$$ref === modal.$$ref)
        ) {
          return;
        }

        const idx = arr.findIndex(item =>
          $$originId
            ? (item.modal.$$originId || item.modal.$$id) === $$originId
            : item.modal.$$ref === key
        );
        const label = `${
          definition.editorSetting?.displayName ||
          definition.title ||
          '未命名弹窗'
        }`;
        const tip =
          (definition as any).actionType === 'confirmDialog'
            ? '确认框'
            : definition.type === 'drawer'
            ? '抽屉弹窗'
            : '弹窗';

        if (~idx) {
          arr.splice(idx, 1, {
            ...arr[idx],
            label: label,
            tip: tip,
            modal: {...definition, $$ref: key, $$originId},
            isModified: true,
            isRefered: refs.includes(key)
          });
        } else if (refs.includes(key)) {
          if ($$originId) {
            throw new Error('Definition merge exception');
          }
          arr.push({
            label,
            tip,
            value: definition.$$id,
            modal: JSONPipeIn({
              ...definition,
              $$ref: key
            }),
            isModified: true
          });
        }
      });

      return arr;
    },
    []
  );

  // 处理新建弹窗
  const handleDialogAdd = React.useCallback(
    (
      idx?: number | Array<number>,
      value?: any,
      skipForm?: boolean,
      closePopOver?: () => void
    ) => {
      const modal = {
        $$id: guid(),
        type: 'dialog',
        title: '未命名弹窗',
        body: [
          {
            type: 'tpl',
            tpl: '弹窗内容'
          }
        ],
        definitions: modalsToDefinitions(modals.map(item => item.modal))
      };
      const modalId = modal.$$id;
      manager.openSubEditor({
        title: '新建弹窗',
        value: modal,
        onDefinitionsChange: (definitions, originDefinitions, modal) => {
          // 不能变 $$id 如果有内部有引用，就找不到了
          modal = JSONPipeIn({...modal, $$id: modalId});
          let arr = modals.concat();
          if (!arr.some(item => item.isNew)) {
            arr.push({
              label: `${
                modal.editorSetting?.displayName || modal.title || '未命名弹窗'
              }`,
              tip:
                (modal as any).actionType === 'confirmDialog'
                  ? '确认框'
                  : modal.type === 'drawer'
                  ? '抽屉弹窗'
                  : '弹窗',
              isNew: true,
              isCurrentActionModal: true,
              value: modal.$$id,
              modal: modal
            });

            arr = mergeDefinitions(arr, definitions, modal);

            arr = arr.map(item => ({
              ...item,
              isActive: item.value === modal.$$id
            }));
          }
          setModals(arr);
          onBulkChange({__actionModals: arr});
          return false;
        }
      });
      closePopOver?.();
    },
    [modals]
  );

  // 处理编辑弹窗
  const handleDialogEdit = React.useCallback(() => {
    const currentModal = modals.find(item => item.isActive);
    if (!currentModal) {
      return;
    }
    manager.openSubEditor({
      title: '编辑弹窗',
      value: {
        type: 'dialog',
        title: '弹窗标题',
        body: [
          {
            type: 'tpl',
            tpl: '弹窗内容'
          }
        ],
        ...(currentModal.modal as any),
        definitions: modalsToDefinitions(
          modals.map(item => item.modal),
          {},
          currentModal.modal
        )
      },
      onDefinitionsChange: (definitions, originDefinitions, modal) => {
        // 编辑的时候不要修改 $$id
        modal = JSONPipeIn({...modal, $$id: currentModal.modal.$$id});
        let arr = modals.map(item =>
          item.value === currentModal.value
            ? {
                ...item,
                modal: modal,
                isModified: true,
                label: `${
                  modal.editorSetting?.displayName ||
                  modal.title ||
                  '未命名弹窗'
                }${item.isCurrentActionModal ? '<当前动作内嵌弹窗>' : ''}`,
                tip:
                  (modal as any).actionType === 'confirmDialog'
                    ? '确认框'
                    : modal.type === 'drawer'
                    ? '抽屉弹窗'
                    : '弹窗'
              }
            : item
        );
        arr = mergeDefinitions(arr, definitions, modal);
        setModals(arr);
        onBulkChange({__actionModals: arr});
        return false;
      }
    });
  }, [modals]);

  const handleDataSwitchChange = React.useCallback(
    (value: any) => {
      handleDataChange(value ? {} : undefined);
    },
    [modals]
  );

  const handleDataChange = React.useCallback(
    (value: any) => {
      let arr = modals.map(modal =>
        modal.isActive
          ? {
              ...modal,
              data: value
            }
          : modal
      );
      setModals(arr);
      onBulkChange({__actionModals: arr});
      setErrors({
        ...errors,
        data: ''
      });
    },
    [modals]
  );
  const handleWaitForActionChange = React.useCallback((value: any) => {
    onBulkChange({waitForAction: !!value});
  }, []);

  const handleOutputVarChange = React.useCallback((value: string) => {
    onBulkChange({outputVar: value});
  }, []);

  const hasRequired =
    Array.isArray(currentModal?.modal.inputParams?.required) &&
    currentModal!.modal.inputParams.required.length;
  React.useEffect(() => {
    if (hasRequired && !currentModal?.data) {
      handleDataChange({});
    }
  }, [hasRequired]);

  // 渲染弹窗下拉选项
  const renderMenu = React.useCallback((option: any, stats: any) => {
    return (
      <div className="flex w-full justify-between">
        <span>{option.label}</span>
        <span className="text-muted">{option.tip}</span>
      </div>
    );
  }, []);

  const formula: any = React.useMemo(() => {
    return {
      variables: () =>
        getVariables({
          props: {node, manager},
          appLocale,
          appCorpusData
        })
    };
  }, [node, manager]);

  return (
    <div className={cx('ae-DialogActionPanel')}>
      <FormField
        label="选择弹窗"
        mode="horizontal"
        isRequired
        hasError={!!errors.dialog}
        errors={errors.dialog}
      >
        <div
          className={cx(
            'Form-control Form-control--withSize Form-control--sizeLg'
          )}
        >
          <Select
            createBtnLabel="新建弹窗"
            value={currentModal?.value || ''}
            onChange={handleDialogChange}
            options={modals}
            creatable={!modals.some(item => item.isNew)}
            clearable={false}
            onAdd={handleDialogAdd}
            renderMenu={renderMenu}
          />

          {currentModal &&
          modals.some(
            modal =>
              modal.isCurrentActionModal &&
              !modal.isNew &&
              currentModal !== modal
          ) ? (
            <div className={cx('Alert Alert--warning mt-3')}>
              切换弹窗后原来的内嵌弹窗将会被删除
            </div>
          ) : null}

          {currentModal ? (
            <div className="m-t-sm">
              <Button size="sm" level="enhance" onClick={handleDialogEdit}>
                编辑选中弹窗
              </Button>
            </div>
          ) : null}
        </div>
      </FormField>
      {currentModal ? (
        <FormField
          label="参数赋值"
          mode="horizontal"
          hasError={!!errors.data}
          errors={errors.data}
          description={
            !currentModal.data
              ? '弹窗内参数赋值将优先取此处配置，若关闭配置或无配置值则会透传上下文数据。'
              : ''
          }
        >
          <div
            className={cx(
              'Form-control Form-control--withSize Form-control--sizeLg'
            )}
          >
            <Switch
              className="mt-2 m-b-xs"
              value={!!currentModal.data}
              onChange={handleDataSwitchChange}
              disabled={hasRequired}
            />

            {currentModal.data ? (
              <InputJSONSchema
                className="m-t-sm"
                value={currentModal.data}
                onChange={handleDataChange}
                schema={JSONPipeOut(currentModal.modal.inputParams)}
                addButtonText="添加参数"
                formula={formula}
              />
            ) : null}
          </div>
        </FormField>
      ) : null}

      <FormField
        label="等待弹窗"
        mode="horizontal"
        description={'当前打开弹窗动作结束后，才执行下一步动作'}
      >
        <div
          className={cx(
            'Form-control Form-control--withSize Form-control--sizeLg'
          )}
        >
          <Switch
            className="mt-2 m-b-xs"
            value={!!data.waitForAction}
            onChange={handleWaitForActionChange}
          />
        </div>
      </FormField>

      {data.waitForAction ? (
        <FormField
          label="响应结果"
          mode="horizontal"
          description={'弹窗动作结束后的出参变量名配置'}
        >
          <div
            className={cx(
              'Form-control Form-control--withSize Form-control--sizeLg'
            )}
          >
            <InputBox
              onChange={handleOutputVarChange}
              value={data.outputVar || ''}
              placeholder="请输入存储响应结果的变量名称"
            />
          </div>
        </FormField>
      ) : null}
    </div>
  );
}

export default observer(DialogActionPanel);
