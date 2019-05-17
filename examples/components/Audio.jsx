export default {
    "$schema": "https://houtai.baidu.com/v2/schemas/page.json#",
    "title": "音频播放器",
    "body": [
        {
            "type": "audio",
            "autoPlay": false,
            "rates": [1.0, 1.5, 2.0],
            "src": "http://www.ytmp3.cn/down/32791.mp3",
        },
        {
            "type": 'form',
            "title": '',
            "actions": [],
            "className": 'b v-middle inline w-lg h-xs',
            "controls": [
                {
                    "type": "card",
                    "className": 'v-middle w inline no-border',
                    "header": {
                        "title": "歌曲名称",
                        "subTitle": "专辑名称",
                        "description": "description",
                        "avatarClassName": "pull-left thumb-md avatar m-r no-border",
                        "avatar": "http://hiphotos.baidu.com/fex/%70%69%63/item/c9fcc3cec3fdfc03ccabb38edd3f8794a4c22630.jpg"
                    }
                },
                {
                    "type": "audio",
                    "className": 'v-middle no-border',
                    "src": "http://www.ytmp3.cn/down/32791.mp3",
                    "controls": ['play']
                }
            ]
        }
    ]
}