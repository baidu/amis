import {theme} from 'amis-core';

theme('antd', {
  classPrefix: 'antd-',
  components: {
    toast: {
      closeButton: true
    }
  },

  renderers: {
    'form': {
      horizontal: {
        leftFixed: true
      }
    },

    'pagination': {
      maxButtons: 9,
      showPageInput: false
    },

    'fieldset': {
      collapsable: false
    },

    'remark': {
      placement: 'right'
    },

    'tabs': {
      mode: 'line'
    },

    'tabs-control': {
      mode: 'line'
    },

    'range-control': {
      showInput: true,
      clearable: true
    }
  }
});
