import React from 'react';

import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  InteractionManager,
  Dimensions,
  PixelRatio
} from 'react-native';


const scaleSize = function(size) {

  const deviceWidth = Dimensions.get('window').width; //设备的宽度
  const deviceHeight = Dimensions.get('window').height; //设备的高度

  let pixelRatio = PixelRatio.get(); //当前设备的像素密度
  const defaultPixel = 2; //iphone6的像素密度
  //px转换成dp
  const w2 = 750 / defaultPixel;
  const h2 = 1334 / defaultPixel;
  const scale = Math.min(deviceHeight / h2, deviceWidth / w2); //获取缩放比例 

  size = Math.round(size * scale + 0.5);
  return size / defaultPixel;
}


import SelectPicker from './SelectPicker';

class DatePicker extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      year: 2017,
      month: 1,
      day: 1,
      hour:1,
      minute: 1,
      show: false,
      customTopBar: null
    }
  }

  _getYears = () => {
    var year = [];
    var nowYear = parseInt((new Date()).getFullYear());

    var minYear = nowYear - 10;
    var maxYear = nowYear + 10;

    for (var i = minYear; i <= maxYear; i++) {
      year.push(i +' 年');
    }

    return year;
  }

  _getDays(month, year) {
    var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    /* 判断是否是闰年 */
    var isRun = false;
    month = parseInt(month);

    if (month === 2 && ((year % 400 === 0) || ((year % 4 === 0) && (year % 100 !==0)))) {
      months[1] = 29;
    }

    var res = [];

    for (var i = 1; i <=months[month-1]; i++) {
      res.push(i+ ' 日');
    }

    return res;
  }

  _getNumberArry = (f, t, unit = '') => {
    var res = [];
    for (var i = f; i < t; i++) {
      res.push(i + unit);
    }

    return res;
  }

  /* 解决性能问题 */
  shouldComponentUpdate (nextProps, nextState) {
    var newDays = this._getDays(nextState.month, nextState.year);
    var oldDays = this._getDays(this.state.month, this.state.year);

    if (newDays.length === oldDays.length && nextState.show === this.state.show) {
      return false;
    } else {
      return true;
    }
  }

  componentWillMount () {
    var years = this._getYears();
    var months = this._getNumberArry(1, 13, ' 月');
    var days = this._getDays(this.state.month, this.state.year);
    var hours = this._getNumberArry(0, 24, ' 时');
    var minutes = this._getNumberArry(0, 60, ' 分');

    var topBar = this.props.customTopBar(this._ok, this._cancle);

    this.staticData = {
      years,
      months,
      days,
      hours,
      minutes,
      customTopBar: topBar
    }

    var {defaultTime} = this.props;

    this.setState({
      year: defaultTime.getFullYear(),
      month: defaultTime.getMonth() + 1,
      day: defaultTime.getDate(),
      hour: defaultTime.getHours(),
      minute: defaultTime.getMinutes()
    });
  }

  show = () => {

    InteractionManager.runAfterInteractions(() => {
      this.setState({
        show: true
      });
    });    

  }

  hidden = () => {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        show: false
      });
    });
  }

  _cancle = () => {
    this.hidden();
  }

  _ok = () => {
    var nextState = this.state;
    this.props.ok(parseInt(nextState.year), parseInt(nextState.month), parseInt(nextState.day), parseInt(nextState.hour), parseInt(nextState.minute));
    this.hidden();
  }

  _yearChange = (item, index) => {
    requestAnimationFrame(() => {
      this.setState({
        year: item
      });
    });
  }

  render () {


    var {years, months, hours, minutes, days, customTopBar} = this.staticData;
    var wrapWidth = scaleSize(110);
    var itemHeight = scaleSize(88);
    var wrapHeight = itemHeight * 3;
    var {
      defaultTime, 
      title,
      titleStyle,
      okText,
      okTextStyle,
      okBtnBgColor,
      cancelText,
      cancelTextStyle,
      cancelBtnBgColor,
    } = this.props;

    if (!this.state.show) {
      return null;
    }

    var TopBar = () => (
          <View style={[styles.top]}>
            <TouchableHighlight style={[styles.topLeft]} underlayColor='rgba(253, 185, 76, 0.8)' onPress={this._cancle}>
              <View >
                <Text style={[{color: '#fff'},cancelTextStyle]}>{cancelText}</Text>
              </View>
            </TouchableHighlight>
            <View style={[styles.topCenter]}>
              <Text style={[{fontSize: scaleSize(36), color: '#444', fontWeight: 'bold'}, titleStyle]}>{title}</Text>
            </View>
            <TouchableHighlight underlayColor='rgba(0,0,0,0.8)' style={[styles.topRight]} onPress={this._ok}>
              <View>
                <Text style={[{color: '#fff'}, okTextStyle]}>{okText}</Text>
              </View>
            </TouchableHighlight>
          </View>      
    )
    /* 自定义topBar */
    if (customTopBar) {
      TopBar = () => customTopBar;
    }

    return (
      <View style={[styles.masker]}>
        <View style={[styles.wrap]}>
          <TopBar />
          <View style={{flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'space-around', paddingLeft: scaleSize(22),  paddingRight: scaleSize(22)}}>
            <SelectPicker 
              defaultValue={defaultTime.getFullYear() + ' 年'} 
              fontSize={scaleSize(24)} wrapStyle={styles.dateWrapStyle} 
              wrapHeight={wrapHeight} wrapWidth={wrapWidth + scaleSize(20)} 
              itemHeight={itemHeight} 
              onValueChange={this._yearChange}
              ref={(ref) => this.picker = ref} 
              data={years} />
            <SelectPicker 
              defaultValue={defaultTime.getMonth() + 1 + ' 月'}  
              fontSize={scaleSize(24)} wrapStyle={styles.dateWrapStyle}
              wrapHeight={wrapHeight} 
              wrapWidth={wrapWidth} 
              itemHeight={itemHeight}  
              onValueChange={(item,index) => this.setState({month:item})}
              ref={(ref) => this.picker = ref} 
              data={months}/>
            <SelectPicker 
              defaultValue={defaultTime.getDate() + ' 日'} 
              fontSize={scaleSize(24)} wrapStyle={styles.dateWrapStyle}  
              wrapHeight={wrapHeight} wrapWidth={wrapWidth} 
              itemHeight={itemHeight}  
              onValueChange={(item,index) => this.setState({day:item})} 
              ref={(ref) => this.picker = ref}
              data={days}/>
            <SelectPicker 
              defaultValue={defaultTime.getHours() + ' 时'} 
              fontSize={scaleSize(24)} wrapStyle={styles.dateWrapStyle}  
              wrapHeight={wrapHeight} wrapWidth={wrapWidth} itemHeight={itemHeight}
              onValueChange={(item,index) => this.setState({hour:item})}
              ref={(ref) => this.picker = ref} 
              data={hours}/>
            <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}><Text>:</Text></View>
            <SelectPicker 
              defaultValue={defaultTime.getMinutes() + ' 分'}  
              fontSize={scaleSize(24)} 
              wrapStyle={styles.dateWrapStyle}  wrapHeight={wrapHeight} 
              wrapWidth={wrapWidth} itemHeight={itemHeight}  
              onValueChange={(item,index) => this.setState({minute:item})}
              ref={(ref) => this.picker = ref} 
              data={minutes}/>
          </View>
        </View>
      </View>
    )
  }
}

