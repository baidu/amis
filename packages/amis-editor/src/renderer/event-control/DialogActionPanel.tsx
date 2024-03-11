import {
  EditorManager,
  JSONGetById,
  JSONGetParentById,
  JSONPipeIn,
  JSONPipeOut,
  JSONUpdate,
  addModal,
  modalsToDefinitions
} from 'amis-editor-core';
import React from 'react';
import {observer} from 'mobx-react';
import {JSONTraverse, JSONValueMap, RendererProps} from 'amis-core';
import {Button, FormField, InputJSONSchema, Select, Switch} from 'amis-ui';
import type {EditorModalBody} from '../../../../amis-editor-core/src/store/editor';

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
  subscribeSchemaSubmit
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
        throw new Error('动作配置错误');
      }

      const actionSchema =
        rawActions[
          typeof actionIndex === 'undefined'
            ? rawActions.length - 1
            : actionIndex
        ];
      const modals: Array<LocalModal> = actionSchema.__actionModals;
      const currentModal = modals.find(item => item.isActive)!;

      schema = {...schema, definitions: {...schema.definitions}};
      // 可能编辑了其他弹窗，同时所选弹窗里面如果公用了弹窗
      // 会标记为 isModified
      modals
        .filter(
          item => item.isModified && item !== currentModal && item.modal.$$ref
        )
        .forEach(({modal}) => {
          const {$$originId: originId, ...def} = modal as any;
          if (originId) {
            const parent = JSONGetParentById(schema, originId);
            if (!parent) {
              // 找不到就丢回去，上层去处理
              def.$$originId = originId;
            } else {
              // TODO 这里要不要再加个判断？
              // 只更新当前动作中关联的弹窗？
              const modalType = def.type === 'drawer' ? 'drawer' : 'dialog';
              schema = JSONUpdate(schema, parent.$$id, {
                ...parent,
                __actionModals: undefined,
                args: undefined,
                dialog: undefined,
                drawer: undefined,
                actionType: def.actionType ?? modalType,
                [modalType]: JSONPipeIn({
                  $ref: modal.$$ref!
                })
              });
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
            originActionId = parent.$$id;
            newRefName = currentModal.modal.$$ref;
          } else {
            // 没找到很可能是在主页面里面的弹窗
            // 还得继续把 originId 给到上一层去处理
            schema.definitions[currentModal.modal.$$ref].$$originId = originInd;
          }
        }
      } else {
        // 选的是别的工作内嵌的弹窗
        // 需要把目标弹窗转成 definition
        // 然后都引用这个 definition
        let refKey: string = '';
        [schema, refKey] = addModal(schema, currentModal.modal);
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

      // 原来的动作也要更新
      if (originActionId && newRefName) {
        schema = JSONUpdate(
          schema,
          currentModal.value,
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
        data: modal.data
      };
    });

    let dialogId = dialogBody?.$$id || '';
    const ref = dialogBody?.$ref;
    if (ref) {
      dialogId = modals.find(item => item.modal.$$ref === ref)?.value || '';
    }

    // 初始化有问题的情况
    const newData: any = {};
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
        // 弹窗里面用到了才更新
        if (!refs.includes(key)) {
          return;
        }

        // 要修改就复制一份，避免污染原始数据
        if (arr === members) {
          arr = members.concat();
        }

        const {$$originId, ...modal} = definitions[key];
        const idx = arr.findIndex(item =>
          $$originId ? item.value === $$originId : item.modal.$$ref === key
        );
        const label = `${
          modal.editorSetting?.displayName || modal.title || '未命名弹窗'
        }`;
        const tip =
          (modal as any).actionType === 'confirmDialog'
            ? '确认框'
            : modal.type === 'drawer'
            ? '抽屉弹窗'
            : '弹窗';

        if (~idx) {
          arr.splice(idx, 1, {
            ...arr[idx],
            label: label,
            tip: tip,
            modal: {...modal, $$ref: key, $$originId},
            isModified: true
          });
        } else {
          if ($$originId) {
            throw new Error('Definition merge exception');
          }
          arr.push({
            label,
            tip,
            value: modal.$$id,
            modal: JSONPipeIn({
              ...modal,
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
      store.openSubEditor({
        title: '新建弹窗',
        value: {
          type: 'dialog',
          title: '未命名弹窗',
          body: [
            {
              type: 'tpl',
              tpl: '弹窗内容'
            }
          ],
          definitions: modalsToDefinitions(modals.map(item => item.modal))
        },
        onChange: ({definitions, ...modal}: any, diff: any) => {
          modal = JSONPipeIn(modal);
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
    store.openSubEditor({
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
        definitions: modalsToDefinitions(modals.map(item => item.modal))
      },
      onChange: ({definitions, ...modal}: any, diff: any) => {
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
              ? '不设置参数，打开弹窗将自动传递所有上下文数据'
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
              />
            ) : null}
          </div>
        </FormField>
      ) : null}
    </div>
  );
}

export default observer(DialogActionPanel);
