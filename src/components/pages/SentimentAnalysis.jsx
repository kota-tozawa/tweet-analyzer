import React from 'react';
import { Typography, Link } from '@material-ui/core';

const SentimentAnalysis = () => {
  return (
    <>
      <Typography paragraph>ツイート内容のセンチメント分析</Typography>
      <Typography paragraph>
        <Link
          href="https://lionbridge.ai/ja/articles/sentiment-analysis-101/"
          target="_blank"
        >
          センチメント分析（感情分析）とは？
        </Link>
      </Typography>
    </>
  );
};

export default SentimentAnalysis;
