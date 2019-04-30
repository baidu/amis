/**
 * @file 页面布局，支持左边栏、顶部、内容区域布局。
 *
 * 参数说明：
 *
 * * children 会渲染在内容区。
 * * header 头部区域
 * * aside 边栏
 * * asideWide 边栏是否加宽
 * * asideClassName 边栏附加样式class
 * * footer 页脚
 * * folder 是否收起边栏
 * * asideFixed 边栏是否为固定模式，如果是会用 position:fixed 来定位.
 * * className 附件的样式名
 * * contentClassName 内容区域附加样式名称
 *
 * @author fex
 */
import * as React from 'react';
import * as cx from 'classnames';
import { ClassNamesFn, themeable } from '../theme';

interface LayoutProps {
    id: string;
    header?: boolean | React.ReactNode;
    aside?: boolean | React.ReactNode;
    asideClassName: string;
    folded?: boolean;
    asideFixed: boolean;
    headerFixed: boolean;
    className?: string;
    contentClassName?: string;
    footer: boolean | React.ReactNode;
    asideWide: boolean;
    offScreen: boolean;
    classPrefix: string;
    classnames: ClassNamesFn;
    size?: 'sm' | 'base' | 'md' | 'lg';
}

export class Layout extends React.Component<LayoutProps, any> {

    static defaultProps = {
        // asideWide: false,
        asideFixed: true,
        asideClassName: '',
        headerFixed: true,
        offScreen: false,
        footer: false
    };

    render() {
        const {
            header,
            aside,
            // asideWide,
            asideClassName,
            children,
            className,
            contentClassName,
            folded,
            asideFixed,
            headerFixed,
            footer,
            offScreen,
            size,
            classPrefix,
            classnames: cx
        } = this.props;

        let body = (
            <div
                className={cx(`Layout-body`, contentClassName)}
            >
                {children}
            </div>
        );

        if (aside) {
            body = (
                <div className={cx('Layout-content')} role="main">
                    {body}
                </div>
            );
        }

        return (
            <div
                className={cx(`Layout`, className, {
                    'Layout--withAside': !!aside,
                    'Layout--headerFixed': header ? headerFixed : false,
                    'Layout--asideFixed': aside ? asideFixed : false,
                    // 'Layout--wide': aside ? asideWide : false,
                    'Layout--folded': folded,
                    'Layout--offScreen': offScreen,
                    [`Layout--${size}`]: size,
                    'Layout--noFooter': !footer
                })}
            >
                {header ? (
                    <div className={cx('Layout-header')}>{header}</div>
                ) : null}
                {aside ? (
                    <div className={cx(`Layout-aside`, asideClassName)}>
                        <div className={cx('Layout-asideWrap')}>
                            <div id="asideInner" className={cx('Layout-asideInner')}>
                                {aside}
                            </div>
                        </div>
                    </div>
                ) : null}
                {body}
                {footer ? (
                    <footer
                        className={cx('Layout-footer')}
                        role="footer"
                    >
                        {footer}
                    </footer>
                ) : null}
            </div>
        );
    }
}

export default themeable(Layout);