export default {
  title: '音频播放器',
  body: [
    {
      type: 'audio',
      autoPlay: false,
      rates: [1.0, 1.5, 2.0],
      src: __uri('../static/audio/chicane-poppiholla-original-radio-edit.mp3')
    },
    {
      type: 'form',
      title: '',
      actions: [],
      className: 'b v-middle inline w-lg h-xs',
      body: [
        {
          type: 'card',
          className: 'v-middle w inline no-border',
          header: {
            title: '歌曲名称',
            subTitle: '专辑名称',
            description: 'description',
            avatarClassName: 'pull-left thumb-md avatar m-r no-border',
            avatar: __uri(
              '../static/photo/bd3eb13533fa828b13b24500f31f4134960a5a44.jpg'
            )
          }
        },
        {
          type: 'audio',
          className: 'v-middle no-border',
          src: __uri(
            '../static/audio/chicane-poppiholla-original-radio-edit.mp3'
          ),
          controls: ['play']
        }
      ]
    }
  ]
};
