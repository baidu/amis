import React from 'react';
import {ClassNamesFn, themeable} from '../theme';
import {loadScript, autobind, uuid} from '../utils/helper';
import debounce from 'lodash/debounce';
import {Icon} from './icons';

declare const BMap: any;

interface MapPickerProps {
  ak: string;
  classnames: ClassNamesFn;
  classPrefix: string;
  value?: {
    address: string;
    lat: number;
    lng: number;
    city?: string;
  };
  onChange: (value: any) => void;
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
  placeholderInput?: HTMLInputElement;
  map: any;
  ac: any;
  search = debounce(
    () => {
      if (this.state.inputValue) {
        this.ac?.search(this.state.inputValue);
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

  componentDidMount() {
    if ((window as any).BMap) {
      this.initMap();
    } else {
      loadScript(
        `//api.map.baidu.com/api?v=3.0&ak=${this.props.ak}&callback={{callback}}`
      ).then(this.initMap);
    }
  }

  componentWillUnmount() {
    this.ac?.dispose();
    document.body.removeChild(this.placeholderInput!);

    delete this.placeholderInput;
    delete this.map;
  }

  @autobind
  async initMap() {
    const map = new BMap.Map(this.mapRef.current, {
      enableMapClick: false
    });
    this.map = map;

    const value = this.props.value;
    let point = value
      ? new BMap.Point(value.lng, value.lat)
      : new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point, 15);

    map.addControl(
      // @ts-ignore
      new BMap.NavigationControl({type: BMAP_NAVIGATION_CONTROL_SMALL})
    );

    const geolocationControl = new BMap.GeolocationControl();
    geolocationControl.addEventListener('locationSuccess', (e: any) => {
      this.getLocations(e.point);
    });
    map.addControl(geolocationControl);

    map.addEventListener('click', (e: any) => {
      this.getLocations(e.point, true);
    });

    const input = document.createElement('input');
    input.className = 'invisible';
    this.placeholderInput = input;
    document.body.appendChild(input);

    this.ac = new BMap.Autocomplete({
      input,
      location: map,
      onSearchComplete: (result: any) => {
        // 说明已经销毁了。
        if (!this.map) {
          return;
        }

        const sugs: Array<string> = [];

        const poiLength = result.getNumPois();
        if (poiLength) {
          for (let i = 0; i < poiLength; i++) {
            const poi = result.getPoi(i);
            sugs.push(
              [
                poi.province,
                poi.city,
                poi.district,
                poi.street,
                poi.business
              ].join(' ')
            );
          }
          this.setState({
            sugs
          });
        }
      }
    });

    value ? this.getLocations(point) : geolocationControl.location();
  }

  getLocations(point: any, select?: boolean) {
    const map = this.map;

    map.clearOverlays();
    const mk = new BMap.Marker(point);
    map.addOverlay(mk);
    map.panTo(point);

    var geoc = new BMap.Geocoder();
    geoc.getLocation(point, (rs: any) => {
      // 说明已经销毁了。
      if (!this.map) {
        return;
      }

      const index = 0;
      const locs: Array<LocationItem> = [];

      locs.push({
        title: '当前位置',
        address: rs.address,
        city: rs.addressComponents.city,
        lat: rs.point.lat,
        lng: rs.point.lng
      });

      if (Array.isArray(rs.surroundingPois)) {
        rs.surroundingPois.forEach((item: any) => {
          locs.push({
            title: item.title,
            address: item.address,
            city: item.city,
            lat: item.point.lat,
            lng: item.point.lng
          });
        });
      }

      this.setState(
        {
          locIndex: index,
          locs
        },
        () => {
          if (!select) {
            return;
          }

          this.props?.onChange({
            address: locs[0].address,
            lat: locs[0].lat,
            lng: locs[0].lng,
            city: locs[0].city
          });
        }
      );
    });
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

  @autobind
  handleSelect(e: React.MouseEvent<HTMLElement>) {
    const index = parseInt(e.currentTarget.getAttribute('data-index')!, 10);
    const loc = this.state.locs[index];

    this.setState(
      {
        locIndex: index
      },
      () => {
        const point = new BMap.Point(loc.lng, loc.lat);

        this.map.clearOverlays();
        const mk = new BMap.Marker(point);
        this.map.addOverlay(mk);
        this.map.panTo(point);

        this.props?.onChange({
          address: loc.address.trim() || loc.title,
          lat: loc.lat,
          lng: loc.lng,
          city: loc.city
        });
      }
    );
  }

  @autobind
  handleSugSelect(e: React.MouseEvent<HTMLDivElement>) {
    const value = e.currentTarget.innerText;
    this.setState({
      inputValue: value
    });

    var local = new BMap.LocalSearch(this.map, {
      //智能搜索
      onSearchComplete: () => {
        const results = local.getResults();
        const poi = results.getPoi(0);
        this.setState({
          inputValue: poi.title,
          sugs: []
        });
        this.getLocations(poi.point, true);
      }
    });
    local.search(value);
  }

  render() {
    const {classnames: cx} = this.props;
    const {locIndex, locs, inputValue, sugs} = this.state;
    const hasSug = Array.isArray(sugs) && sugs.length;

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
            invisible: hasSug
          })}
        />

        <div
          className={cx('MapPicker-result', {
            invisible: hasSug
          })}
        >
          {locs.map((item, index) => (
            <div
              onClick={this.handleSelect}
              key={index}
              data-index={index}
              className={cx('MapPicker-item')}
            >
              <div className={cx('MapPicker-itemTitle')}>{item.title}</div>
              <div className={cx('MapPicker-itemDesc')}>{item.address}</div>
              {locIndex === index ? (
                <Icon icon="success" className="icon" />
              ) : null}
            </div>
          ))}
        </div>

        {hasSug ? (
          <div className={cx('MapPicker-sug')}>
            {sugs.map(item => (
              <div
                onClick={this.handleSugSelect}
                className={cx('MapPicker-sugItem')}
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}

export default themeable(BaiduMapPicker);
