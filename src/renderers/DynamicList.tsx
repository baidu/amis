import React from 'react';
import {default as List, IStyle, ListItemProps} from '../components/DynamicList';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema, SchemaCollection} from '../Schema';

/**
 * 动态图文列表渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/dynamic-list
 */
export interface DynamicListItemSchema extends Omit<BaseSchema, 'type'> {
    /**
     * 标题
     */
    title?: SchemaCollection;
    /**
     * 标题下面的描述信息
     */
    description?: SchemaCollection;
    /**
     * 描述下面的内容
     */
    footer?: SchemaCollection;

    /**
     * 图片所在位置 左侧 | 右侧 | 上面 | 下面
     */
    mode?: 'left' | 'right' | 'top' | 'bottom';

    /**
     * 类
     */
    className?: string;
    
    /**
     * 图片地址
     */
    imgUrl?: string;

    /**
     * item样式
     */
    itemStyle?: IStyle;

    /**
     * 图片样式
     */
    imgStyle?: IStyle;

    /**
     * title区域样式
     */
    titleStyle?: IStyle;

    /**
     * 描述区域样式
     */
    descriptionStyle?: IStyle;

    /**
     * footer区域样式
     */
    footerStyle?: IStyle;
}

export interface DynamicListSchema extends BaseSchema {
    /**
     * 指定为动态图文列表
     */
    type: 'dynamic-list';
  
    /**
     * 图片所在位置 左侧 | 右侧 | 上面 | 下面
     */
    mode?: 'left' | 'right' | 'top' | 'bottom';

    /**
     * 一行展示几列
     */
    columns: number;

    /**
     * 列间距
     */
    columnSpace: number;

    /**
     * list item
     */
    items: Array<DynamicListItemSchema>;

    /**
     * list style
     */
    style: IStyle;

    /**
     * item样式
     */
    itemStyle?: IStyle;

    /**
     * 图片样式
     */
    imgStyle?: IStyle;

    /**
     * title区域样式
     */
    titleStyle?: IStyle;

    /**
     * 描述区域样式
     */
    descriptionStyle?: IStyle;

    /**
     * footer区域样式
     */
    footerStyle?: IStyle;

    className?: string;
}

export interface DynamicListProps
    extends RendererProps, Omit<DynamicListSchema, 'className'>{}

export class DynamicList extends React.Component<DynamicListProps> {
    static defaultProps: Partial<DynamicListProps> = {
        className: '',
        mode: 'left'
    };

    
    renderNode(prop: SchemaCollection | undefined, region: string) {
        const {render, data} = this.props;
    
        return prop ? render(region, prop, {data}) : null;
    }

    transferItemNode() {
        const {items} = this.props;
        return items.map((item:DynamicListItemSchema)  => (
            Object.assign({}, item, {
                title: this.renderNode(item.title, 'title'),
                description: this.renderNode(item.description, 'description'),
                footer: this.renderNode(item.footer, 'footer')
            })
        ));
    }

    render() {
        const {
            classnames: cx,
            classPrefix: ns,
            className,
            mode,
            columns,
            columnSpace,
            style,
            itemStyle,
            titleStyle,
            imgStyle,
            descriptionStyle,
            footerStyle
        } = this.props;

        return (
            <List
                classnames={cx}
                classPrefix={ns}
                className={className}
                mode={mode}
                columns={columns}
                columnSpace={columnSpace}
                items={this.transferItemNode()}
                style={style}
                itemStyle={itemStyle}
                titleStyle={titleStyle}
                imgStyle={imgStyle}
                descriptionStyle={descriptionStyle}
                footerStyle={footerStyle}
            />
        )
    }
}

@Renderer({
    type: 'dynamic-list'
})
export class DynamicListRenderer extends DynamicList {}