DatePicker.defaultProps = {
  defaultTime: new Date(),
  cancel: function () {},
  ok: function () {},
  title: '选择时间',
  titleStyle: {},
  okText:'确定',
  okTextStyle:{},
  okBtnBgColor:'',
  cancelText:'取消',
  cancelTextStyle:{},
  cancelBtnBgColor: '',
  customTopBar:function (ok, cancel) {
    return null;
  }
}

var styles = StyleSheet.create({
  masker: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  dateWrapStyle: {
    marginLeft: scaleSize(12.5), 
    marginRight: scaleSize(12.5)
  },
  wrap: {
    backgroundColor: '#fff'
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: scaleSize(104),
  },
  topLeft: {
    backgroundColor: '#fdb949',
    borderRadius: scaleSize(10),
    width: scaleSize(180),
    marginLeft: scaleSize(22),
    height: scaleSize(72),
    marginTop: scaleSize(11),
    alignItems: 'center' ,
    justifyContent: 'center'
  },
  topRight: {
    backgroundColor: '#383d45',
    borderRadius: scaleSize(10),
    width: scaleSize(180),
    marginRight: scaleSize(22),
    height: scaleSize(72),
    marginTop: scaleSize(11),
    alignItems: 'center' ,
    justifyContent: 'center'    
  },
  topCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});


export default DatePicker;