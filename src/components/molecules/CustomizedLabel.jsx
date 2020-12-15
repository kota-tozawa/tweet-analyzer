import React from 'react';
import PropTypes from 'prop-types';

const CustomizedLabel = ({ x, y, fill, value }) => {
  return (
    // TODO ラベルの座標の位置が棒グラフのちょうど右あたりにくるように工夫する
    <text
      x={1540}
      y={y + 43}
      fill={fill}
      dy={-6}
      textAnchor="end"
      fontSize={26}
    >
      {value}
    </text>
  );
};

CustomizedLabel.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  fill: PropTypes.string,
  value: PropTypes.number,
};

export default CustomizedLabel;
