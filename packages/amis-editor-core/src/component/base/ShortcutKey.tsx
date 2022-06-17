import React from 'react';
import {Modal, Icon} from 'amis';
import cx from 'classnames';
import {autobind} from '../../util';

export interface ShortcutKeyProps {
  title?: string;
  size?: string;
  closeOnEsc?: boolean;
  closeOnOutside?: boolean;
  ShortcutKeyList?: Array<ShortcutKeyItem>
}

interface ShortcutKeyItem {
  title: string;
  letters: Array<string>;
  tooltip?: string;
}

export interface ShortcutKeyStates {
  visible: boolean;
}

const ShortcutKeyList = [
  {
    title: '重做',
    letters: ['⌘', 'Shift', 'z'],
    tooltip: '恢复上一次撤销的操作'
  },
  {
    title: '撤销',
    letters: ['⌘', 'z'],
    tooltip: '恢复上一次撤销的操作'
  },
  {
    title: '保存',
    letters: ['⌘', 's'],
    tooltip: '保存当前所有操作'
  },
  {
    title: '复制',
    letters: ['⌘', 'c'],
    tooltip: '复制当前选中元素'
  },
  {
    title: '粘贴',
    letters: ['⌘', 'v'],
    tooltip: '将复制的元素插入到当前选中节点'
  },
  {
    title: '剪切',
    letters: ['⌘', 'x'],
    tooltip: '剪切当前选中元素'
  },
  {
    title: '删除',
    letters: ['Delete'],
    tooltip: '删除当前节点'
  },
  {
    title: '删除',
    letters: ['Backspace'],
    tooltip: '删除当前节点'
  },
  {
    title: '预览',
    letters: ['⌘', 'p'],
    tooltip: '开启预览模式'
  },
  {
    title: '向上移动',
    letters: ['⌘', '↑'],
    tooltip: '向上移动当前节点'
  },
  {
    title: '向下移动',
    letters: ['⌘', '↓'],
    tooltip: '向下移动当前节点'
  },
]

export default class ShortcutKey extends React.Component<
  ShortcutKeyProps,
  ShortcutKeyStates
> {

  constructor(props: any) {
    super(props);

    this.state = {
      visible: false
    };
  }

  @autobind
  closeShortcutKeyModal() {
    this.setState({
      visible: false
    });
  }

  @autobind
  showShortcutKeyModal() {
    this.setState({
      visible: true
    });
  }

  render() {
    const {title, size, closeOnEsc, closeOnOutside} = this.props;
    const curShortcutKeyList = this.props.ShortcutKeyList || ShortcutKeyList;

    return (
      <>
      <div className="shortcut-icon-btn" editor-tooltip='点击查看当前可用快捷键' tooltip-position="bottom">
        <Icon icon="editor-shortcut" onClick={this.showShortcutKeyModal} />
      </div>
      <Modal
        size={size || 'xs'}
        show={this.state.visible}
        closeOnEsc={closeOnEsc ?? true}
        closeOnOutside={closeOnOutside ?? true}
        onHide={this.closeShortcutKeyModal}
        contentClassName="shortcut-list-modal"
      >
        <div className='shortcut-modal-header'>
          <div className='shortcut-modal-title'>{title || '当前可用快捷键'}</div>
          <Icon icon="close" className="shortcut-modal-icon" onClick={this.closeShortcutKeyModal} />
        </div>
        <div className='shortcut-modal-body'>
          {
            curShortcutKeyList && curShortcutKeyList.length > 0 && (
              <div className='shortcut-list'>
                {curShortcutKeyList.map((shortcutKey: ShortcutKeyItem, index: number) => {
                  return (
                    <div className='shortcut-item' key={index}>
                      {
                        shortcutKey.tooltip && (
                          <div className='shortcut-title' editor-tooltip={shortcutKey.tooltip}>{shortcutKey.title}</div>
                        )
                      }
                      {
                        !shortcutKey.tooltip && (
                          <div className='shortcut-title'>{shortcutKey.title}</div>
                        )
                      }
                      <div className='shortcut-letters'>
                      {shortcutKey.letters.map((letter: string) => {
                        return (
                          <div className='shortcut-letter' key={letter}>
                            {letter}
                          </div>
                        );
                      })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          }
          {
            !curShortcutKeyList || curShortcutKeyList.length === 0 && (
              <span>暂无快捷键</span>
            )
          }
        </div>
      </Modal>
      </>
    );
  }
}
