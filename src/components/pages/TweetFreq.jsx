import React, { Component } from 'react';
import {
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
} from '@material-ui/core';
import { SendRounded } from '@material-ui/icons';
import { Options } from '../atoms/constants';
import LineGraph from '../organisms/LineGraph';

// TODO shinyサーバーへの値の送信が「send」ボタンを押す前に行われてしまう。フォームバリデーション追加などで対応？
class TweetFreq extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      ntweets: 400,
      lineGraphData: null,
    };
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleNtweetsChange = this.handleNtweetsChange.bind(this);
  }

  componentDidMount() {
    window.$(document).on('shiny:connected', () => {
      this.setInputValues();
    });

    window.Shiny.addCustomMessageHandler('lineGraphData', (lineGraphData) =>
      this.setState({ lineGraphData })
    );
  }

  componentDidUpdate() {
    this.setInputValues();
  }

  setInputValues() {
    window.Shiny.onInputChange('user', this.state.user);
    window.Shiny.onInputChange('ntweets', this.state.ntweets);
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
    const { user, ntweets, lineGraphData } = this.state;
    return (
      <>
        <Typography paragraph>ツイート頻度の時系列グラフ</Typography>
        <FormControl margin="normal">
          <TextField
            required
            id="user"
            value={user}
            placeholder="Twitterのユーザー名"
            label="Twitterのユーザー名"
            variant="outlined"
            fullWidth
            onChange={this.handleUserChange}
          />
          <Select
            required
            id="ntweets"
            value={ntweets}
            onChange={this.handleNtweetsChange}
            fullWidth
          >
            {Options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            endIcon={<SendRounded />}
          >
            Send
          </Button>
        </FormControl>
        {lineGraphData && <LineGraph {...lineGraphData} xAxisLabel="年月" />}
      </>
    );
  }
}

export default TweetFreq;
