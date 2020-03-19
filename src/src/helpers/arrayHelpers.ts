export default class ArrayHelpers {
  static min<T, V>(array:T[], selector:(item:T) => V) : T | undefined {
    let min:T | undefined = undefined;
    let minVal:V | undefined = undefined;
    array.forEach(val => {
      const selectedVal = selector(val);
      if (min === undefined || selectedVal < minVal!) {
        min = val;
        minVal = selectedVal;
      }
    });
    return min;
  }
  static max<T, V>(array:T[], selector:(item:T) => V) : T | undefined {
    let max:T | undefined = undefined;
    let maxVal:V | undefined = undefined;
    array.forEach(val => {
      const selectedVal = selector(val);
      if (max === undefined || selectedVal > maxVal!) {
        max = val;
        maxVal = selectedVal;
      }
    });
    return max;
  }
  static insertSorted<T>(array:T[], item:T, comparer:(a:T, b:T) => -1|0|1) {
    for (let i = 0; i < array.length; i++) {
      if (comparer(item, array[i]) < 0) {
        array.splice(i, 0, item);
        return;
      }
    }
    array.push(item);
  }
}