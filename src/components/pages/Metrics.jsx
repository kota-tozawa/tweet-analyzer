import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Consts from '../atoms/constants';
import { Grid, withStyles } from '@material-ui/core';
import BaseForm from '../organisms/Forms/BaseForm';
import MetricsTable from '../organisms/MetricsViz/MetricsTable';
import MentionsTable from '../organisms/MetricsViz/MentionsTable';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

// TODO 関数コンポーネントに書き換える。現状Hooksを用いたWebSocketによるRとJavaScript間の通信を上手く扱えずできていない。
class Metrics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataIngested: null,
      analysisType: 'metrics',
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
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h2>各種メトリクス一覧</h2>
          </Grid>
          <Grid item xs={12}>
            <BaseForm
              analysisType={analysisType}
              options={Consts.ntweetOptionsLong}
            />
          </Grid>
          <Grid item xs={12}>
            <h3>{dataIngested && 'メトリクス一覧'}</h3>
            {dataIngested && <MetricsTable metrics={dataIngested['metrics']} />}
          </Grid>
          <Grid item xs={3}>
            <h3>{dataIngested && 'よくメンションするユーザー トップ10'}</h3>
            {dataIngested && (
              <MentionsTable metrics={dataIngested['metrics']} />
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

Metrics.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Metrics);
