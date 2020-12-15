import React, { Component } from 'react';
import { Typography, Link } from '@material-ui/core';
import * as Consts from '../atoms/constants';
import FormForSentimentAnalysis from '../organisms/Forms/FormForSentimentAnalysis';
import SentimentPolarityAnalysisViz from '../organisms/SentimentAnalysisViz/SentimentAnalysisUsingPolarityDictionaryViz';
import SentimentAnalysisWithComprehendViz from '../organisms/SentimentAnalysisViz/SentimentAnalysisUsingAmazonComprehendViz';

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
        <FormForSentimentAnalysis
          analysisType={analysisType}
          options={Consts.ntweetOptionsLong}
          options2nd={Consts.ntweetOptionsShort}
        />
        <Typography paragraph>
          {dataIngested && dataIngested['title_polarity']}
        </Typography>
        <Typography component={'span'}>
          {dataIngested &&
            descriptions.split('\n').map((t, i) => {
              return <pre key={i}>{t}</pre>;
            })}
        </Typography>
        {dataIngested && (
          <SentimentPolarityAnalysisViz
            breaks={dataIngested['breaks']}
            scores={dataIngested['scores']}
            lengths={dataIngested['lengths']}
          />
        )}
        <Typography paragraph>
          {dataIngested && dataIngested['title_comprehend']}
        </Typography>
        {dataIngested && (
          <SentimentAnalysisWithComprehendViz
            determinedSentimentList={dataIngested['determined_sentiment_list']}
          />
        )}
      </>
    );
  }
}

export default SentimentAnalysis;
