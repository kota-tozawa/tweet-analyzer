import React from 'react';
import { Typography, Link } from '@material-ui/core';

const Home = () => {
  return (
    <>
      <Typography paragraph>
        ツイートの頻度の時系列グラフ・度数分布表、ツイート内容のワードクラウドなどを可視化するダッシュボード。
      </Typography>
      <Typography paragraph>
        <Link
          href="https://github.com/kota-tozawa/tweet-analyzer"
          target="_blank"
        >
          ソースコードを見る
        </Link>
      </Typography>
    </>
  );
};

export default Home;
