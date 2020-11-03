import {objectOrArray, buildOptions} from './Common';

//@ts-ignore
const xAxisOptions = __inline('./option-parts/option.xAxis.json');
//@ts-ignore
const yAxisOptions = __inline('./option-parts/option.yAxis.json');

export default (axis = 'x') => {
  return objectOrArray(
    axis === 'x' ? 'xAxis' : 'yAxis',
    '多轴模式',
    buildOptions('', axis === 'x' ? xAxisOptions : yAxisOptions)
  );
};
