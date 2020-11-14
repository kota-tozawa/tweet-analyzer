import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col, Card, CardBody } from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import PeriodInput from './PeriodInput'
import LineChart from './LineGraph'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      period: '1year',
      periodData: null,
    }
    this.handlePeriodChange = this.handlePeriodChange.bind(this)
  }

  componentDidMount() {
    window.$(document).on('shiny:connected', () => {
      this.setInputValues()
    })

    window.Shiny.addCustomMessageHandler('periodData', (periodData) =>
      this.setState({ periodData })
    )
  }

  componentDidUpdate() {
    this.setInputValues()
  }

  setInputValues() {
    window.Shiny.onInputChange('period', this.state.period)
  }

  handlePeriodChange(value) {
    this.setState({ period: value })
  }

  render() {
    const { period, periodData } = this.state
    return (
      <Container fluid>
        <h2 className="mt-3">ツイート頻度の推移</h2>
        <Row>
          <Col sm="4">
            <Card style={{ backgroundColor: '#f5f5f5' }}>
              <CardBody>
                <PeriodInput
                  value={period}
                  options={['1month', '1year', 'longest']}
                  onChange={this.handlePeriodChange}
                />
              </CardBody>
            </Card>
          </Col>
          <Col sm="8">
            {periodData && <LineChart {...periodData} xAxisLabel="時間" />}
          </Col>
        </Row>
      </Container>
    )
  }
}

export default hot(module)(App)
