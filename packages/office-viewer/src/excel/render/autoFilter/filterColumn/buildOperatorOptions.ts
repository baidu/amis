import {OperatorOptions} from './OperatorTypeUI';

export function buildOperatorOptions(
  valueType: 'text' | 'number' | 'date',
  translate: (key: string) => string
): OperatorOptions[] {
  switch (valueType) {
    case 'text':
      return [
        {
          text: translate('customFilter.equal'),
          value: 'equal'
        },
        {
          text: translate('customFilter.notEqual'),
          value: 'notEqual'
        },
        {
          text: translate('customFilter.beginsWith'),
          value: 'beginsWith'
        },
        {
          text: translate('customFilter.notBeginsWith'),
          value: 'notBeginsWith'
        },
        {
          text: translate('customFilter.endsWith'),
          value: 'endsWith'
        },
        {
          text: translate('customFilter.notEndsWith'),
          value: 'notEndsWith'
        },
        {
          text: translate('customFilter.contains'),
          value: 'contains'
        },
        {
          text: translate('customFilter.notContains'),
          value: 'notContains'
        }
      ];

    case 'number':
      return [
        {
          text: translate('customFilter.equal'),
          value: 'equal'
        },
        {
          text: translate('customFilter.notEqual'),
          value: 'notEqual'
        },
        {
          text: translate('customFilter.greaterThan'),
          value: 'greaterThan'
        },
        {
          text: translate('customFilter.greaterThanOrEqual'),
          value: 'greaterThanOrEqual'
        },
        {
          text: translate('customFilter.lessThan'),
          value: 'lessThan'
        },
        {
          text: translate('customFilter.lessThanOrEqual'),
          value: 'lessThanOrEqual'
        }
      ];

    case 'date':
      return [
        {
          text: translate('customFilter.equal'),
          value: 'equal'
        },
        {
          text: translate('customFilter.notEqual'),
          value: 'notEqual'
        },
        {
          text: translate('customFilter.greaterThan'),
          value: 'greaterThan'
        },
        {
          text: translate('customFilter.greaterThanOrEqual'),
          value: 'greaterThanOrEqual'
        },
        {
          text: translate('customFilter.lessThan'),
          value: 'lessThan'
        },
        {
          text: translate('customFilter.lessThanOrEqual'),
          value: 'lessThanOrEqual'
        }
      ];
  }
}
