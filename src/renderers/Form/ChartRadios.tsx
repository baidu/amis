import React from 'react';
import {FormItem, FormControlProps} from './Item';
import cx from 'classnames';
import Radios from '../../components/Radios';
import {
  OptionsControl,
  OptionsControlProps,
  Option,
  FormOptionsControl
} from './Options';
import {autobind, isEmpty} from '../../utils/helper';
import {dataMapping} from '../../utils/tpl-builtin';
import {Chart} from '../Chart';

/**
 * 图表 Radio 单选框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/chart-radios
 */
export interface ChartRadiosControlSchema extends FormOptionsControl {
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

  compoonentDidMount() {
    if (this.props.selectedOptions.length) {
      this.highlight(this.props.options.indexOf(this.props.selectedOptions[0]));
    }
  }

  componentDidUpdate() {
    if (this.props.selectedOptions.length) {
      this.highlight(this.props.options.indexOf(this.props.selectedOptions[0]));
    }
  }

  render() {
    const {
      options,
      labelField,
      chartValueField,
      valueField,
      render
    } = this.props;
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
