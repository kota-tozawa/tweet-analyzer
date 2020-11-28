import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Container,
  makeStyles,
  withStyles,
  FormControl,
} from '@material-ui/core';
import { SendRounded } from '@material-ui/icons';
import { Options } from './common/constants';
import LineGraph from './components/tweetFrequency/LineGraph';

const useStyles = makeStyles({
  interval: {
    marginTop: '16px',
  },
  paper: {
    padding: '24px',
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  errorMessage: {
    fontSize: '0.8rem',
    color: '#F44036',
    marginTop: '8px',
  },
});

// TODO 関数コンポーネントに書き換える
class App extends Component {
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

  handleUserChange(event) {
    const value = event.target.value;
    this.setState({ user: value });
  }

  handleNtweetsChange(event) {
    const value = parseInt(event.target.value);
    this.setState({ ntweets: value });
  }

  render() {
    const { classes } = this.props;
    const { user, ntweets, lineGraphData } = this.state;
    return (
      <Container maxWidth="lg">
        {/* <Paper className={classes.paper} elevation={3}> */}
        <h3 className="mt-3">パラメーター入力</h3>
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
            className={classes.interval}
            variant="contained"
            color="primary"
            endIcon={<SendRounded />}
          >
            Send
          </Button>
        </FormControl>
        {lineGraphData && <LineGraph {...lineGraphData} xAxisLabel="年月" />}
        {/* </Paper> */}
      </Container>
    );
  }
}

export default withStyles(useStyles)(App);
