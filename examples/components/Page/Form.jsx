export default {
  type: 'page',
  title: '表单页面',
  data: {
    name: 'rick'
  },
  body: {
    type: 'form',
    mode: 'horizontal',
    api: '/api/mock2/form/saveForm',
    controls: [
      {
        label: 'Name',
        type: 'text',
        name: 'name'
      },

      {
        label: 'Email',
        type: 'email',
        name: 'email'
      },

      {
        label: 'fa',
        type: 'custom',
        name: 'name',
        onMount: (dom, data, onChange) => {
          const button = document.createElement('button');
          button.innerText = '点击';
          button.onclick = event => {
            console.log('xx', data);
            onChange('new name');
            event.preventDefault();
          };

          dom.appendChild(button);
        },
        onUpdate: (dom, data) => {
          console.log('==', data);
        }
      }
    ]
  }
};
