import React from 'react';
import {
  OptionsControl,
  OptionsControlProps,
  FormOptionsControl
} from 'amis-core';
import {autobind} from 'amis-core';
import {FormOptionsSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';

/**
 * 图表 Radio 单选框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/chart-radios
 */
export interface ChartRadiosControlSchema extends FormOptionsSchema {
  type: 'chart-radios';
  config: any;
  showTooltipOnHighlight?: boolean;
  chartValueField?: string;
}

export interface ChartRadiosProps extends OptionsControlProps {
  placeholder?: any;
  labelClassName?: string;
  labelField?: string;
  config: any;
}

export default class ChartRadiosControl extends React.Component<
  ChartRadiosProps,
  any
> {
  highlightIndex: number = -1;
  prevIndex: number = -1;
  chart?: any;

  @autobind
  chartRef(chart?: any) {
    this.chart = chart;

    this.chart?.on('click', 'series', (params: any) => {
      this.props.onToggle(this.props.options[params.dataIndex]);
    });

    // 因为会要先 setOptions 再来。
    setTimeout(() => this.highlight());
  }

  highlight(index: number = this.highlightIndex) {
    if (this.props.static) {
      return;
    }

    this.highlightIndex = index;

    if (!this.chart || this.prevIndex === index) {
      return;
    }

    if (~this.prevIndex) {
      this.chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: this.prevIndex
      });
    }

    if (~index) {
      this.chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: index
      });

      // 显示 tooltip
      if (this.props.showTooltipOnHighlight) {
        this.chart.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: index
        });
      }
    }

    this.prevIndex = index;
  }

  componentDidMount() {
    // to do 初始化有值的情况暂时无法生效
    if (this.props.selectedOptions.length) {
      this.highlight(this.props.options.indexOf(this.props.selectedOptions[0]));
    }
  }

  componentDidUpdate() {
    if (this.props.selectedOptions.length) {
      this.highlight(this.props.options.indexOf(this.props.selectedOptions[0]));
    }
  }

  renderStatic(displayValue = '-') {
    this.prevIndex = -1;
    this.highlightIndex = -1;

    const {
      options = [],
      selectedOptions,
      labelField = 'label',
      valueField = 'value',
      chartValueField
    } = this.props;
    if (options.length && selectedOptions.length) {
      const count = options.reduce((all, cur) => {
        return all + cur[chartValueField || valueField]
      }, 0);
      if (count > 0) {
        const percent = (+selectedOptions[0][chartValueField || valueField] / count * 100).toFixed(2);
        displayValue = `${selectedOptions[0][labelField]}：${percent}%`;
      }
    }
    return <>{displayValue}</>;
  }

  @supportStatic()
  render() {
    const {options, labelField, chartValueField, valueField, render} =
      this.props;
    const config = {
      legend: {
        top: 10
      },
      tooltip: {
        formatter: (params: any) =>
          `${params.name}：${
            params.value[chartValueField || valueField || 'value']
          }（${params.percent}%）`
      },
      series: [
        {
          type: 'pie',
          top: 30,
          bottom: 0
        }
      ],
      ...this.props.config,
      dataset: {
        dimensions: [
          labelField || 'label',
          chartValueField || valueField || 'value'
        ],
        source: options
      }
    };

    return render(
      'chart',
      {
        type: 'chart'
      },
      {
        config,
        chartRef: this.chartRef
      }
    );
  }
}

@OptionsControl({
  type: 'chart-radios',
  sizeMutable: false
})
export class RadiosControlRenderer extends ChartRadiosControl {
  static defaultProps = {
    multiple: false
  };
}
