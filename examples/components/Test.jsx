import React from 'react';
import Button from '../../src/components/Button';

export default class TestComponent extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <div className="m-b">
          <Button className="m-r-xs" classPrefix="cxd-">
            按钮
          </Button>

          <Button className="m-r-xs" level="primary" classPrefix="cxd-">
            按钮
          </Button>

          <Button className="m-r-xs" level="secondary" classPrefix="cxd-">
            按钮
          </Button>

          <Button className="m-r-xs" level="success" classPrefix="cxd-">
            按钮
          </Button>

          <Button className="m-r-xs" level="info" classPrefix="cxd-">
            按钮
          </Button>

          <Button className="m-r-xs" level="warning" classPrefix="cxd-">
            按钮
          </Button>

          <Button className="m-r-xs" level="danger" classPrefix="cxd-">
            按钮
          </Button>

          <Button className="m-r-xs" level="light" classPrefix="cxd-">
            按钮
          </Button>

          <Button className="m-r-xs" level="dark" classPrefix="cxd-">
            按钮
          </Button>
        </div>

        <div className="m-b">
          <Button className="m-r-xs" size="xs" classPrefix="cxd-">
            按钮
          </Button>
          <Button className="m-r-xs" size="sm" classPrefix="cxd-">
            按钮
          </Button>
          <Button className="m-r-xs" size="md" classPrefix="cxd-">
            按钮
          </Button>
          <Button className="m-r-xs" size="lg" classPrefix="cxd-">
            按钮
          </Button>
        </div>

        <div className="m-b">
          <Button className="m-r-xs" classPrefix="cxd-">
            <i className="fa fa-cloud" />
            <span>按钮</span>
          </Button>
          <Button className="m-r-xs" classPrefix="cxd-">
            <span>按钮</span>
            <i className="fa fa-cloud" />
          </Button>
          <Button className="m-r-xs" classPrefix="cxd-" iconOnly>
            <i className="fa fa-cloud" />
          </Button>
        </div>
      </div>
    );
  }
}
