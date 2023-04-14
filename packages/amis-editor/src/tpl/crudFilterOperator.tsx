import {
  setSchemaTpl,
  getSchemaTpl,
  tipedLabel,
  BaseEventContext,
  defaultValue
} from 'amis-editor-core';

const filters = {
  text: [
    {
      label: '模糊匹配',
      value: 'like'
    },
    {
      label: '不匹配',
      value: 'not_like'
    },
    {
      label: '匹配开头',
      value: 'starts_with'
    },
    {
      label: '匹配结尾',
      value: 'ends_with'
    }
  ],
  number: [
    {
      label: '小于',
      value: 'less'
    },
    {
      label: '小于或等于',
      value: 'less_or_equal'
    },
    {
      label: '大于',
      value: 'greater'
    },
    {
      label: '大于或等于',
      value: 'greater_or_equal'
    }
  ]
  // time: []
};

setSchemaTpl(
  'crudFilterOperator',
  (props: {context: BaseEventContext; type: string}) => {
    const {context, type = 'all'} = props;

    const isInCrudFilter = context?.node?.path?.includes('crud2/filter');

    const addFilters =
      type === 'all'
        ? [...filters.number, ...filters.text]
        : filters[type === 'text' ? 'text' : 'number'];

    return {
      label: '匹配规则',
      type: 'select',
      name: 'filterOp',
      options: [
        {
          label: '等于',
          value: 'equal'
        },
        {
          label: '不等于',
          value: 'not_equal'
        },
        ...addFilters,
        {
          label: '为空',
          value: 'is_empty'
        },
        {
          label: '不为空',
          value: 'is_not_empty'
        }
      ],
      pipeIn: defaultValue('equal'),
      visible: isInCrudFilter
    };
  }
);
