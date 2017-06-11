const Utils = {}

/* Array.prototype.fill Polyfill By https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill */
/* eslint-disable */
if (!Array.prototype.fill) {
  Object.defineProperty(Array.prototype, 'fill', {
    value: function(value) {

      // Steps 1-2.
      if (this == null) {
        throw new TypeError('this is null or not defined');
      }

      var O = Object(this);

      // Steps 3-5.
      var len = O.length >>> 0;

      // Steps 6-7.
      var start = arguments[1];
      var relativeStart = start >> 0;

      // Step 8.
      var k = relativeStart < 0 ?
        Math.max(len + relativeStart, 0) :
        Math.min(relativeStart, len);

      // Steps 9-10.
      var end = arguments[2];
      var relativeEnd = end === undefined ?
        len : end >> 0;

      // Step 11.
      var final = relativeEnd < 0 ?
        Math.max(len + relativeEnd, 0) :
        Math.min(relativeEnd, len);

      // Step 12.
      while (k < final) {
        O[k] = value;
        k++;
      }

      // Step 13.
      return O;
    }
  });
}
/* eslint-enable */

/*
* Wrap a dyadic array by fill
* @params arr     the source arr
* @params fill    which to wrap source arr
*
*               0 0 0 0 0
*   1 1 1       0 1 1 1 0
*   1 1 1   =>  0 1 1 1 0
*   1 1 1       0 1 1 1 0
*               0 0 0 0 0
*/

Utils.dyadicArrayWrap = function (arr, fill) {
  let firstRowLength = 0
  let lastRowLength = 0
  arr.forEach(function (row, index) {
    if (index === 0) {
      firstRowLength = row.length + 2
    } else if (index === arr.length - 1) {
      lastRowLength = row.length + 2
    }
    row.splice(0, 0, Object.assign({}, fill).valueOf())
    row.splice(row.length, 0, Object.assign({}, fill).valueOf())
  })
  arr.splice(0, 0, Array(firstRowLength).fill(0).map(e => Object.assign({}, fill).valueOf()))
  arr.splice(arr.length, 0, Array(lastRowLength).fill(0).map(e => Object.assign({}, fill).valueOf()))
  return arr
}

// 从数组中随机选取一条数据，set用于排重
const arrayRandomItem = function (arr, set) {
  let arrlen = arr.length
  let rand = ~~(Math.random() * arrlen)
  return set.has(rand) ? arrayRandomItem(arr, set) : (set.add(rand), arr[rand])
}

// 从数组中随机选取几条非重复数据
Utils.arrayRandom = function (arr, count) {
  if (arr.length <= count) {
    Utils.arrayShuffle(arr)
    return arr
  }
  let set = new Set()
  return Array(count).fill(0).map(e => arrayRandomItem(arr, set))
}

// 随机排序数组
Utils.arrayShuffle = function (arr) {
  for (var j, x, i = arr.length; i; j = ~~(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
  return arr
}

// 用一个数组来随机填充一个指定大小的数组，groupCount用于将数据分组，每组数据必须是groupCount的倍数
Utils.arrayFillByRandomGroup = function (fillCount, group, groupCount = 2) {
  let groupLength = group.length
  let perGroup = ~~(~~(fillCount / groupLength) / groupCount) * groupCount
  let rest = fillCount - perGroup * groupLength
  let countArray = group.map((e, i) => rest / groupCount > i ? perGroup + groupCount : perGroup)
  let result = countArray.reduce((prev, curr, index) => prev.concat(Array(curr).fill(0).map(e => Object.assign({}, group[index]).valueOf())), [])
  Utils.arrayShuffle(result)
  return result
}

// 将一维数组根据col转换为二维数组
Utils.arrayToDyadic = function (arr, col) {
  let result = []
  arr.forEach((e, i) => {
    let index = ~~(i / col)
    let mod = i % col
    result[index] || (result[index] = [])
    result[index][mod] = e
  })
  return result
}

export default Utils
