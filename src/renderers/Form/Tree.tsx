import React from 'react';
import cx from 'classnames';
import TreeSelector from '../../components/Tree';
import {OptionsControl, OptionsControlProps} from './Options';
import {Spinner} from '../../components';

export interface TreeProps extends OptionsControlProps {
  placeholder?: any;
  hideRoot?: boolean;
  rootLabel?: string;
  rootValue?: any;
  showIcon?: boolean;
  cascade?: boolean; // 父子之间是否完全独立。
  withChildren?: boolean; // 选父级的时候是否把子节点的值也包含在内。
  onlyChildren?: boolean; // 选父级的时候，是否只把子节点的值包含在内
  addControls?: Array<any>;
  updateControls?: Array<any>;
  rootCreatable?: boolean;
}

export default class TreeControl extends React.Component<TreeProps> {
  static defaultProps: Partial<TreeProps> = {
    placeholder: '选项加载中...',
    multiple: false,
    rootLabel: '顶级',
    rootValue: '',
    showIcon: true
  };

  reload() {
    const reload = this.props.reloadOptions;
    reload && reload();
  }

  render() {
    const {
      className,
      classPrefix: ns,
      value,
      onChange,
      disabled,
      joinValues,
      extractValue,
      delimiter,
      placeholder,
      options,
      multiple,
      valueField,
      initiallyOpen,
      unfoldedLevel,
      withChildren,
      onlyChildren,
      loading,
      hideRoot,
      rootLabel,
      cascade,
      rootValue,
      showIcon,
      showRadio,
      onAdd,
      creatable,
      addControls,
      onEdit,
      editable,
      editControls,
      removable,
      onDelete,
      rootCreatable
    } = this.props;

    return (
      <div className={cx(`${ns}TreeControl`, className)}>
        <Spinner size="sm" key="info" show={loading} />
        {loading ? null : (
          <TreeSelector
            classPrefix={ns}
            valueField={valueField}
            disabled={disabled}
            onChange={onChange}
            joinValues={joinValues}
            extractValue={extractValue}
            delimiter={delimiter}
            placeholder={placeholder}
            options={options}
            multiple={multiple}
            initiallyOpen={initiallyOpen}
            unfoldedLevel={unfoldedLevel}
            withChildren={withChildren}
            onlyChildren={onlyChildren}
            hideRoot={hideRoot}
            rootLabel={rootLabel}
            rootValue={rootValue}
            showIcon={showIcon}
            showRadio={showRadio}
            cascade={cascade}
            foldedField="collapsed"
            value={value || ''}
            labelField="label"
            selfDisabledAffectChildren={false}
            onAdd={onAdd}
            creatable={creatable}
            rootCreatable={rootCreatable}
            onEdit={onEdit}
            editable={editable}
            removable={removable}
            onDelete={onDelete}
            bultinCUD={!addControls && !editControls}
          />
        )}
      </div>
    );
  }
}

@OptionsControl({
  type: 'tree'
})
export class TreeControlRenderer extends TreeControl {}
