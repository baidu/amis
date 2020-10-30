import {theme} from '../theme';

// yunshe.design 百度云舍
theme('cxd', {
  classPrefix: 'cxd-',

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
