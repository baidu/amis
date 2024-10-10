import React from 'react';
import {ClassNamesFn, themeable} from 'amis-core';
import {loadScript, loadStyle, autobind, uuid} from 'amis-core';
import debounce from 'lodash/debounce';
import {Icon} from './icons';

declare const AMap: any;

interface MapPickerProps {
  ak: string;
  coordinatesType: string;
  classnames: ClassNamesFn;
  classPrefix: string;
  value?: {
    address: string;
    lat: number;
    lng: number;
    city?: string;
  };
  onChange?: (value: any) => void;
}

interface LocationItem {
  title?: string;
  address: string;
  lat: number;
  lng: number;
  city?: string;
}

interface MapPickerState {
  inputValue: string;
  locIndex?: number;
  locs: Array<LocationItem>;
  sugs: Array<string>;
}

export class BaiduMapPicker extends React.Component<
  MapPickerProps,
  MapPickerState
> {
  state: MapPickerState = {
    inputValue: '',
    locs: [],
    locIndex: -1,
    sugs: []
  };

  id = uuid();
  mapRef: React.RefObject<HTMLDivElement> = React.createRef();
  resultListRef: React.RefObject<HTMLDivElement> = React.createRef();
  placeholderInput?: HTMLInputElement;
  map: any;
  ac: any;
  geocoder: any;
  placeSearch: any;
  mark: any;
  geolocation: any;

  search = debounce(
    () => {
      if (this.state.inputValue) {
        this.placeSearch?.search(this.state.inputValue);
      } else {
        this.setState({
          sugs: []
        });
      }
    },
    250,
    {
      trailing: true,
      leading: false
    }
  );
  convertor: any;

  componentDidMount() {
    if ((window as any).AMap) {
      this.initMap();
    } else {
      loadStyle('https://cache.amap.com/lbs/static/main1119.css')
      loadScript(
        `//webapi.amap.com/maps?v=2.0&key=${this.props.ak}`
      ).then(this.initMap);
    }
  }

  @autobind
  async initMap() {
    const map = new AMap.Map(this.mapRef.current, {
      resizeEnable: true,
      zoom: 13,
    });
    this.map = map;
    map.plugin(["AMap.Geocoder"], () => {
      //加载地理编码插件
      this.geocoder = new AMap.Geocoder({
        radius: 1000, //以已知坐标为中心点，radius为半径，返回范围内兴趣点和道路信息
        extensions: "all", //返回地址描述以及附近兴趣点和道路信息，默认“base”
      });
    });

    map.plugin('AMap.Geolocation', () => {
      this.geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：无穷大
          maximumAge: 0,           //定位结果缓存0毫秒，默认：0
          convert: true            //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
      });
      map.addControl(this.geolocation);
  });

    AMap.plugin(["AMap.PlaceSearch"], () => {
      //构造地点查询类
      this.placeSearch = new AMap.PlaceSearch({
        pageSize: 5, // 单页显示结果条数
        pageIndex: 1, // 页码
        map: map, // 展现结果的地图实例
        panel: this.resultListRef.current, // 结果列表将在此容器中进行展示。
        autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
      });

      this.placeSearch.on("selectChanged", (e: any) => {
        let poi = e.selected.data.location;
        this.syncLocation({
          lng: poi.lng,
          lat: poi.lat,
          address: e.selected.data.address,
          city: e.selected.data.cityname,
        });
      });
    })

    if (this.props.value) {
      map.setZoomAndCenter(13, [this.props.value.lng, this.props.value.lat]);
      this.mark = new AMap.Marker({
        position: [this.props.value.lng, this.props.value.lat],
      });
      this.mark.setMap(map);
    } else {
      this.geolocation.getCurrentPosition(function (status: any,result: any) {});
    }

    map.on("click", (e: any) => {
      map.setCenter(e.lnglat);
      let marker = new AMap.Marker({
        position: [e.lnglat.lng, e.lnglat.lat],
      });
      marker.setMap(map);
      if (this.mark) {
        this.mark.setMap(null);
      }
      this.mark = marker;
      this.syncLocation(e.lnglat);
    });
  }

  @autobind
  async syncLocation (lnglat: {
    lng: number;
    lat: number;
    address?: string;
    city?: string;
  }) {
    new Promise((resolve, reject) => {
      if (lnglat.address && lnglat.city) {
        let data = {
          lng: lnglat.lng,
          lat: lnglat.lat,
          address: lnglat.address,
          city: lnglat.city,
          vendor: "gaode",
        }
        if (this.props?.onChange) this.props?.onChange(data)
      }
      this.geocoder.getAddress(lnglat, (status: any, result: any) => {
        if (status === "complete" && result.info === "OK") {
          resolve({ status, result });
          let data = {
            lng: lnglat.lng,
            lat: lnglat.lat,
            address: result.regeocode.formattedAddress,
            city:
              result.regeocode.addressComponent.city ||
              result.regeocode.addressComponent.province ||
              result.regeocode.addressComponent.district,
            vendor: "gaode",
          };
          if (this.props?.onChange) this.props?.onChange(data)
        } else {
          reject({ status, result });
        }
      });
    })
  }

  @autobind
  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState(
      {
        inputValue: e.currentTarget.value
      },
      this.search
    );
  }

  render() {
    const {classnames: cx} = this.props;
    const {locIndex, locs, inputValue, sugs} = this.state;
    // const hasSug = Array.isArray(sugs) && sugs.length;

    return (
      <div className={cx('MapPicker')}>
        <div className={cx('MapPicker-search TextControl-control')}>
          <div className={cx('TextControl-input')}>
            <input
              onChange={this.handleChange}
              value={inputValue}
              placeholder="搜索地点"
            />
          </div>
        </div>

        <div
          ref={this.mapRef}
          className={cx('MapPicker-map', {
            invisible: false
          })}
        />

        <div
          ref={this.resultListRef}
          className={cx('MapPicker-result', {
            invisible: false
          })}
        />
      </div>
    );
  }
}

export default themeable(BaiduMapPicker);
