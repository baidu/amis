import {ClassNamesFn} from 'amis-core';
import {observer} from 'mobx-react';
import React from 'react';
import {EditorStoreType} from '../../store/editor';
import {translateSchema} from '../../util';
import {Button, Icon, ListMenu, PopOverContainer, confirm} from 'amis';

export interface DialogListProps {
  classnames: ClassNamesFn;
  store: EditorStoreType;
}

export default observer(function DialogList({
  classnames: cx,
  store
}: DialogListProps) {
  const modals = store.modals;

  const handleAddDialog = React.useCallback(() => {
    store.openSubEditor({
      title: '编辑弹窗',
      value: {
        type: 'dialog',
        title: '未命名弹窗',
        body: [
          {
            type: 'tpl',
            tpl: '弹窗内容'
          }
        ]
      },
      onChange: (value: any, diff: any) => {
        store.addModal(value);
      }
    });
  }, []);

  const handleEditDialog = React.useCallback((event: React.UIEvent<any>) => {
    const index = parseInt(event.currentTarget.getAttribute('data-index')!, 10);
    const dialog = store.modals[index];
    store.openSubEditor({
      title: '编辑弹窗',
      value: {
        type: 'dialog',
        ...(dialog as any)
      },
      onChange: (value: any, diff: any) => {
        store.updateModal(dialog.$$id!, value);
      }
    });
  }, []);

  const handleDelDialog = React.useCallback(
    async (event: React.UIEvent<any>) => {
      event.stopPropagation();
      event.preventDefault();

      const index = parseInt(
        event.currentTarget
          .closest('[data-index]')!
          .getAttribute('data-index')!,
        10
      );
      const dialog = store.modals[index];
      const refsCount = store.countModalActionRefs(dialog.$$id!);

      const confirmed = await confirm(
        refsCount
          ? `当前弹窗已关联 ${refsCount} 个事件，删除后，所配置的事件动作将一起被删除。`
          : '',
        `确认删除弹窗「${dialog.editorSetting?.displayName || dialog.title}」？`
      );

      if (confirmed) {
        store.removeModal(dialog.$$id!);
      }
    },
    []
  );

  return (
    <div className={cx('ae-DialogList-wrap', 'hoverShowScrollBar')}>
      <Button size="sm" level="enhance" block onClick={handleAddDialog}>
        新增弹窗
      </Button>
      {modals.length ? (
        <ul className="ae-DialogList">
          {modals.map((modal, index) => (
            <li
              className="ae-DialogList-item"
              data-index={index}
              key={modal.$$id || index}
              onClick={handleEditDialog}
            >
              <span>
                {`${
                  modal.editorSetting?.displayName ||
                  modal.title ||
                  '未命名弹窗'
                }`}
              </span>
              <a onClick={handleDelDialog} className="ae-DialogList-iconBtn">
                <Icon className="icon" icon="delete-bold-btn" />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="ae-DialogList-placeholder">暂无弹窗</div>
      )}
    </div>
  );
});
