import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import UserAndNtweetsForm from '../organisms/UserAndNtweetsForm';
import TweetFreqTimeSeriesViz from '../organisms/TweetFreqViz/TweetFreqTimeSeriesViz';

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
    return (
      <>
        <Typography paragraph>ツイート頻度の時系列プロット</Typography>
        <UserAndNtweetsForm analysisType={analysisType} />
        <Typography paragraph>
          {dataIngested && dataIngested['title']}
        </Typography>
        {dataIngested && (
          <TweetFreqTimeSeriesViz
            breaks={dataIngested['breaks']}
            freqs={dataIngested['freqs']}
            ticks={dataIngested['ticks']}
          />
        )}
      </>
    );
  }
}

export default TweetFreq;
