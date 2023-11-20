/**
 * @file ThemeWrapper.tsx
 * @description 收缩展开容器
 */

import React from 'react';
import {render, Renderer} from 'amis';
import {Icon as ThemeIcon} from '../icons/index';
import cx from 'classnames';
import type {FormControlProps} from 'amis-core';
import {pick} from 'lodash';
import {TooltipWrapper} from 'amis-ui';

interface ThemeWrapperProps {
  hasSenior?: boolean;
  hasOpen?: boolean;
  senior?: boolean;
  toggleSenior?: (value: boolean) => void;
  open?: boolean;
  toggleOpen?: (value: boolean) => void;
  title?: string;
}

interface ThemeWrapperControlProps extends FormControlProps {
  hasSenior?: boolean;
  title?: string;
  body?: any;
  seniorBody?: any;
}

export function ThemeWrapperHeader(props: ThemeWrapperProps) {
  const {hasSenior, hasOpen, senior, toggleSenior, open, toggleOpen, title} =
    props;

  return (
    <div className="Theme-Wrapper">
      <div className="Theme-Wrapper-header">
        <div className="Theme-Wrapper-header-left">{title}</div>
        <div className="Theme-Wrapper-header-right">
          {hasSenior && (
            <TooltipWrapper
              tooltip="扩展配置"
              tooltipTheme="dark"
              placement="left"
            >
              <ThemeIcon
                icon="custom"
                className="common-icon"
                onClick={() => toggleSenior && toggleSenior(!senior)}
              />
            </TooltipWrapper>
          )}
          {hasOpen && (
            <ThemeIcon
              icon="right-arrow-bold"
              className={cx('arrow-icon', open ? 'arrow-icon-reverse' : '')}
              onClick={() => toggleOpen && toggleOpen(!open)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ThemeWrapperControl(props: ThemeWrapperControlProps) {
  const {hasSenior = false, hasOpen = false, body, seniorBody, title} = props;
  const [open, toggleOpen] = React.useState(true);
  const [senior, toggleSenior] = React.useState(false);
  const bodyProps = pick(props, [
    'data',
    'formMode',
    'formLabelAlign',
    'formLabelWidth',
    'formHorizontal',
    'onChange'
  ]);

  return (
    <div className="Theme-Wrapper">
      {title || title === '' ? (
        <ThemeWrapperHeader
          hasSenior={hasSenior}
          hasOpen={hasOpen}
          senior={senior}
          toggleSenior={toggleSenior}
          open={open}
          toggleOpen={toggleOpen}
          title={title}
        />
      ) : null}
      <div
        className="Theme-Wrapper-body"
        style={{display: open ? 'block' : 'none'}}
      >
        {body ? render(body, bodyProps) : null}
        <div
          className="Theme-Wrapper-senior"
          style={{display: senior ? 'block' : 'none'}}
        >
          {seniorBody ? render(seniorBody, bodyProps) : null}
        </div>
      </div>
    </div>
  );
}

@Renderer({
  type: 'amis-theme-wrapper'
})
export default class ThemeWrapperRenderer extends React.Component<ThemeWrapperControlProps> {
  render() {
    return <ThemeWrapperControl {...this.props} />;
  }
}
