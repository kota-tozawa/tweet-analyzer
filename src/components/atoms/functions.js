/**
 * 任意の桁で四捨五入する関数
 * @param {number} decimal 四捨五入する数値
 * @param {number} digit 小数点何桁以下で四捨五入するか
 * @return {number} 四捨五入した値
 */
export const roundDecimal = (decimal, digit) => {
  return Math.round(decimal * 10 ** digit) / 10 ** digit;
};

/**
 * 数値をカンマ区切りにする関数
 * @param {number} num カンマ区切りにする数値
 * @return {number} カンマ区切りにされた数値（文字列）
 */
export const separateNumberWithCommas = (num) => {
  const s = String(num).split('.');
  let ret = String(s[0]).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  if (s.length > 1) {
    ret += '.' + s[1];
  }
  return ret;
};
