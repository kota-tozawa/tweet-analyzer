import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Label,
  Tooltip,
} from 'recharts'

class LineGraph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeIndex: -1,
    }
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  handleMouseOver(data, index) {
    this.setState({ activeIndex: index })
  }

  handleMouseLeave() {
    this.setState({ activeIndex: -1 })
  }

  renderTooltipWithLabel(props) {
    const label = props.payload[0] && props.payload[0].payload.label
    const newProps = { ...props, content: null }
    return <Tooltip {...newProps} label={label} />
  }

  render() {
    const { breaks, freqs, ticks, xAxisLabel, yAxisLabel } = this.props

    const data = freqs.map((f, i) => ({
      period: breaks[i],
      freq: f,
      label: `(${breaks[i]}: ${f}回]`,
    }))

    console.log(data)

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis
            dataKey="breaks"
            type="string"
            domain={['auto', 'auto']}
            ticks={ticks}
            tickCount={ticks.length}
          >
            <Label value={xAxisLabel} offset={-20} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label
              value={yAxisLabel}
              angle={-90}
              offset={10}
              position="insideLeft"
              style={{ textAnchor: 'middle' }}
            />
          </YAxis>
          <Tooltip
            content={this.renderTooltipWithLabel}
            offset={40}
            isAnimationActive={false}
            labelStyle={{ fontWeight: '700' }}
          />
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    )
  }
}

LineGraph.propTypes = {
  breaks: PropTypes.arrayOf(PropTypes.string).isRequired,
  freqs: PropTypes.arrayOf(PropTypes.number).isRequired,
  ticks: PropTypes.arrayOf(PropTypes.string).isRequired,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
}

LineGraph.defaultProps = {
  xAxisLabel: '期間',
  yAxisLabel: 'ツイート頻度',
}

export default LineGraph
