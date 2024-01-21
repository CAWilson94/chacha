import { seriesData } from './App';
import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import darkUnica from 'highcharts/themes/dark-unica';

interface chartSeriesData {
  buySeriesData: seriesData[];
  sellSeriesData: seriesData[];
  sizeSeriesData: seriesData[];
}

const Chart = (props: chartSeriesData) => {
  const [chartOptions, setChartOptions] = useState({
    title: {
      text: 'Price Series for Buy and Sell',
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        hour: '%H:%M',
        day: '%e. %b',
        month: "%b '%y",
        year: '%Y',
      },
      title: {
        text: 'Timestamp',
      },
    },
    yAxis: [
      {
        title: {
          text: 'Sell Price',
        },
      },
      {
        title: {
          text: 'Buy Price',
        },
      },
      {
        title: {
          text: 'size',
        },
        opposite: true,
      },
    ],
    tooltip: {
      shared: true,
    },
    animation: true,
    series: [
      {
        type: 'spline',
        name: 'Sell',
        yAxis: 0,
        data: props.sellSeriesData.map((dataPoint) => [
          new Date(dataPoint.timestamp).getTime(),
          dataPoint.price,
        ]),
      },
      {
        type: 'spline',
        name: 'Buy',
        yAxis: 1,
        data: props.buySeriesData.map((dataPoint) => [
          new Date(dataPoint.timestamp).getTime(),
          dataPoint.price,
        ]),
      },
      {
        type: 'spline',
        name: 'Size',
        yAxis: 2,
        data: props.sizeSeriesData.map((dataPoint) => [
          new Date(dataPoint.timestamp).getTime(),
          dataPoint.size,
        ]),
      },
    ],
  });

  useEffect(() => {
    darkUnica(Highcharts);
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      series: [
        {
          type: 'spline',
          name: 'Sell',
          yAxis: 0,
          data: props.sellSeriesData.map((dataPoint) => [
            new Date(dataPoint.timestamp).getTime(),
            dataPoint.price,
          ]),
        },
        {
          type: 'spline',
          name: 'Buy',
          yAxis: 1,
          data: props.buySeriesData.map((dataPoint) => [
            new Date(dataPoint.timestamp).getTime(),
            dataPoint.price,
          ]),
        },
        {
          type: 'spline',
          name: 'Size',
          yAxis: 2,
          data: props.sizeSeriesData.map((dataPoint) => [
            new Date(dataPoint.timestamp).getTime(),
            dataPoint.size,
          ]),
        },
      ],
    }));
  }, [props.sellSeriesData, props.buySeriesData, props.sizeSeriesData]);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default Chart;

/**
 * probably need to change range to make things look nicer?split up timestamp a bit more?
 */
