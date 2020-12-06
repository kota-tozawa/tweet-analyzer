import React, { Component } from 'react';
import { Typography, Link } from '@material-ui/core';

class WordCloud extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      ntweets: 800,
      listData: null,
      analysisType: 'wordcloud',
    };
  }

  render() {
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
      </>
    );
  }
}

export default WordCloud;
