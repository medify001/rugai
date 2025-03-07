import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  LockClosedIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/solid';

const API_URL = "https://solsniffer.com/api/v2/";
const API_KEY = "l15c0fdektmp9hxp2ayx45sbwe3g7k";



const Tooltip = ({ content }) => (
  <div className="group relative inline-block">
    <QuestionMarkCircleIcon className="h-4 w-4 text-rugai-green/50 hover:text-rugai-green cursor-help" />
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-48 text-center">
      {content}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black"></div>
    </div>
  </div>
);

const SecurityIndicator = ({ status, message, score }) => {
  const icons = {
    safe: { Icon: CheckCircleIcon, color: 'text-rugai-green' },
    warning: { Icon: ExclamationTriangleIcon, color: 'text-yellow-500' },
    danger: { Icon: XCircleIcon, color: 'text-red-500' },
  };

  const { Icon, color } = icons[status] || {};

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {Icon && <Icon className={`h-5 w-5 ${color}`} />}
        <span className="text-white">{message}</span>
      </div>
      {score !== undefined && (
        <span className={`font-bold ${color}`}>{score}/100</span>
      )}
    </div>
  );
};

const TokenAnalysis = ({ tokenAddress, onAskMore }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await axios.get(`https://api.solsniffer.com/v2/token/${tokenAddress}`, {
          headers: {
            'X_API': `l15c0fdektmp9hxp2ayx45sbwe3g7k`, // Replace with your actual API key
          },
        });
        setAnalysis(response.data);
      } catch (err) {
        setError('Failed to fetch token analysis.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [tokenAddress]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!analysis) return null;

  const {
    snifscore,
    market_cap,
    volume_24h,
    holders_count,
    liquidity_locked,
    lock_duration_days,
    dev_holdings_percentage,
    top_holders,
    transactions,
    contract_audited,
    overall_risk,
    risk_message,
  } = analysis;

  return (
    <motion.div
      className="bg-rugai-gray-dark rounded-lg p-6 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Security Analysis Results</h3>
        <div className="text-right">
          <div className="text-3xl font-bold text-rugai-green">{snifscore}</div>
          <div className="text-sm text-gray-400">Risk Score</div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-rugai-gray-light p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <ChartBarIcon className="h-5 w-5 text-rugai-green" />
              <h4 className="text-rugai-green font-semibold">Market Metrics</h4>
              <Tooltip content="Key financial indicators including market capitalization, trading volume, and holder count" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Market Cap</span>
                  <Tooltip content="Total value of all tokens in circulation" />
                </div>
                <span className="text-white">${market_cap.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">24h Volume</span>
                  <Tooltip content="Total trading volume in the last 24 hours" />
                </div>
                <span className="text-white">${volume_24h.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Holders</span>
                <span className="text-white">{holders_count.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-rugai-gray-light p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <LockClosedIcon className="h-5 w-5 text-rugai-green" />
              <h4 className="text-rugai-green font-semibold">Liquidity Status</h4>
              <Tooltip content="Information about locked liquidity, which helps prevent rug pulls" />
            </div>
           </motion.dev>
