import {
    Renderer,
    RendererProps
} from '../../factory';
import Grid, { ColumnNode, Column, ColProps, ColumnArray } from '../Grid';
import { Schema } from '../../types';

import {
    FormItem,
    FormControlProps
} from './Item';
import pick = require("lodash/pick");
import * as React from 'react';
import { Row, Col } from "react-bootstrap";
import * as cx from 'classnames';

export interface GridProps extends FormControlProps {};
const defaultHorizontal = {
    left: 'col-sm-4',
    right: 'col-sm-8',
    offset: 'col-sm-offset-4'
};

@FormItem({
    type: 'grid',
    strictMode: false,
    sizeMutable: false
})
export class GridRenderer extends Grid<GridProps> {
    static propsList: Array<string> = ["columns"];
    static defaultProps = {};
    
    renderChild(region:string, node:Schema, key: number, length: number) {
        const {
            render,
            renderFormItems,
            classnames: cx,
            $path,
            itemRender
        } = this.props;

        if (node && !node.type && (node.controls || node.tabs || node.feildSet)) {
            return (
                <div className={cx(`Grid-form Form--${node.mode || 'normal'}`)}>
                    {renderFormItems(node, ($path as string).replace(/^.*form\//, ''), {
                        mode: node.mode || 'normal',
                        horizontal: node.horizontal || defaultHorizontal
                    })}
                </div>
            );
        }

        return itemRender ?  itemRender(node, key, length, this.props) : render(region, node);
    }
}
