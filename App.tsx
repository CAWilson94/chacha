import React, { useEffect, useRef } from 'react';
import Chart from './Chart';
import './style.css';

type Props = {};

export interface seriesData {
  timestamp: string;
  symbol: string;
  side: 'Sell' | 'Buy';
  size: number;
  price: number;
} // there are other fields but keeping this to just what we need

const url: string =
  'wss://www.bitmex.com/realtime?subscribe=trade:XBTUSD,liquidation:XBTUSD';

const App = (props: Props) => {
  const connection = useRef<WebSocket | null>(null);

  // I think this is always passing the series as one dot and not the array update @TODO
  const [buySeriesData, setBuySeriesData] = React.useState<seriesData[]>([]);
  const [sellSeriesData, setSellSeriesData] = React.useState<seriesData[]>([]);
  const [sizeSeriesData, setSizeSeriesData] = React.useState<seriesData[]>([]);

  const [isChartToggled, setChartToggled] = React.useState<boolean>(false);

  //  ['timestamp', 'symbol', 'side', 'size', 'price', 'tickDirection', 'trdMatchID', 'grossValue', 'homeNotional', 'foreignNotional', 'trdType']
  const createSeriesDataTrade = async (data: Record<string, any>) => {
    const { timestamp, symbol, side, size, price } = data;
    return { timestamp, symbol, side, size, price };
  };

  const updateSeriesData = async (trade: seriesData, side: string) => {
    let newTrade: seriesData = await createSeriesDataTrade(trade);
    console.log(`NEWTRADE: ${JSON.stringify(newTrade)}`);
    if (side === 'Sell') {
      await setSellSeriesData((prevSellSeriesData) => [
        ...prevSellSeriesData,
        newTrade,
      ]);
      await setSizeSeriesData((prevSizeSeriesData) => [
        ...prevSizeSeriesData,
        newTrade,
      ]);
    } else if (side === 'Buy') {
      await setBuySeriesData((prevBuySeriesData) => [
        ...prevBuySeriesData,
        newTrade,
      ]);
      await setSizeSeriesData((prevSizeSeriesData) => [
        ...prevSizeSeriesData,
        newTrade,
      ]);
    }
  };

  const dataMapper = async (eventData: any) => {
    if (eventData.data) {
      let data = JSON.parse(eventData.data);
      if (data.table == 'trade') {
        if (data.data[0]) {
          await updateSeriesData(data.data[0], data.data[0].side);
        }
      }
    }
  };

  useEffect(() => {
    const socket = new WebSocket(url);
    // Open Connection
    socket.addEventListener('open', (event) => {
      socket.send('Connection Established');
    });

    // Listen for messages
    socket.addEventListener('message', (event) => {
      dataMapper(event);
    });

    connection.current = socket;

    /* return () => {
      if (connection.current) {
        connection.current.close();
      }
    };*/
  }, []);

  return (
    <div>
      <div></div>

      {isChartToggled ? (
        <div>
          <Chart
            buySeriesData={buySeriesData}
            sellSeriesData={sellSeriesData}
            sizeSeriesData={sizeSeriesData}
          />
        </div>
      ) : null}

      <div>
        <button onClick={() => setChartToggled((prevToggled) => !prevToggled)}>
          Toggle State
        </button>
      </div>
    </div>
  );
};

export default App;
