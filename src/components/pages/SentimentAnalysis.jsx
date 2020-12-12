import React, { Component } from 'react';
import { Typography, Link } from '@material-ui/core';
import UserAndNtweetsForm from '../organisms/UserAndNtweetsForm';
import SentimentAnalysisViz from '../organisms/SentimentAnalysisViz';

// TODO 関数コンポーネントに書き換える。現状Hooksを用いたWebSocketによるRとJavaScript間の通信を上手く扱えずできていない。
class SentimentAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataIngested: null,
      analysisType: 'sentimentAnalysis',
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
      '感情極性値は、低いほどネガティブであることを表す。\n' +
      'グラフ上部の凡例横にある「-o-」をクリックすると、線をトグルできる。';
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
        <UserAndNtweetsForm analysisType={analysisType} />
        <Typography paragraph>
          {dataIngested && dataIngested['title']}
        </Typography>
        <Typography component={'span'}>
          {dataIngested &&
            descriptions.split('\n').map((t, i) => {
              return <pre key={i}>{t}</pre>;
            })}
        </Typography>
        {dataIngested && (
          <SentimentAnalysisViz
            breaks={dataIngested['breaks']}
            scores={dataIngested['scores']}
            lengths={dataIngested['lengths']}
          />
        )}
      </>
    );
  }
}

export default SentimentAnalysis;
