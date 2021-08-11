export default {
  title: '视频播放器',
  body: [
    '<p class="text-danger">另外还支持直播流， flv 和 hls 格式</p>',
    {
      type: 'video',
      autoPlay: false,
      rates: [1.0, 1.5, 2.0],
      jumpFrame: true,
      jumpBufferDuration: 5,
      frames: {
        '00:10': '',
        '00:20': '',
        '00:30': ''
      },
      src: __uri('../static/video/trailer_hd.mp4'),
      poster: __uri('../static/photo/da6376bf988c.jpg')
    }
  ]
};
