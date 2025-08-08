import React from 'react';
import {GlobalVariableItem, noop, guid} from 'amis-core';
import {PanelProps, SchemaForm, EditorManager} from 'amis-editor-core';
import {observer} from 'mobx-react';
import {Alert2, Button, ConfirmBox, LazyComponent, Spinner} from 'amis-ui';
import {confirm} from 'amis';
import {Icon} from '../../icons/index';

type PanelComponentProps = {
  value: GlobalVariableItem;
  onChange: (value: GlobalVariableItem) => void;
};

export interface GlobalVarItemInEditor extends Omit<GlobalVariableItem, 'id'> {
  id: string | number;
}

/**
 * 全局变量管理面板
 */
export interface globalVarPanel {
  /**
   * 变量类型，不通的变量类型配置面板不一样
   */
  type: string | 'builtin';

  /**
   * 变量类型标题
   */
  title: string;

  /**
   * 变量类型描述
   */
  description?: string;

  renderBrief?: (value: GlobalVariableItem) => React.ReactNode;

  /**
   * 验证数据合法性
   * @param value
   * @returns
   */
  validate?: (
    value: GlobalVariableItem
  ) => string | void | Promise<string | void>;

  /**
   * 变量保存前支持数据格式化
   * @param value
   * @returns
   */
  pipeOut?: (value: GlobalVariableItem) => GlobalVariableItem;

  /**
   * 配置面板
   */
  component?: React.ComponentType<PanelComponentProps>;
  getComponent?: (
    manger: EditorManager
  ) => Promise<React.ComponentType<PanelComponentProps>>;
}

const globalVarPanels: Array<globalVarPanel> = [];

export function GlobalVarSubPanel(props: any) {
  const type = props.data.type || 'builtin';
  const panel = globalVarPanels.find(item => item.type === type);

  if (!panel) {
    return <Alert2 level="warning">未找到对应的变量类型配置面板</Alert2>;
  }

  const formRef = React.useRef<any>(null);

  // 父级表单提交的时候让子表单 flush
  // 否则子表单的值不会及时同步到父级表单
  React.useEffect(() => {
    const removeHook = props.addHook?.(
      () => formRef.current?.submit?.(),
      'flush'
    );

    return () => {
      removeHook?.();
    };
  }, []);

  return panel.component ? (
    <panel.component
      {...props}
      formLazyChange={false}
      formRef={formRef}
      value={props.data}
      onChange={props.onBulkChange}
    />
  ) : (
    <LazyComponent
      {...props}
      getComponent={panel.getComponent?.bind(panel, props.manager)}
      formLazyChange={false}
      formRef={formRef}
      value={props.data}
      onChange={props.onBulkChange}
    />
  );
}

export function registerGlobalVarPanel(
  type: string,
  panel: Omit<globalVarPanel, 'type'>
) {
  globalVarPanels.push({...panel, type});
}

export function unregisterGlobalVarPanel(type: string) {
  const idx = globalVarPanels.findIndex(item => item.type === type);
  if (~idx) {
    globalVarPanels.splice(idx, 1);
  }
}

export interface GlobalVarMangerProps extends PanelProps {}

