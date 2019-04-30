import * as React from 'react';
import * as cx from 'classnames';
import TreeSelector from '../../components/Tree';
import {
    OptionsControl,
    OptionsControlProps
} from './Options';

export interface TreeProps extends OptionsControlProps {
    placeholder?: any;
    hideRoot?: boolean;
    rootLabel?: string;
    rootValue?: any;
    showIcon?: boolean;
    cascade?: boolean; // 父子之间是否完全独立。
    withChildren?: boolean; // 选父级的时候是否把子节点的值也包含在内。
    onlyChildren?: boolean; // 选父级的时候，是否只把子节点的值包含在内
};

export default class TreeControl extends React.Component<TreeProps, any> {
    static defaultProps:Partial<TreeProps> = {
        placeholder: '选项加载中...',
        multiple: false,
        hideRoot: false,
        rootLabel: '顶级',
        rootValue: '',
        showIcon: true,
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
            inline,
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
            render
        } = this.props;

        return (
            <div className={cx(`${ns}TreeControl`, className)}>
                {loading ?  render('loading', {
                    type: 'spinner'
                }) : 
                (
                    <TreeSelector
                        classPrefix={ns}
                        valueField={valueField}
                        disabled={disabled}
                        onChange={onChange}
                        joinValues={joinValues}
                        extractValue={extractValue}
                        delimiter={delimiter}
                        placeholder={placeholder}
                        data={options}
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
                        nameField="label"
                        selfDisabledAffectChildren={false}
                    />
                )}
            </div>
        );
    }
}

@OptionsControl({
    type: 'tree',
})
export class TreeControlRenderer extends TreeControl {};

