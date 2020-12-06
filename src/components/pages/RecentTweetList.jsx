import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

class RecentTweetList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      listData: null,
      analysisType: 'recentTweetList',
    };
  }

  render() {
    return (
      <>
        <Typography paragraph>直近3ヶ月のツイートデータ一覧</Typography>
      </>
    );
  }
}

export default RecentTweetList;