export const GlobalVarManger = observer((props: GlobalVarMangerProps) => {
  const {store, manager} = props;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [variableItem, setVariableItem] =
    React.useState<Partial<GlobalVariableItem> | null>(null);
  const [isOpened, setIsOpened] = React.useState<boolean>(false);

  const handleAddVariable = React.useCallback(async () => {
    setIsOpened(true);
    try {
      setLoading(true);
      const detail = await manager.getGlobalVariableDetail({});
      setVariableItem(detail);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleVariableChange = React.useCallback((value: any) => {
    // 啥也不干
    // 不外部控制了，直接让内部控制
  }, []);

  const handleUpdate = React.useCallback((e: React.UIEvent<any>) => {
    const index = parseInt(
      (e.target as HTMLElement)
        .closest('.ae-GlobalVarItem')!
        .getAttribute('data-index')!,
      10
    );
    const item = store.globalVariables[index];
    setVariableItem({...item});
    setIsOpened(true);
  }, []);

  const handleDelete = React.useCallback(async (e: React.UIEvent<any>) => {
    const index = parseInt(
      (e.target as HTMLElement)
        .closest('.ae-GlobalVarItem')!
        .getAttribute('data-index')!,
      10
    );
    const item = store.globalVariables[index];

    const confirmed = await confirm('确认删除该全局变量？');
    if (!confirmed) {
      return;
    }

    setLoading(true);
    manager
      .deleteGlobalVariable(item)
      .then(() => {
        const variables = store.globalVariables.concat();
        variables.splice(index, 1);
        store.setGlobalVariables(variables);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleModalConfirm = React.useCallback(async (value: any) => {
    try {
      setLoading(true);
      const type = value.type || 'builtin';
      const panel = globalVarPanels.find(item => item.type === type);
      if (!panel) {
        throw new Error('未找到对应的变量类型配置面板');
      }

      if (
        store.globalVariables.some(
          item => item.key === value.key && item.id !== value.id
        )
      ) {
        throw new Error('变量名已存在');
      }

      await panel.validate?.(value);
      value = {...value}; // make it immutable
      value = panel.pipeOut?.(value) || value;
      value = await manager.saveGlobalVariable(value);

      if (!value.id) {
        value.id = guid();
      }

      const variables = store.globalVariables.concat();
      const idx = value.id
        ? variables.findIndex(item => item.id === value.id)
        : -1;
      if (~idx) {
        variables[idx] = value;
      } else {
        variables.push(value);
      }
      store.setGlobalVariables(variables);
      setIsOpened(false);
    } finally {
      setLoading(false);
    }

    return value;
  }, []);

  const handleModalClose = React.useCallback(() => {
    setIsOpened(false);
  }, []);

  // 初始化全局变量
  React.useEffect(() => {
    setLoading(true);
    let mounted = true;
    manager.initGlobalVariables().finally(() => {
      mounted && setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const schema = React.useMemo(() => {
    const body: any[] = [];

    if (globalVarPanels.length > 1) {
      body.push({
        type: 'button-group-select',
        name: 'type',
        label: '变量类型',
        value: 'builtin',
        options: globalVarPanels.map(item => ({
          label: item.title,
          value: item.type
        }))
      });
    }

    body.push({
      component: GlobalVarSubPanel
    });

    return {
      type: 'form',
      mode: 'horizontal',
      horizontal: {
        left: 2
      },
      body: body,
      submitOnChange: false,
      appendSubmitBtn: false,
      actions: []
    };
  }, []);

  return (
    <div className="ae-GlobalVarManager">
      {store.globalVariables.length ? (
        <ul>
          {store.globalVariables.map((item, index) => {
            return (
              <li key={item.id} data-index={index} className="ae-GlobalVarItem">
                <div className="ae-GlobalVarItem-info">
                  {item.label || item.key}
                </div>
                <div className="ae-GlobalVarItem-actions">
                  <Button iconOnly onClick={handleUpdate}>
                    <Icon icon="edit" className="icon" />
                  </Button>

                  <Button iconOnly onClick={handleDelete}>
                    <Icon icon="remove" className="icon" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="ae-GlobalVarManager-empty">暂无</div>
      )}

      <Spinner overlay key="info" size="lg" show={loading} />

      <ConfirmBox
        title={variableItem?.id ? '编辑全局变量' : '新增全局变量'}
        type={'dialog'}
        size={'md'}
        onConfirm={handleModalConfirm}
        show={isOpened}
        onCancel={handleModalClose}
      >
        {
          (({bodyRef, loading, popOverContainer}: any) => (
            <SchemaForm
              {...schema}
              key={variableItem?.id}
              value={variableItem}
              onChange={handleVariableChange}
              disabled={loading}
              ref={bodyRef}
              env={manager.env}
              manager={manager}
              popOverContainer={popOverContainer}
            />
          )) as any
        }
      </ConfirmBox>

      <Button
        onClick={handleAddVariable}
        className="ae-GlobalVarManager-AddBtn"
        block
        disabled={isOpened || loading}
      >
        新增全局变量
      </Button>
    </div>
  );
});

export function GlobalVarManagerPanel(props: any) {
  return (
    <div className="ae-GlobalVarPanel">
      <div className="panel-header">全局变量</div>
      <GlobalVarManger {...props} />
    </div>
  );
}
