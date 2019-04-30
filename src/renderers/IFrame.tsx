import * as React from 'react';
import {
    Renderer,
    RendererProps
} from '../factory';
import {
    filter
} from '../utils/tpl';

export interface IFrameProps extends RendererProps {
    className?: string;
    src?: string;
}

export default class IFrame extends React.Component<IFrameProps, object> {
    static propsList: Array<string> = [
        "src",
        "className"
    ];
    static defaultProps:Partial<IFrameProps>= {
        className: '',
        width: '100%',
        height: '100%',
        frameBorder: 0
    };

    render() {
        let {
            className,
            src,
            width,
            height,
            frameBorder,
            data,
            style
        } = this.props;

        style = {
            ...style
        };

        width !== void 0 && (style.width = width);
        height !== void 0 && (style.height = height);

        return (
            <iframe
                className={className}
                frameBorder={frameBorder}
                style={style}
                src={src ? filter(src, data) : undefined}
            />
        );
    }
}

@Renderer({
    test: /(^|\/)iframe$/,
    name: 'iframe'
})
export class IFrameRenderer extends IFrame {};
