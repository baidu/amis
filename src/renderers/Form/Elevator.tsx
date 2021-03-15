import React from 'react';
import { Renderer, RendererProps } from '../../factory';
import { Schema } from '../../types';
import Elevator, { FloorSchema, ElevatorSchema } from '../Elevator';
import { FormBaseControl, FormControlSchema } from './Item';

export type FloorControlSchema = FloorSchema & {
    /**
     * 表单项集合
     */
    controls?: Array<FormControlSchema>;

    /**
     * @deprecated 请用类型 elevator
     */
    elevator?: any;

    /**
     * @deprecated 请用类型 fieldSet
     */
    fieldSet?: any;
};

/**
 * Elevator
 * 文档：https://baidu.gitee.io/amis/docs/components/form/elevator
 */
export interface ElevatorControlSchema
    extends FormBaseControl,
    Omit<ElevatorSchema, 'floors'> {
    type: 'elevator';

    floors: Array<FloorControlSchema>;
}

export interface ElevatorProps extends RendererProps { }

@Renderer({
    test: /(^|\/)form(?:.+)?\/control\/elevator$/i,
    weight: -100,
    name: 'elevator-control'
})
export class ElevatorRenderer extends Elevator {
    static defaultProps = {
        mountOnEnter: false // form 中的不按需渲染
    };
    static propsList: Array<string> = ['onChange', 'floors'];

    renderFloor = (floor: any, props: any, key: number) => {
        const {
            renderFormItems,
            formMode,
            formHorizontal,
            $path,
            render,
            classnames: cx
        } = this.props;

        if (
            renderFormItems &&
            !floor.type &&
            (floor.controls || floor.fieldSet || floor.floors)
        ) {
            return (
                <div className={cx(`Form--${formMode || 'normal'}`)}>
                    {renderFormItems(
                        floor,
                        `${($path as string).replace(/^.*form\//, '')}/${key}`,
                        {
                            mode: formMode,
                            horizontal: formHorizontal
                        }
                    )}
                </div>
            );
        }

        return render(`floor/${key}`, floor.body || floor);
    };
}
