/* bessel.js (C) 2013-present SheetJS -- http://sheetjs.com */
/* vim: set ts=2: */
/*exported BESSEL */

var M = Math;

function _horner(arr: number[], v: number) {
  for (var i = 0, z = 0; i < arr.length; ++i) z = v * z + arr[i];
  return z;
}
function _bessel_iter(
  x: number,
  n: number,
  f0: number,
  f1: number,
  sign: number
) {
  if (n === 0) return f0;
  if (n === 1) return f1;
  var tdx = 2 / x,
    f2 = f1;
  for (var o = 1; o < n; ++o) {
    f2 = f1 * o * tdx + sign * f0;
    f0 = f1;
    f1 = f2;
  }
  return f2;
}
function _bessel_wrap(
  bessel0: (x: number) => number,
  bessel1: (x: number) => number,
  name: string,
  nonzero: number,
  sign: number
) {
  return function bessel(x: number, n: number) {
    if (nonzero) {
      if (x === 0) return nonzero == 1 ? -Infinity : Infinity;
      else if (x < 0) return NaN;
    }
    if (n === 0) return bessel0(x);
    if (n === 1) return bessel1(x);
    if (n < 0) return NaN;
    n |= 0;
    var b0 = bessel0(x),
      b1 = bessel1(x);
    return _bessel_iter(x, n, b0, b1, sign);
  };
}
var besselj = (function () {
  var W = 0.636619772; // 2 / Math.PI

  var b0_a1a = [
    57568490574.0, -13362590354.0, 651619640.7, -11214424.18, 77392.33017,
    -184.9052456
  ].reverse();
  var b0_a2a = [
    57568490411.0, 1029532985.0, 9494680.718, 59272.64853, 267.8532712, 1.0
  ].reverse();
  var b0_a1b = [
    1.0, -0.1098628627e-2, 0.2734510407e-4, -0.2073370639e-5, 0.2093887211e-6
  ].reverse();
  var b0_a2b = [
    -0.1562499995e-1, 0.1430488765e-3, -0.6911147651e-5, 0.7621095161e-6,
    -0.934935152e-7
  ].reverse();

  function bessel0(x: number) {
    var a = 0,
      a1 = 0,
      a2 = 0,
      y = x * x;
    if (x < 8) {
      a1 = _horner(b0_a1a, y);
      a2 = _horner(b0_a2a, y);
      a = a1 / a2;
    } else {
      var xx = x - 0.785398164;
      y = 64 / y;
      a1 = _horner(b0_a1b, y);
      a2 = _horner(b0_a2b, y);
      a = M.sqrt(W / x) * (M.cos(xx) * a1 - (M.sin(xx) * a2 * 8) / x);
    }
    return a;
  }

  var b1_a1a = [
    72362614232.0, -7895059235.0, 242396853.1, -2972611.439, 15704.4826,
    -30.16036606
  ].reverse();
  var b1_a2a = [
    144725228442.0, 2300535178.0, 18583304.74, 99447.43394, 376.9991397, 1.0
  ].reverse();
  var b1_a1b = [
    1.0, 0.183105e-2, -0.3516396496e-4, 0.2457520174e-5, -0.240337019e-6
  ].reverse();
  var b1_a2b = [
    0.04687499995, -0.2002690873e-3, 0.8449199096e-5, -0.88228987e-6,
    0.105787412e-6
  ].reverse();

  function bessel1(x: number) {
    var a = 0,
      a1 = 0,
      a2 = 0,
      y = x * x,
      xx = M.abs(x) - 2.356194491;
    if (Math.abs(x) < 8) {
      a1 = x * _horner(b1_a1a, y);
      a2 = _horner(b1_a2a, y);
      a = a1 / a2;
    } else {
      y = 64 / y;
      a1 = _horner(b1_a1b, y);
      a2 = _horner(b1_a2b, y);
      a =
        M.sqrt(W / M.abs(x)) *
        (M.cos(xx) * a1 - (M.sin(xx) * a2 * 8) / M.abs(x));
      if (x < 0) a = -a;
    }
    return a;
  }

  return function besselj(x: number, n: number): number {
    n = Math.round(n);
    if (!isFinite(x)) return isNaN(x) ? x : 0;
    if (n < 0) return (n % 2 ? -1 : 1) * besselj(x, -n);
    if (x < 0) return (n % 2 ? -1 : 1) * besselj(-x, n);
    if (n === 0) return bessel0(x);
    if (n === 1) return bessel1(x);
    if (x === 0) return 0;

    var ret = 0.0;
    if (x > n) {
      ret = _bessel_iter(x, n, bessel0(x), bessel1(x), -1);
    } else {
      var m = 2 * M.floor((n + M.floor(M.sqrt(40 * n))) / 2);
      var jsum = false;
      var bjp = 0.0,
        sum = 0.0;
      var bj = 1.0,
        bjm = 0.0;
      var tox = 2 / x;
      for (var j = m; j > 0; j--) {
        bjm = j * tox * bj - bjp;
        bjp = bj;
        bj = bjm;
        if (M.abs(bj) > 1e10) {
          bj *= 1e-10;
          bjp *= 1e-10;
          ret *= 1e-10;
          sum *= 1e-10;
        }
        if (jsum) sum += bj;
        jsum = !jsum;
        if (j == n) ret = bjp;
      }
      sum = 2.0 * sum - bj;
      ret /= sum;
    }
    return ret;
  };
})();
var bessely = (function () {
  var W = 0.636619772;

  var b0_a1a = [
    -2957821389.0, 7062834065.0, -512359803.6, 10879881.29, -86327.92757,
    228.4622733
  ].reverse();
  var b0_a2a = [
    40076544269.0, 745249964.8, 7189466.438, 47447.2647, 226.1030244, 1.0
  ].reverse();
  var b0_a1b = [
    1.0, -0.1098628627e-2, 0.2734510407e-4, -0.2073370639e-5, 0.2093887211e-6
  ].reverse();
  var b0_a2b = [
    -0.1562499995e-1, 0.1430488765e-3, -0.6911147651e-5, 0.7621095161e-6,
    -0.934945152e-7
  ].reverse();

  function bessel0(x: number) {
    var a = 0,
      a1 = 0,
      a2 = 0,
      y = x * x,
      xx = x - 0.785398164;
    if (x < 8) {
      a1 = _horner(b0_a1a, y);
      a2 = _horner(b0_a2a, y);
      a = a1 / a2 + W * besselj(x, 0) * M.log(x);
    } else {
      y = 64 / y;
      a1 = _horner(b0_a1b, y);
      a2 = _horner(b0_a2b, y);
      a = M.sqrt(W / x) * (M.sin(xx) * a1 + (M.cos(xx) * a2 * 8) / x);
    }
    return a;
  }

  var b1_a1a = [
    -0.4900604943e13, 0.127527439e13, -0.5153438139e11, 0.7349264551e9,
    -0.4237922726e7, 0.8511937935e4
  ].reverse();
  var b1_a2a = [
    0.249958057e14, 0.4244419664e12, 0.3733650367e10, 0.2245904002e8,
    0.102042605e6, 0.3549632885e3, 1
  ].reverse();
  var b1_a1b = [
    1.0, 0.183105e-2, -0.3516396496e-4, 0.2457520174e-5, -0.240337019e-6
  ].reverse();
  var b1_a2b = [
    0.04687499995, -0.2002690873e-3, 0.8449199096e-5, -0.88228987e-6,
    0.105787412e-6
  ].reverse();

  function bessel1(x: number) {
    var a = 0,
      a1 = 0,
      a2 = 0,
      y = x * x,
      xx = x - 2.356194491;
    if (x < 8) {
      a1 = x * _horner(b1_a1a, y);
      a2 = _horner(b1_a2a, y);
      a = a1 / a2 + W * (besselj(x, 1) * M.log(x) - 1 / x);
    } else {
      y = 64 / y;
      a1 = _horner(b1_a1b, y);
      a2 = _horner(b1_a2b, y);
      a = M.sqrt(W / x) * (M.sin(xx) * a1 + (M.cos(xx) * a2 * 8) / x);
    }
    return a;
  }

  return _bessel_wrap(bessel0, bessel1, 'BESSELY', 1, -1);
})();
var besseli = (function () {
  var b0_a = [
    1.0, 3.5156229, 3.0899424, 1.2067492, 0.2659732, 0.360768e-1, 0.45813e-2
  ].reverse();
  var b0_b = [
    0.39894228, 0.1328592e-1, 0.225319e-2, -0.157565e-2, 0.916281e-2,
    -0.2057706e-1, 0.2635537e-1, -0.1647633e-1, 0.392377e-2
  ].reverse();

  function bessel0(x: number) {
    if (x <= 3.75) return _horner(b0_a, (x * x) / (3.75 * 3.75));
    return (
      (M.exp(M.abs(x)) / M.sqrt(M.abs(x))) * _horner(b0_b, 3.75 / M.abs(x))
    );
  }

  var b1_a = [
    0.5, 0.87890594, 0.51498869, 0.15084934, 0.2658733e-1, 0.301532e-2,
    0.32411e-3
  ].reverse();
  var b1_b = [
    0.39894228, -0.3988024e-1, -0.362018e-2, 0.163801e-2, -0.1031555e-1,
    0.2282967e-1, -0.2895312e-1, 0.1787654e-1, -0.420059e-2
  ].reverse();

  function bessel1(x: number) {
    if (x < 3.75) return x * _horner(b1_a, (x * x) / (3.75 * 3.75));
    return (
      (((x < 0 ? -1 : 1) * M.exp(M.abs(x))) / M.sqrt(M.abs(x))) *
      _horner(b1_b, 3.75 / M.abs(x))
    );
  }

  return function besseli(x: number, n: number) {
    n = Math.round(n);
    if (n === 0) return bessel0(x);
    if (n === 1) return bessel1(x);
    if (n < 0) return NaN;
    if (M.abs(x) === 0) return 0;
    if (x == Infinity) return Infinity;

    var ret = 0.0,
      j,
      tox = 2 / M.abs(x),
      bip = 0.0,
      bi = 1.0,
      bim = 0.0;
    var m = 2 * M.round((n + M.round(M.sqrt(40 * n))) / 2);
    for (j = m; j > 0; j--) {
      bim = j * tox * bi + bip;
      bip = bi;
      bi = bim;
      if (M.abs(bi) > 1e10) {
        bi *= 1e-10;
        bip *= 1e-10;
        ret *= 1e-10;
      }
      if (j == n) ret = bip;
    }
    ret *= besseli(x, 0) / bi;
    return x < 0 && n % 2 ? -ret : ret;
  };
})();

