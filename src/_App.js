import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Input, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Options } from './common/constants';
import UserInput from './components/input/UserInput';
import PeriodInput from './components/input/PeriodInput';
import LineGraph from './components/tweetFrequency/LineGraph';

// TODO 関数コンポーネントに書き換える
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      period: '',
      lineGraphData: null,
    };
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePeriodChange = this.handlePeriodChange.bind(this);
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
    window.Shiny.onInputChange('period', this.state.period);
  }

  handleUserChange(value) {
    this.setState({ user: value });
  }

  handlePeriodChange(value) {
    this.setState({ period: value });
  }

  render() {
    const { user, period, lineGraphData } = this.state;
    return (
      <Container fluid>
        <h2 className="mt-3">ツイート頻度の推移</h2>
        <Row>
          <Col sm="4">
            <Card style={{ backgroundColor: '#f5f5f5' }}>
              <CardBody>
                <h3 className="mt-3">パラメーターを入力</h3>
                <UserInput value={user} onChange={this.handleUserChange} />
                <PeriodInput
                  value={period}
                  options={Options}
                  onChange={this.handlePeriodChange}
                />
                {/* TODO ボタンを右端に表示 */}
                <Button type="submit">OK</Button>
              </CardBody>
            </Card>
          </Col>
          <Col sm="8">
            {lineGraphData && (
              <LineGraph {...lineGraphData} xAxisLabel="年月" />
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
