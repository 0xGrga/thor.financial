import { useEffect, useState } from "react";
import { Col } from "react-bootstrap"
import axios from "axios";
import "./portfolio.scss";


const invesment_address = "0x8942904901b65A544549ed57b66a43187522Afe3";
const chains = ["eth", "bsc", "matic", "ftm", "avax"];

const balance_endpoint = `https://api.debank.com/token/balance_list?user_addr=${invesment_address}&is_all=false&chain=`;
const defi_endpoint = `https://api.debank.com/portfolio/project_list?user_addr=${invesment_address}`;

const Networks = ({portfolio}) => {
  const chainsBalance = {};
  chains.map(id => chainsBalance[id] = 0);
  let totalWalletBalance = 0;

  portfolio.forEach(dict => {
    chainsBalance[dict.chain] += dict.usd_value;
    totalWalletBalance += dict.usd_value;
  })

  return (
    <div className="portfolio_row row">
      <span style={{paddingBottom: "1rem"}}>Network Distribution</span>
      {chains.map(chain => (
        <Col md={2}>
          <div className="portfolio_row_item">
            <img src={`${process.env.PUBLIC_URL}/${chain}.svg`} alt="icon" />
            {chain.replace(/^\w/, (c) => c.toUpperCase())}
            <span>${Math.round(chainsBalance[chain]).toLocaleString()} ({Math.round(100 * chainsBalance[chain] / totalWalletBalance)}%)</span>
          </div>
        </Col>
      ))}
    </div>
  );
};

const WalletRow = ({data}) => {



  return (
    <div className="portfolio_wallet_row row">
      <Col md={3}>
        <img src={data.logo} alt="" />
        {data.symbol}
      </Col>
      <Col md={3}>
        {data.balance.toLocaleString()}
      </Col>
      <Col md={3}>
        ${data.price.toLocaleString()}
      </Col>
      <Col md={3} >
        ${data.usd_value.toLocaleString()}
      </Col>
    </div>
  );
};

const Wallet = ({portfolio}) => {
  return (
    <div className="portfolio_wallet row">
      <div className="portfolio_wallet_row row" style={{fontSize: "1.3rem"}}>
        <Col md={3}>
          Asset
        </Col>
        <Col md={3}>
          Balance
        </Col>
        <Col md={3}>
          Price
        </Col>
        <Col md={3}>
          Value
        </Col>
      </div>
      {portfolio.map((data, i) => (data.usd_value > 10 && <WalletRow data={data} key={i}/>))}
    </div>
  );
};

const Portfolio = () => {
  const [ portfolio, setPortfolio ] = useState(null);


  useEffect(() => {
    const getBalances = async () => {
      var portfolio_loc = []
      for(var i in chains){
        var response = await axios(`${balance_endpoint}${chains[i]}`);
        response = response.data.data;
        for(let i = 0; i < response.length; i++){
          const { symbol, balance, decimals, price, chain, logo_url} = response[i];
          const usd_value = balance / 10**decimals * price;
          portfolio_loc.push({symbol: symbol, balance: balance / 10**decimals, logo: logo_url, price: price, usd_value: usd_value, chain: chain});
        }

      }
      response = await axios(defi_endpoint);
      response = response.data.data;
      for(let i = 0; i < response.length; i++){
        const { portfolio_list } = response[i];
        if(portfolio_list.length === 1){
          var details = portfolio_list[0];
          details = details.detail.supply_token_list || details.detail.token_list;
          const { symbol, amount, price, chain, logo_url} = details[0];
          portfolio_loc.push({symbol: symbol, balance: amount, logo: logo_url, price: price, usd_value: amount * price, chain: chain});
        }
      }

      portfolio_loc = portfolio_loc.sort((a, b) => (a.usd_value > b.usd_value) ? -1 : 1);
      setPortfolio(portfolio_loc);
    };

    getBalances();
  }, [setPortfolio]);

  return (
    <>
      {portfolio ? (<Networks portfolio={portfolio} />) : (<div className='spinner-border text-danger d-block mx-auto'></div>)}
      {portfolio && <Wallet portfolio={portfolio} />}
    </>
  );
};

export default Portfolio;
