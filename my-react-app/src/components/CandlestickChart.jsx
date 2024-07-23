// src/CandlestickChart.jsx

import React from 'react';
import { ChartCanvas, Chart } from 'react-financial-charts';
import {
  CandlestickSeries,
  XAxis,
  YAxis,
  discontinuousTimeScaleProvider,
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
  OHLCTooltip,
} from 'react-financial-charts';
import { timeFormat } from 'd3-time-format';
import { format } from 'd3-format';

const dateFormat = timeFormat("%Y-%m-%d");
const numberFormat = format(".2f");

const CandlestickChart = ({ data, width, height }) => {
  const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => new Date(d.Date));
  const {
    data: chartData,
    xScale,
    xAccessor,
    displayXAccessor,
  } = xScaleProvider(data);
  console.log("here" , data)
  return (
    <ChartCanvas
      height={height}
      width={width}
      ratio={1}
      margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
      data={chartData}
      xScale={xScale}
      xAccessor={xAccessor}
      displayXAccessor={displayXAccessor}
    >
      <Chart id={1} yExtents={d => [d.High, d.Low]}>
        <XAxis />
        <YAxis />

        <CandlestickSeries />
        <OHLCTooltip origin={[-40, 0]} />
        <MouseCoordinateX displayFormat={dateFormat} />
        <MouseCoordinateY displayFormat={numberFormat} />
      </Chart>
      <CrossHairCursor />
    </ChartCanvas>
  );
};

export default CandlestickChart;
