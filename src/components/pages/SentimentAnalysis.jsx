import React, { Component } from 'react';
import { Typography, Link } from '@material-ui/core';
import * as Consts from '../atoms/constants';
import FormForSentimentAnalysis from '../organisms/Forms/FormForSentimentAnalysis';
import SentimentPolarityTimeSeries from '../organisms/SentimentAnalysisViz/SentimentPolarityTimeSeries';
import PolarityStatisticsTable from '../organisms/SentimentAnalysisViz/PolarityStatisticsTable';
import SentimentClassificationViz from '../organisms/SentimentAnalysisViz/SentimentClassification';

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
    const descriptionsForPolarityTimeSeries =
      '感情極性値は、低いほどネガティブであることを表します（-15以下だと比較的ネガティブ、-1以上ならば比較的ポジティブ？）。\n' +
      'グラフ上部の凡例横にある「-o-」をクリックすると、線をトグルできます。';
    const descriptionsForSummaryStatistics =
      '小数点以下の値を含む数値は、小数点第3桁以下で四捨五入して表示しています。';
    return (
      <>
        <h2>ツイート内容のセンチメント分析</h2>
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
        <h3>{dataIngested && dataIngested['title_polarity']}</h3>
        <Typography component={'span'}>
          {dataIngested &&
            descriptionsForPolarityTimeSeries.split('\n').map((t, i) => {
              return <pre key={i}>{t}</pre>;
            })}
        </Typography>
        {dataIngested && (
          <SentimentPolarityTimeSeries
            breaks={dataIngested['breaks']}
            scores={dataIngested['scores']}
            lengths={dataIngested['lengths']}
          />
        )}
        <h3>{dataIngested && '感情極性値時系列データの記述統計量'}</h3>
        <Typography component={'span'}>
          {dataIngested &&
            descriptionsForSummaryStatistics.split('\n').map((t, i) => {
              return <pre key={i}>{t}</pre>;
            })}
        </Typography>
        {dataIngested && (
          <PolarityStatisticsTable
            summaryStatisticsEm={dataIngested['summary_statistics_em']}
            summaryStatisticsLen={dataIngested['summary_statistics_len']}
          />
        )}
        <h3>{dataIngested && dataIngested['title_comprehend']}</h3>
        {dataIngested && (
          <SentimentClassificationViz
            determinedSentimentList={dataIngested['determined_sentiment_list']}
          />
        )}
      </>
    );
  }
}

export default SentimentAnalysis;
