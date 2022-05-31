/**
 * @file 404
 * @author fex
 */

import React from 'react';
import {themeable, ClassNamesFn} from 'amis-core';

interface NotFoundProps {
  code?: string | number;
  description?: string;
  links?: React.ReactNode;
  footerText?: React.ReactNode;
  classPrefix: string;
  classnames: ClassNamesFn;
}

export class NotFound extends React.Component<NotFoundProps, any> {
  render() {
    const {links, footerText, description, children, code} = this.props;

    return (
      <div className="container w-xxl w-auto-xs m-auto">
        <div className="text-center m-b-lg">
          <h1 className="text-shadow text-white">{code || '404'}</h1>
          {description ? (
            <div className="text-danger">{description}</div>
          ) : null}
        </div>

        {children}

        {links ? (
          <div className="list-group bg-info auto m-b-sm m-b-lg">{links}</div>
        ) : null}

        {footerText ? (
          <div className="text-center">
            <p>
              <small className="text-muted">{footerText}</small>
            </p>
          </div>
        ) : null}
      </div>
    );
  }
}

export default themeable(NotFound);
