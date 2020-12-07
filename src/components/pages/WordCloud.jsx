import React, { Component } from 'react';
import { Typography, Link } from '@material-ui/core';
import UserAndNtweetsForm from '../molecules/UserAndNtweetsForm';
import WordCloudViz from '../organisms/WordCloudViz';

// TODO 関数コンポーネントに書き換える。現状Hooksを用いたWebSocketによるRとJavaScript間の通信を上手く扱えずできていない。
class WordCloud extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      ntweets: 800,
      dataProcessed: null,
      analysisType: 'wordcloud',
    };
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleNtweetsChange = this.handleNtweetsChange.bind(this);
  }

  // JSとRの間で、WebSocketでデータをやり取りする
  componentDidMount() {
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
        <Typography paragraph>ツイート内容のワードクラウド</Typography>
        <Typography paragraph>
          <Link
            href="https://ja.wikipedia.org/wiki/%E3%82%BF%E3%82%B0%E3%82%AF%E3%83%A9%E3%82%A6%E3%83%89"
            target="_blank"
          >
            ワードクラウドとは？
          </Link>
        </Typography>
        <UserAndNtweetsForm analysisType={analysisType} />
        <Typography paragraph>
          {dataProcessed && dataProcessed['title']}
        </Typography>
        {dataProcessed && (
          <WordCloudViz
            words={dataProcessed['words']}
            freqs={dataProcessed['freqs']}
          />
        )}
      </>
    );
  }
}

export default WordCloud;
