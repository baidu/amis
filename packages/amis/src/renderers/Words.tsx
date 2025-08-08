/**
 * @file Words
 */
import React, {Fragment} from 'react';
import {
  autobind,
  Renderer,
  RendererProps,
  Option,
  getTreeAncestors,
  resolveVariableAndFilter,
  labelToString,
  filter
} from 'amis-core';
import {BaseSchema, SchemaObject} from '../Schema';
import {Tag} from 'amis-ui';
import {TagSchema} from './Tag';
import {createObject} from 'amis-core';

type Words = string | string[];
/**
 * Words
 */
export interface WordsSchema extends BaseSchema {
  type: 'words';

  /**
   * 展示限制, 为0时也无限制
   */
  limit?: number;

  /**
   * 展示文字
   */
  expendButtonText?: string;

  /**
   * 展示文字
   */
  expendButton?: SchemaObject;

  /**
   * 收起文字
   */
  collapseButtonText?: string;

  /**
   * 展示文字
   */
  collapseButton?: SchemaObject;

  /**
   * tags数据
   */
  words: Words;

  /**
   * useTag 当数据是数组时，是否使用tag的方式展示
   */
  inTag?: boolean | TagSchema;

  /**
   * 分割符
   */
  delimiter?: string;

  /**
   * 标签模板
   */
  labelTpl?: string;
}

export interface WordsProps
  extends RendererProps,
    Omit<WordsSchema, 'type' | 'className'> {}

function getLabel(
  item: Option,
  index: number,
  {
    type,
    labelField = 'label',
    options = [],
    enableNodePath,
    hideNodePathLabel,
    pathSeparator = '/',
    labelTpl
  }: any
): string {
  if (enableNodePath || (type === 'nested-select' && !hideNodePathLabel)) {
    // 将所有祖先节点也展现出来
    const ancestors = getTreeAncestors(options, item, true);
    return `${
      ancestors
        ? ancestors
            .map(item => `${item[labelField || 'label']}`)
            .join(` ${pathSeparator} `)
        : item[labelField || 'label']
    }`;
  }

  const label = labelTpl
    ? filter(labelTpl, item)
    : labelToString(item[labelField]) || `选项${index}`;

  return label;
}

export class WordsField extends React.Component<WordsProps, object> {
  static defaultProps: Partial<WordsProps> = {
    inTag: false
  };

  state = {
    isExpend: false
  };

  @autobind
  toggleExpend() {
    this.setState({
      isExpend: !this.state.isExpend
    });
  }

  getLimit(words: Words) {
    const {limit} = this.props;
    return limit ?? (Array.isArray(words) ? 10 : 200);
  }

  @autobind
  handleItemClick(e: React.MouseEvent<HTMLSpanElement>) {
    const index = parseInt(e.currentTarget.dataset.index || '');
    const options = this.props.selectedOptions;

    if (Array.isArray(options)) {
      const item = options[index];
      if (item) {
        this.props.dispatchEvent(
          'staticItemClick',
          createObject(this.props.data, {item, index})
        );
      }
    }
  }

  renderContent(words: Words) {
    const {delimiter, inTag, classnames: cx} = this.props;

    // 纯文字展示
    if (!Array.isArray(words)) {
      return words;
    }

    // 不使用tag时，默认用 逗号连接
    if (!inTag) {
      const lastIndex = words.length - 1;
      return words.map((item, index) => {
        return (
          <span data-index={index} key={index} onClick={this.handleItemClick}>
            {labelToString(item)}
            {index === lastIndex ? '' : delimiter ? delimiter : '， '}
          </span>
        );
      });
    }

    return words.map((label, key) => (
      // 使用tag展示时，默认不使用连接符
      <Tag
        onClick={this.handleItemClick}
        key={key}
        label={label}
        className={'mb-1'}
        {...(typeof inTag === 'object'
          ? {...inTag, className: cx(inTag.className)}
          : undefined)}
        dataIndex={key}
      />
    ));
  }

  renderAll(words: Words, hasBtn = false) {
    const {collapseButtonText = '收起', collapseButton, render} = this.props;

    return (
      <>
        {this.renderContent(words)}
        {!hasBtn
          ? null
          : render(
              'collapseBtn',
              {
                type: 'button',
                level: 'link',
                className: 'ml-1 v-baseline'
              },
              {
                onClick: this.toggleExpend,
                ...collapseButton,
                label: collapseButtonText
              }
            )}
      </>
    );
  }

  renderPart(words: Words) {
    const {expendButtonText = '展开', expendButton, render} = this.props;

    const limit = this.getLimit(words);
    let partContent = Array.isArray(words)
      ? words.slice(0, limit)
      : words.toString().slice(0, limit);

    return (
      <>
        {this.renderContent(partContent)}
        &nbsp;...
        {render(
          'collapseBtn',
          {
            type: 'button',
            level: 'link',
            className: 'ml-1 v-baseline'
          },
          {
            onClick: this.toggleExpend,
            ...expendButton,
            label: expendButtonText
          }
        )}
      </>
    );
  }

  getWords() {
    const {selectedOptions = [], words: oldWords, data} = this.props;

    let words;
    if (typeof oldWords === 'string') {
      words = resolveVariableAndFilter(oldWords, data, '| raw');
    }

    if (words) {
      return words;
    }

    if (selectedOptions?.length > 0) {
      return selectedOptions.map((option: Option, index: number) =>
        getLabel(option, index, this.props)
      );
    }

    return null;
  }

  render() {
    const {classnames: cx, className, style} = this.props;

    const words = this.getWords();

    if (!words) {
      return null;
    }

    const limit = this.getLimit(words);
    let body;
    if (
      !limit ||
      (Array.isArray(words) && words.length <= limit) ||
      (!Array.isArray(words) && words.toString().length <= limit)
    ) {
      // 渲染全部，且无展开收起按钮
      body = this.renderAll(words);
    } else {
      body = this.state.isExpend
        ? this.renderAll(words, true)
        : this.renderPart(words);
    }

    return (
      <div className={cx('Words-field', className)} style={style}>
        {body}
      </div>
    );
  }
}

@Renderer({
  type: 'words'
})
export class WordsRenderer extends WordsField {}

@Renderer({
  type: 'tags'
})
export class TagsRenderer extends WordsField {
  static defaultProps = {
    inTag: true
  };
}
