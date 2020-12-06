import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import UserAndNtweetsForm from '../molecules/UserAndNtweetsForm';
import LineGraph from '../organisms/LineGraph';

// TODO 関数コンポーネントに書き換える。現状Hooksを用いたWebSocketによるRとJavaScript間の通信を上手く扱えずできていない。
class TweetFreq extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      ntweets: 400,
      dataProcessed: null,
      analysisType: 'tweetFreq',
    };
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleNtweetsChange = this.handleNtweetsChange.bind(this);
  }

  // JSとRの間で、WebSocketでデータをやり取りする
  componentDidMount() {
    // JS to R
    window.$(document).on('shiny:connected', () => {
      this.setInputValues();
    });

    // R to JS
    window.Shiny.addCustomMessageHandler('dataProcessed', (dataProcessed) =>
      this.setState({ dataProcessed })
    );
  }

  handleUserChange(e) {
    const value = e.target.value;
    this.setState({ user: value });
  }

  handleNtweetsChange(e) {
    const value = e.target.value;
    this.setState({ ntweets: value });
  }

  render() {
    const { dataProcessed, analysisType } = this.state;
    return (
      <>
        <Typography paragraph>ツイート頻度の時系列グラフ</Typography>
        <UserAndNtweetsForm analysisType={analysisType} />
        <Typography paragraph>
          {dataProcessed && dataProcessed['title']}
        </Typography>
        {dataProcessed && (
          <LineGraph
            breaks={dataProcessed['breaks']}
            freqs={dataProcessed['freqs']}
            ticks={dataProcessed['ticks']}
          />
        )}
      </>
    );
  }
}

export default TweetFreq;
