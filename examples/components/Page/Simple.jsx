export default {
    type: 'page',
    title: '标题',
    remark: '提示 Tip',
    data: {
        id: 1,
        image: "https://www.baidu.com/img/bd_logo1.png",
        carousel: [
            {
                html: '<p style="height: 300px;">This is data </p>'
            },
            /*{
                label: 'This is data and is label'
            },*/
            /*{
                image: 'https://www.baidu.com/img/bd_logo1.png'
            },*/
            {
                // 狗
                image: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
            },
            {
                image: 'https://gss0.bdstatic.com/5bVWsj_p_tVS5dKfpU_Y_D3/res/r/image/2018-09-29/208e4ce8af2846d584cbe55b245a4134.jpeg'
            }/*,
            {
                image: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
                // image: 'https://gss0.bdstatic.com/5bVWsj_p_tVS5dKfpU_Y_D3/res/r/image/2017-09-27/297f5edb1e984613083a2d3cc0c5bb36.png'
            }*/
        ]
    },
    body: [{
        type: 'form',
        title: '表单',
        controls: [
            {
                type: 'carousel',
                controlTheme: 'light',
                name: 'carousel',
                label: 'carousel',
                animation: 'slideLeft'
            }
        ]
    },
        /*{
            "type": "card",
            className: 'v-middle w',
            "header": {
                "title": "Title",
                "subTitle": "Sub Title",
                "description": "description",
                "avatarClassName": "pull-left thumb-md avatar b-3x m-r",
                "avatar": "http://hiphotos.baidu.com/fex/%70%69%63/item/c9fcc3cec3fdfc03ccabb38edd3f8794a4c22630.jpg"
            }
        }*/
    /*{
        type: 'carousel',
        width: '500',
        height: '200',
        controlTheme: 'dark',
        controls: ['arrows', 'dots'],
        animation: 'slideRight',
        options: [
            {
                html: '<p style="height: 300px;">This is data </p>'
            },
            {
                label: 'This is data and is label'
            },
            {
                image: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
            }
        ]
      }*/
    ],
    aside: '边栏部分',
    toolbar: '工具栏',
    initApi: '/api/mock2/page/initData'
}
