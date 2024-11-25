const loopCount: {[key: string]: number} = {};
const loopTimer: {[key: string]: ReturnType<typeof setTimeout>} = {};
const loopResult: {[key: string]: boolean} = {};

export function loopTooMuch(key: string, maxSpeed = 20) {
  if (loopResult[key]) {
    return loopResult[key];
  }

  clearTimeout(loopTimer[key]);
  loopTimer[key] = setTimeout(() => {
    delete loopCount[key];
    delete loopTimer[key];
  }, 1000);

  if (loopCount[key] && loopCount[key] > maxSpeed) {
    loopResult[key] = true;
    return true;
  }

  loopCount[key] = (loopCount[key] || 0) + 1;
  return false;
}
