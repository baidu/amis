import moment from 'moment';

/**
 * 身份证号码校验，（没有校验城市和区县）
 *
 * 身份证号码是由18位组成，分别表示：
 * 第1、2位数字表示：所在省份的代码；
 * 第3、4位数字表示：所在城市的代码；
 * 第5、6位数字表示：所在区县的代码；
 * 第7-14位数字表示：出生年、月、日（其中7、8、9、10位是年，11、12位是月，13、14位是日）；
 * 第15-17位数字表示：顺序编码，都是同一地址辖区内的，以及同年同月同日出生人的顺序码，同时 第17位兼具性别标识功能，男单女双；
 * 第18位是校检码：可以是0-9的数字，有时也用X表示, X来代替10。
 *
 * 身份证15位时，次序为省（2位）市（2位）区县（2位）年（2位）月（2位）日（2位）顺序编码（3位），皆为数字，没有最后一位校验码
 */
export function isId18(id: string) {
  if (!/^\d{17}(\d|X)$/.test(id)) {
    return false;
  }
  const info = getInfoFromId(id);
  if (!info) {
    return false;
  }
  const {province, city, country, birthday} = info;
  if (!verifyRegion(province, city, country) || !verifyBirthday(birthday)) {
    return false;
  }
  return verifyCheckCode(id);
}
export function isId15(id: string) {
  if (!/^\d{15}$/.test(id)) {
    return false;
  }
  const info = getInfoFromId(id);
  if (!info) {
    return false;
  }
  const {province, city, country, birthday} = info;
  return verifyRegion(province, city, country) && verifyBirthday(birthday);
}
export function isId(id: string) {
  return isId18(id) || isId15(id);
}

function getProvInfo(prov: string) {
  return {
    11: '北京市',
    12: '天津市',
    13: '河北省',
    14: '山西省',
    15: '内蒙古自治区',
    21: '辽宁省',
    22: '吉林省',
    23: '黑龙江省',
    31: '上海省',
    32: '江苏省',
    33: '浙江省',
    34: '安徽省',
    35: '福建省',
    36: '江西省',
    37: '山东省',
    41: '河南省',
    42: '湖北省',
    43: '湖南省',
    44: '广东省',
    45: '广西壮族自治区',
    46: '海南省',
    50: '重庆市',
    51: '四川省',
    52: '贵州省',
    53: '云南省',
    54: '西藏自治区',
    61: '陕西省',
    62: '甘肃省',
    63: '青海省',
    64: '宁夏回族自治区',
    65: '新疆维吾尔自治区',
    71: '台湾省',
    81: '香港',
    82: '澳门',
    91: '国外'
  }[prov];
}

function getInfoFromId(id: string) {
  if (
    (id.length === 18 && !/^\d{17}(\d|X)$/.test(id)) ||
    (id.length === 15 && !/^\d{15}$/.test(id))
  ) {
    return;
  }
  let data;
  if (id.length == 18) {
    data = id.match(
      /^(\d{2})(\d{2})(\d{2})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/
    );
  } else if (id.length == 15) {
    data = id.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{3})$/);
  }
  if (!data) {
    return;
  }
  const [
    _id,
    province,
    city,
    country,
    year,
    month,
    day,
    sequenceCode,
    checkCode
  ] = data;
  return {
    province,
    provinceName: getProvInfo(province),

    city,
    country,
    year,
    month,
    day,
    birthday: new Date(year + '/' + month + '/' + day),
    sequenceCode,
    checkCode,
    isMale: +sequenceCode % 2 === 1,
    isFemale: +sequenceCode % 2 === 0
  };
}

function verifyRegion(province: string, city: string, country: string) {
  if (!getProvInfo(province)) {
    return false;
  }
  // 这里暂时不获取市和区的具体信息，因为调用CityDB会把校验函数传染为异步
  // city位: 00表示省；01-20，51-70表示省直辖市；21-50表示地区（自治州、盟）, 90 表示 直辖县级市
  if (!/^(?:[0-6]\d|70|90)$/.test(city)) {
    return false;
  }
  if (!/^\d\d$/.test(country)) {
    return false;
  }
  return true;
}

function verifyBirthday(birthday: any) {
  const min = moment(new Date('1850-01-01')); // 还有1850年前的人活着吗？
  const max = moment().endOf('day'); // 最大值是今天
  return !isNaN(+birthday) && moment(birthday).isBetween(min, max);
}

/**
 * 校验码计算方式
 * 1、将前面的身份证号码17位数分别乘以不同的系数。从第一位到第十七位的系数分别为：7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 ；
 * 2、将这17位数字和系数相乘的结果相加；
 * 3、用加出来和除以11，看余数是多少；
 * 4、余数只可能有0 1 2 3 4 5 6 7 8 9 10这11个数字。其分别对应的最后一位身份证的号码为1 0 X 9 8 7 6 5 4 3 2；
 * 5、通过上面得知如果余数是2，余数所对应的最后一位身份证号是X，就会在身份证的第18位数字上出现罗马数字的X。
 */
function verifyCheckCode(id: string) {
  const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  let cardTemp = 0;
  for (let i = 0; i < 17; i++) {
    cardTemp += +id.slice(i, i + 1) * arrInt[i];
  }
  return arrCh[cardTemp % 11] === id.slice(17, 18);
}
