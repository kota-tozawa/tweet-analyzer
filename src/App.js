import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col, Card, CardBody } from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ParameterInput } from './components/ParameterInput'

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
        <h2 className="mt-3">ツイート頻度分析</h2>
        <Row>
          <Col sm="4">
            <h3 className="mt-3">分析パラメーター入力</h3>
            <ParameterInput />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default hot(module)(App)
