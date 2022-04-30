import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import converter from "hex2dec";
import moment from "moment";
import axios from "axios";
import "./buybacks.scss";

const burn_address = "0x0801f9f4a28130AD7302AAb0d0309A138B1D63D3";
const zero_padded_burn_address = "0x0000000000000000000000000801f9f4a28130ad7302aab0d0309a138b1d63d3";
const wavax_padded_address = "0x00000000000000000000000095189f25b4609120f72783e883640216e92732da";
const exchange_address = "0x60ae616a2155ee3d9a68541ba4544862310933d4";
const api_endpoint = `https://api.snowtrace.io/api?module=account&action=txlist&address=${burn_address}&startblock=9067470&sort=desc`;
const price_endpoint = "https://api.coingecko.com/api/v3/simple/price?ids=THOR&vs_currencies=USD";

const BuyBackRow = ({ data }) => {
  const date = new Date(Number(data.timestamp) * 1000);
  return (
    <div className="buybacks_row row">
      <Col md={3}>
        {moment(date).format("MMMM Do YYYY")}
      </Col>
      <Col md={3}>
        Avax used: {data.avax.toLocaleString()}
      </Col>
      <Col md={3}>
        Thor bought: {data.thor.toLocaleString()}
      </Col>
      <Col md={3}>
        <a href={`https://snowtrace.io/tx/${data.txid}`} target="_blank" rel="noreferrer">See on explorer</a>
      </Col>
    </div>
  )
};

const TotalBuyback = ({ totalBuyBack, thorPrice }) => {
  return (
    <div style={{"font-size": "2.2rem"}}>
      Total Thor bought back: <span>{totalBuyBack?.toLocaleString()}</span> worth <span>${(thorPrice*totalBuyBack)?.toLocaleString()}</span>
    </div>
  )
};

const Buybacks = () => {
  const [ totalBuyBack, setTotalBuyBack ] = useState(null);
  const [ thorPrice, setThorPrice ] = useState(null);
  const [ txids, setTxIds ] = useState(null);

  const gotData = !totalBuyBack;

  useEffect(() => {
    const getPrice = async () => {
      axios.get(price_endpoint).then(
        function(resp){
          setThorPrice(resp.data.thor.usd);
        }
      );
    }

    const getData = async () => {
      var { data: transactionList } = await axios(api_endpoint);
      transactionList = transactionList.result;
      const formated_txids = [];
      var total_buyback = 0;
      for(var i in transactionList){
        const { to } = transactionList[i];
        if(to === exchange_address){
          const timestamp = transactionList[i].timeStamp;
          const txid = transactionList[i].hash;
          var avax_amount;
          var thor_amount;
          var { data: logs } = await axios(`https://api.snowtrace.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${txid}`);
          logs = logs.result.logs;
          for(i in logs){
            const { topics } = logs[i];
            if(topics.length === 3){
              if(topics[2] === wavax_padded_address){
                avax_amount = converter.hexToDec(logs[i].data) / 10**18;
              }
              if(topics[2] === zero_padded_burn_address && topics[1] === wavax_padded_address){
                thor_amount = converter.hexToDec(logs[i].data) / 10**18;
                total_buyback = total_buyback + thor_amount;
              }
            }
          }
          formated_txids.push({txid: txid, avax: avax_amount, thor: thor_amount, timestamp: timestamp});
        }
      }
      setTotalBuyBack(total_buyback);
      setTxIds(formated_txids);
    };

    getPrice();
    getData();
  }, [gotData]);


  return (
    <div className="buybacks">
      {totalBuyBack && <TotalBuyback totalBuyBack={totalBuyBack} thorPrice={thorPrice} />}
      <br />
      <br />
      {!gotData ? (txids?.map((data, i) => (
        <BuyBackRow data={data} key={i} />
      ))) : (
        <div className='spinner-border text-danger d-block mx-auto'></div>
      )}
    </div>
  );
};

export default Buybacks;