var besselk = (function () {
  var b0_a = [
    -0.57721566, 0.4227842, 0.23069756, 0.348859e-1, 0.262698e-2, 0.1075e-3,
    0.74e-5
  ].reverse();
  var b0_b = [
    1.25331414, -0.7832358e-1, 0.2189568e-1, -0.1062446e-1, 0.587872e-2,
    -0.25154e-2, 0.53208e-3
  ].reverse();

  function bessel0(x: number) {
    if (x <= 2)
      return -M.log(x / 2) * besseli(x, 0) + _horner(b0_a, (x * x) / 4);
    return (M.exp(-x) / M.sqrt(x)) * _horner(b0_b, 2 / x);
  }

  var b1_a = [
    1.0, 0.15443144, -0.67278579, -0.18156897, -0.1919402e-1, -0.110404e-2,
    -0.4686e-4
  ].reverse();
  var b1_b = [
    1.25331414, 0.23498619, -0.365562e-1, 0.1504268e-1, -0.780353e-2,
    0.325614e-2, -0.68245e-3
  ].reverse();

  function bessel1(x: number) {
    if (x <= 2)
      return (
        M.log(x / 2) * besseli(x, 1) + (1 / x) * _horner(b1_a, (x * x) / 4)
      );
    return (M.exp(-x) / M.sqrt(x)) * _horner(b1_b, 2 / x);
  }

  return _bessel_wrap(bessel0, bessel1, 'BESSELK', 2, 1);
})();

export const bessel = {besselj, bessely, besseli, besselk};
