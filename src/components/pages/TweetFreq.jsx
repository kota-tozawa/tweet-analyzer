import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import * as Consts from '../atoms/constants';
import BaseForm from '../organisms/Forms/BaseForm';
import TweetFreqTimeSeries from '../organisms/TweetFreqViz/TweetFreqTimeSeries';
import TweetFreqStatisticsTable from '../organisms/TweetFreqViz/TweetFreqStatisticsTable';

// TODO 関数コンポーネントに書き換える。現状Hooksを用いたWebSocketによるRとJavaScript間の通信を上手く扱えずできていない。
class TweetFreq extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataIngested: null,
      analysisType: 'tweetFreq',
    };
  }

  // JSとRの間で、WebSocketでデータをやり取りする
  componentDidMount() {
    // R to JS
    window.Shiny.addCustomMessageHandler('dataIngested', (dataIngested) =>
      this.setState({ dataIngested })
    );
  }

  render() {
    const { dataIngested, analysisType } = this.state;
    const descriptions =
      'ツイートテキストがないツイートが含まれている場合（e.g.: 写真のみのツイート）、ツイート頻度合計と取得するツイート数の値が等しくなりません。\n' +
      '小数点以下の値を含む数値は、小数点第3桁以下で四捨五入して表示しています。';
    return (
      <>
        <h2>ツイート頻度の時系列プロット</h2>
        <BaseForm
          analysisType={analysisType}
          options={Consts.ntweetOptionsLong}
        />
        <h3>{dataIngested && dataIngested['title']}</h3>
        {dataIngested && (
          <TweetFreqTimeSeries
            breaks={dataIngested['breaks']}
            freqs={dataIngested['freqs']}
          />
        )}
        <h3>{dataIngested && '記述統計量'}</h3>
        <Typography component={'span'}>
          {dataIngested &&
            descriptions.split('\n').map((t, i) => {
              return <pre key={i}>{t}</pre>;
            })}
        </Typography>
        {dataIngested && (
          <TweetFreqStatisticsTable
            summaryStatistics={dataIngested['summary_statistics']}
          />
        )}
      </>
    );
  }
}

export default TweetFreq;
