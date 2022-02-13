import { useState, useEffect } from "react";
import { Col } from "react-bootstrap";
import axios from "axios";
import Web3 from "web3";

import "./dashboard.scss";

const NODE_URL = "https://api.avax.network/ext/bc/C/rpc";
const provider = new Web3.providers.HttpProvider(NODE_URL);
const web3 = new Web3(provider);

const invesment_address = "0x8942904901b65A544549ed57b66a43187522Afe3";
const treasury_address = "0x8F47416CaE600bccF9530E9F3aeaA06bdD1Caa79";
const price_endpoint = "https://api.coingecko.com/api/v3/simple/price?ids=THOR&vs_currencies=USD";
const abi_endpoint = `https://api.snowtrace.io/api?module=contract&action=getabi&address=${treasury_address}`

const Dashboard = () => {
  const [ invesmentWallet, setInvesmentWallet] = useState(null);
  const [ treasuryWallet, setTreasuryWallet] = useState(null);
  const [ numberOfNodes, setNumberOfNodes] = useState(null);
  const [ thorHolders, setThorHolders] = useState(null);
  const [ thorPrice, setThorPrice] = useState(null);
  const [ supply, setSupply] = useState(null);

  useEffect(() => {
    const getValues = async () => {
      axios.get(`https://api.debank.com/user/addr?addr=${invesment_address}`).then(
        function(resp){
          setInvesmentWallet(resp.data.data.usd_value);
        }
      );
      axios.get(`https://api.debank.com/user/addr?addr=${treasury_address}`).then(
        function(resp){
          setTreasuryWallet(resp.data.data.usd_value);
        }
      );
      axios.get(price_endpoint).then(
        function(resp){
          setThorPrice(resp.data.thor.usd);
        }
      );

      axios.get(abi_endpoint).then(
        function(resp){
          const abi = JSON.parse(resp.data.result);
          var contract = new web3.eth.Contract(abi, treasury_address);
          contract.methods.getTotalCreatedNodes().call().then(
            function(resp){
              setNumberOfNodes(Number(resp));
            }
          );
          contract.methods.totalSupply().call().then(
            function(resp){
              setSupply(Number(resp) / 10**18);
            }
          );
        }
      );
      /*
      axios.get(`https://snowtrace.io/token/${invesment_address}`).then(
        function(resp){
          var code = resp.data.split("ContentPlaceHolder1_tr_tokenHolders")[1];
          code = code.split("addresses")[0];
          code = code.split('<div class="mr-3">')[1].trim();
          setThorHolders(Number(code.replace(",", "")));
        }
      );
      */
      setThorHolders(16897);
    };

    getValues();
  })


  return (
    <div className="dashboard row">
      <Col md={4}>
        <div className="dashboard_item">
          Treasury Wallet Balance
          <span>${treasuryWallet?.toLocaleString()}</span>
        </div>
      </Col>
      <Col md={4}>
        <div className="dashboard_item">
          Invesment Wallet Balance
          <span>${invesmentWallet?.toLocaleString()}</span>
        </div>
      </Col>
      <Col md={4}>
        <div className="dashboard_item">
          Thor Price
          <span>${thorPrice?.toLocaleString()}</span>
        </div>
      </Col>
      <Col md={4}>
        <div className="dashboard_item">
          Fully Diluted Marketcap
          <span>${(supply * thorPrice).toLocaleString()}</span>
        </div>
      </Col>
      <Col md={4}>
        <div className="dashboard_item">
          Thor Nodes
          <span>{numberOfNodes?.toLocaleString()}</span>
        </div>
      </Col>
      <Col md={4}>
        <div className="dashboard_item">
          Thor Holders
          <span>{thorHolders?.toLocaleString()}</span>
        </div>
      </Col>
    </div>
  );
};

export default Dashboard;
