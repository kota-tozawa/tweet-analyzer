// 折れ線グラフは Recharts.js の方が見た目がきれいだと判断したため Recharts.js を用いる。
import React from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import * as Colors from '../../atoms/colors';

const CustomizedLabel = ({ x, y, fill, value }) => {
  return (
    // TODO ラベルの座標の位置が棒グラフのちょうど右あたりにくるように工夫する
    <text
      x={1540}
      y={y + 47}
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

const SentimentClassification = ({ determinedSentimentList }) => {
  let pos = 0;
  let neg = 0;
  let neut = 0;
  let mixed = 0;

  // Amazon Comprehend により推定されたツイートのセンチメントの数を種類ごとに数える
  determinedSentimentList.forEach((sentiment) => {
    sentiment === 'POSITIVE'
      ? pos++
      : sentiment === 'NEGATIVE'
      ? neg++
      : sentiment === 'NEUTRAL'
      ? neut++
      : mixed++;
  });

  const data = [
    { sentiment: '肯定的', value: pos, color: Colors.blue },
    { sentiment: '否定的', value: neg, color: Colors.red },
    { sentiment: '中立的', value: neut, color: Colors.green },
    { sentiment: '肯定と否定の混合', value: mixed, color: Colors.purple },
  ];

  // data['value'] で昇順ソート（グラフ上では降順）
  data.sort((a, b) => {
    return a.value > b.value ? -1 : a.value < b.value ? 1 : 0;
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        width={600}
        height={500}
        data={data}
        layout="vertical"
        margin={{
          top: 30,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="value"
          type="number"
          label={{
            value: 'ツイート数',
            position: 'insideBottom',
            offset: -15,
          }}
        />
        <YAxis
          dataKey="sentiment"
          type="category"
          label={{
            value: 'センチメント',
            position: 'insideLeft',
            offset: 0,
            angle: -90,
          }}
          width={140}
        />
        <Tooltip />
        <Bar dataKey="value" label={<CustomizedLabel />}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

SentimentClassification.propTypes = {
  determinedSentimentList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SentimentClassification;
