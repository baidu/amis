export default {
    type: 'page',
    title: '轮播图',
    data: {
        carousel: [
            {
                item: '<div style="width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;">carousel data in form</div>'
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
                    type: 'carousel',
                    controlsTheme: 'light',
                    height: '300',
                    className: 'm-t-xxl',
                    options: [
                        {
                            image: 'https://video-react.js.org/assets/poster.png'
                        },
                        {
                            item: '<div style="width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;">carousel data</div>'
                        },
                        {
                            image: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
                        }
                    ]
                },
                {
                    type: 'form',
                    title: '表单',
                    className: 'm-b-xxl',
                    controls: [
                        {
                            type: 'carousel',
                            controlsTheme: 'dark',
                            name: 'carousel',
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
