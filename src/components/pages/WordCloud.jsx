import React, { Component } from 'react';
import { Typography, Link } from '@material-ui/core';
import * as Consts from '../atoms/constants';
import BaseForm from '../organisms/Forms/BaseForm';
import WordCloudViz from '../organisms/WordCloudViz/WordCloudViz';

// TODO 関数コンポーネントに書き換える。現状Hooksを用いたWebSocketによるRとJavaScript間の通信を上手く扱えずできていない。
class WordCloud extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataIngested: null,
      analysisType: 'wordcloud',
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
        <Typography paragraph>ツイート内容のワードクラウド</Typography>
        <Typography paragraph>
          <Link
            href="https://ja.wikipedia.org/wiki/%E3%82%BF%E3%82%B0%E3%82%AF%E3%83%A9%E3%82%A6%E3%83%89"
            target="_blank"
          >
            ワードクラウドとは？
          </Link>
        </Typography>
        <BaseForm
          analysisType={analysisType}
          options={Consts.ntweetOptionsLong}
        />
        <Typography paragraph>
          {dataIngested && dataIngested['title']}
        </Typography>
        {dataIngested && (
          <WordCloudViz
            words={dataIngested['words']}
            freqs={dataIngested['freqs']}
          />
        )}
      </>
    );
  }
}

export default WordCloud;
