import React from 'react';
import {modalsToDefinitions} from 'amis-editor-core';
import {registerActionPanel} from '../../actionsPanelManager';
import DialogActionPanel from '../../DialogActionPanel';
import {TooltipWrapper} from 'amis';

const modalDescDetail: (info: any, context: any, props: any) => any = (
  info,
  {eventKey, actionIndex},
  props: any
) => {
  const {
    actionTree,
    actions: pluginActions,
    commonActions,
    allComponents,
    node,
    manager
  } = props;
  const store = manager.store;
  const modals = store.modals;
  const onEvent = node.schema?.onEvent;
  const action = onEvent?.[eventKey].actions?.[actionIndex];
  const actionBody =
    action?.[action?.actionType === 'drawer' ? 'drawer' : 'dialog'];
  let modalId = actionBody?.$$id;
  if (actionBody?.$ref) {
    modalId =
      modals.find((item: any) => item.$$ref === actionBody.$ref)?.$$id || '';
  }
  const modal = modalId
    ? manager.store.modals.find((item: any) => item.$$id === modalId)
    : '';
  if (modal) {
    const desc =
      modal.editorSetting?.displayName || modal.title || '未命名弹窗';
    return (
      <>
        <div className="action-desc">
          打开&nbsp;
          <span className="desc-tag variable-left variable-right">
            <TooltipWrapper
              rootClose
              placement="top"
              tooltip={`${desc}，点击查看弹窗配置`}
              tooltipClassName="ae-event-item-header-tip"
            >
              <a
                href="#"
                className="component-action-tag"
                onClick={(e: React.UIEvent<any>) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const modalId = modal.$$id;
                  const modalSchema =
                    store.modals.find((item: any) => item.$$id === modalId) ||
                    modal;
                  manager.openSubEditor({
                    title: '编辑弹窗',
                    value: {
                      type: 'dialog',
                      ...modalSchema,
                      definitions: modalsToDefinitions(store.modals, {}, modal)
                    },
                    onDefinitionsChange: (
                      definitions: any,
                      originDefinitions: any,
                      modal: any
                    ) => {
                      store.updateModal(modalId, modal, definitions);
                      return false;
                    }
                  });
                }}
              >
                {desc}
              </a>
            </TooltipWrapper>
          </span>
          &nbsp;
          {(modal as any).actionType === 'confirmDialog'
            ? '确认框'
            : modal.type === 'drawer'
            ? '抽屉弹窗'
            : '弹窗'}
        </div>
      </>
    );
  } else if (Array.isArray(info.__actionModals)) {
    const modal = info.__actionModals.find((item: any) => item.isActive);
    if (modal) {
      // 这个时候还不能打开弹窗，schema 还没插入进去不知道 $$id，无法定位
      return (
        <>
          <div className="action-desc">
            打开
            <span className="variable-left">{modal.label}</span>
            &nbsp;
            {modal.tip}
          </div>
        </>
      );
    }
  }

  return null;
};

registerActionPanel('openDialog', {
  label: '打开弹窗',
  tag: '弹窗消息',
  description: '打开弹窗，弹窗内支持复杂的交互设计',
  actions: [
    {
      actionType: 'dialog',
      descDetail: modalDescDetail
    },
    {
      actionType: 'drawer',
      descDetail: modalDescDetail
    },
    {
      actionType: 'confirmDialog',
      descDetail: modalDescDetail
    }
  ],
  schema: [
    {
      component: DialogActionPanel
    }
  ]
});
