import React, { Component } from 'react';
import * as Consts from '../atoms/constants';
import BaseForm from '../organisms/Forms/BaseForm';
import TweetFreqTimeSeries from '../organisms/TweetFreqViz/TweetFreqTimeSeries';

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
      </>
    );
  }
}

export default TweetFreq;
