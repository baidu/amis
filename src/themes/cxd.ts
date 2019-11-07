import {theme} from '../theme';

// yunshe.design 百度云舍
theme('cxd', {
  classPrefix: 'cxd-',

  renderers: {
    form: {
      horizontal: {
        leftFixed: true
      }
    },

    pagination: {
      maxButtons: 9,
      showPageInput: false
    },

    fieldset: {
      collapsable: false
    },

    remark: {
      icon: 'iconfont icon-warning-mark',
      placement: 'right'
    },

    tabs: {
      mode: 'line'
    },

    'tabs-control': {
      mode: 'line'
    },

    'range-control': {
      showInput: true,
      clearable: true
    },

    status: {
      map: {
        success: 'Status-icon--success',
        pending: 'Status-icon--rolling',
        fail: 'Status-icon--danger',
        queue: 'Status-icon--warning',
        schedule: 'Status-icon--primary'
      },
      labelMap: {
        success: '成功',
        pending: '运行中',
        fail: '失败',
        queue: '排队中',
        schedule: '调度中'
      }
    }
  }
});
