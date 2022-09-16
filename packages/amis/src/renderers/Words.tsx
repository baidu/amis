/**
 * @file Words
 */
import React, {Fragment} from 'react';
import {autobind, Renderer, RendererProps, Option, getTreeAncestors} from 'amis-core';
import {BaseSchema} from '../Schema';
import {PlainObject} from '../types';
import {Tag} from 'amis-ui';

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
  expendButton?: PlainObject;

  /**
   * 收起文字
   */
  collapseButtonText?: string;

  /**
   * 展示文字
   */
  collapseButton?: PlainObject;

  /**
  * tags数据
  */
  words: Words;

  /**
   * useTag 当数据是数组时，是否使用tag的方式展示
   */
  inTag?: boolean | PlainObject;

  /**
     * 分割符
     */
  delimiter?: string | JSX.Element;
}

export interface WordsProps
  extends RendererProps,
    Omit<WordsSchema, 'type' | 'className'> {}

function getLabel(item: Option, index: number, {
  type,
  labelField = 'label',
  options = [],
  enableNodePath,
  hideNodePathLabel,
  pathSeparator = '/',
}: any): string {
  if (enableNodePath
      || (type === 'nested-select' && !hideNodePathLabel)
  ){
      // 将所有祖先节点也展现出来
    const ancestors = getTreeAncestors(options, item, true);
    return `${
      ancestors
        ? ancestors.map(item => `${item[labelField || 'label']}`).join(` ${pathSeparator} `)
        : item[labelField || 'label']
    }`;
  }

  return item[labelField] || `选项${index}`;
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

  renderContent(words: Words) {
    const {
      delimiter,
      inTag
    } = this.props;

    console.log(words, this.props);

    // 纯文字展示
    if (!Array.isArray(words)) {
      return words;
    }

    // 不使用tag时，默认用 逗号连接
    if (!inTag) {
      return words.map((item, key) => {
        return <Fragment key={key}>
          {item}
          {delimiter ? delimiter : '， '}
        </Fragment>
      })
    }

    return words.map((label, key) => (
      // 使用tag展示时，默认不使用连接符
      <Tag
        key={key}
        label={label}
        className={'mb-1'}
        {...typeof inTag === 'object' ? inTag : undefined}
      ></Tag>
    ));
  }

  renderAll(words: Words, hasBtn = false) {
    const {
      collapseButtonText = '收起',
      collapseButton,
      render
    } = this.props;

    return (
      <>
        {this.renderContent(words)}
        {!hasBtn ? null :
          render('collapseBtn', {
            type: 'button',
            level: 'link',
            className: 'ml-1'
          }, {
            onClick: this.toggleExpend,
            ...collapseButton,
            label: collapseButtonText
          })
        }
      </>
    );
  }

  renderPart(words: Words) {
    const {
      expendButtonText = '展开',
      expendButton,
      render
    } = this.props;

    const limit = this.getLimit(words);
    let partContent = Array.isArray(words)
      ? words.slice(0, limit)
      : words.toString().slice(0, limit);

    return (
      <>
        {this.renderContent(partContent)}
        &nbsp;...
        {render('collapseBtn', {
          type: 'button',
          level: 'link',
          className: 'ml-1'
        }, {
          onClick: this.toggleExpend,
          ...expendButton,
          label: expendButtonText
        })}
      </>
    )
  }

  getWords() {
    const {
      selectedOptions = [],
      words
    } = this.props;

    if (words) {
      return words;
    }

    if (selectedOptions?.length > 0) {
      return selectedOptions
        .map((option: Option, index: number) => getLabel(option, index, this.props));
    }

    return null;
  }

  render() {
    const {
      classnames: cx,
      className
    } = this.props;

    const words = this.getWords();

    if (!words) {
      return null;
    }

    const limit = this.getLimit(words);
    let body;
    if (
      !limit
      || (Array.isArray(words) && words.length <= limit)
      || (!Array.isArray(words) && words.toString().length <= limit)
    ) {
      // 渲染全部，且无展开收起按钮
      body = this.renderAll(words);
    }
    else {
      body = this.state.isExpend
        ? this.renderAll(words, true)
        : this.renderPart(words);
    }

    return <div className={cx('Words-field', className)}>{body}</div>
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
  static defaultProps: Partial<WordsProps> = {
    inTag: true
  }
}
