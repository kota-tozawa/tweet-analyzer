import React from 'react';
import PropTypes from 'prop-types';
import ReactWordcloud from 'react-wordcloud';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

const options = {
  colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
  enableTooltip: true,
  deterministic: false,
  fontFamily: 'impact',
  fontSizes: [20, 160],
  fontStyle: 'normal',
  fontWeight: 'normal',
  padding: 1,
  rotations: 3,
  rotationAngles: [0, 90],
  scale: 'sqrt',
  spiral: 'archimedean',
  transitionDuration: 1000,
};

const WordCloudViz = ({ words, freqs }) => {
  const data = freqs.map((freq, i) => ({
    text: words[i],
    value: freq,
  }));
  return (
    <div style={{ height: 800, width: 1200 }}>
      <ReactWordcloud options={options} words={data} maxWords={100} />
    </div>
  );
};

WordCloudViz.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string).isRequired,
  freqs: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default WordCloudViz;
