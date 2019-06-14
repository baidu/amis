export default {
    type: 'page',
    title: '轮播图',
    data: {
        carousel0: [
            'https://www.baidu.com/img/bd_logo1.png',
            'https://video-react.js.org/assets/poster.png',
            'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
        ],
        carousel1: [
            {
                html: '<div style="width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;">carousel data in form</div>'
            },
            {
                image: 'https://www.baidu.com/img/bd_logo1.png'
            },
            {
                image: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
            }
        ]
    },
    body: [
        {
            type: 'grid',
            columns: [
                {
                    type: 'panel',
                    title: '直接页面配置',
                    body: {
                        type: 'carousel',
                        controlsTheme: 'light',
                        height: '300',
                        options: [
                            {
                                image: 'https://video-react.js.org/assets/poster.png'
                            },
                            {
                                html: '<div style="width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;">carousel data</div>'
                            },
                            {
                                image: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
                            }
                        ]
                    }
                },
                {
                    type: 'panel',
                    title: '使用itemSchema配置',
                    body: {
                        type: 'carousel',
                        name: 'carousel0',
                        controlsTheme: 'dark',
                        height: '300',
                        itemSchema: {
                            type: 'tpl',
                            tpl: '<img src=\"<%=data.item%>\" />'
                        }
                    }
                }
            ]
        },
        {
            type: 'grid',
            columns: [
                {
                    type: 'form',
                    title: '表单内展示',
                    sm: 6,
                    controls: [
                        {
                            type: 'carousel',
                            controlsTheme: 'dark',
                            name: 'carousel1',
                            label: 'carousel',
                            animation: 'slide',
                            height: '300'
                        }
                    ]
                }
            ]
        }
    ]
}
