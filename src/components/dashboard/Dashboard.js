import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
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
  const [ thorPrice, setThorPrice] = useState(null);
  const [ supply, setSupply] = useState(null);

  useEffect(() => {
    const getValues = () => {
      axios.get(`https://api.debank.com/user/addr?addr=${invesment_address}`).then(
        resp => setInvesmentWallet(resp.data.data.usd_value)
      );
      axios.get(`https://api.debank.com/user/addr?addr=${treasury_address}`).then(
        resp => setTreasuryWallet(resp.data.data.usd_value)
      );
      axios.get(price_endpoint).then(
        resp => setThorPrice(resp.data.thor.usd)
      );

      axios.get(abi_endpoint).then(
        function(resp){
          const abi = JSON.parse(resp.data.result);
          var contract = new web3.eth.Contract(abi, treasury_address);
          contract.methods.getTotalCreatedNodes().call().then(
            resp => setNumberOfNodes(Number(resp))
          );
          contract.methods.totalSupply().call().then(
            resp => setSupply(Number(resp) / 10**18)
          );
        }
      );
    };

    getValues();
  })


  return (
    <SkeletonTheme baseColor='#061828' highlightColor='#04121D'>
      <div className="dashboard row">
        <Col md={4}>
          <div className="dashboard_item">
            Treasury Wallet Balance
            {treasuryWallet ? (
              <span>${treasuryWallet.toLocaleString()}</span>
            ) : (
              <Skeleton variant="text"/>
            )}
          </div>
        </Col>
        <Col md={4}>
          <div className="dashboard_item">
            Invesment Wallet Balance
            {invesmentWallet ? (
              <span>${invesmentWallet.toLocaleString()}</span>
            ) : (
              <Skeleton variant="text"/>
            )}
          </div>
        </Col>
        <Col md={4}>
          <div className="dashboard_item">
            Thor Price
            {thorPrice ? (
              <span>${thorPrice.toLocaleString()}</span>
            ) : (
              <Skeleton variant="text"/>
            )}
          </div>
        </Col>
        <Col md={4}>
          <div className="dashboard_item">
            Fully Diluted Marketcap
            {supply && thorPrice ? (
              <span>${(supply * thorPrice).toLocaleString()}</span>
            ) : (
              <Skeleton variant="text"/>
            )}
          </div>
        </Col>
        <Col md={4}>
          <div className="dashboard_item">
            Thor Nodes
            {numberOfNodes ? (
              <span>${numberOfNodes.toLocaleString()}</span>
            ) : (
              <Skeleton variant="text"/>
            )}
          </div>
        </Col>
      </div>
    </SkeletonTheme>
  );
};

export default Dashboard;
