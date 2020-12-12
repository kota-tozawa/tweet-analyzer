import React from 'react';
import { Typography, Link } from '@material-ui/core';

const Home = () => {
  const notes =
    'ご利用にあたっての留意事項：\n' +
    '• 分析対象のツイートには、ユーザーがリツイートしたツイートも含まれます。\n' +
    '• 取得するツイートの量によっては、グラフを表示するのに時間がかかります。\n' +
    '• ワードクラウドやセンチメント分析は、現在日本語でつぶやかれたツイートのみにしか対応しておりません。';
  return (
    <>
      <Typography paragraph>
        ツイートの頻度の時系列プロット・度数分布表、ツイート内容のワードクラウドなどを可視化するダッシュボード。
      </Typography>
      <Typography paragraph>
        <Link
          href="https://github.com/kota-tozawa/tweet-analyzer"
          target="_blank"
        >
          ソースコードを見る
        </Link>
      </Typography>
      <Typography component={'span'}>
        {notes.split('\n').map((t, i) => {
          return <pre key={i}>{t}</pre>;
        })}
      </Typography>
    </>
  );
};

export default Home;
