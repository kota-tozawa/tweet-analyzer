/**
 * 任意の桁で四捨五入する関数
 * @param {number} decimal 四捨五入する数値
 * @param {number} digit 小数点何桁以下で四捨五入するか
 * @return {number} 四捨五入した値
 */
export const roundDecimal = (decimal, digit) => {
  return Math.round(decimal * 10 ** digit) / 10 ** digit;
};
