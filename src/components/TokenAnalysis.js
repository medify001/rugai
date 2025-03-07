import React from 'react';
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

  const { Icon, color } = icons[status];

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Icon className={`h-5 w-5 ${color}`} />
        <span className="text-white">{message}</span>
      </div>
      {score !== undefined && (
        <span className={`font-bold ${color}`}>{score}/100</span>
      )}
    </div>
  );
};

const TokenAnalysis = ({ analysis, onAskMore }) => {
  if (!analysis) return null;

  const riskScore = Math.floor(Math.random() * 100);

  return (
    <motion.div
      className="bg-rugai-gray-dark rounded-lg p-6 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Security Analysis Results</h3>
        <div className="text-right">
          <div className="text-3xl font-bold text-rugai-green">{riskScore}</div>
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
                <span className="text-white">$1,234,567</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">24h Volume</span>
                  <Tooltip content="Total trading volume in the last 24 hours" />
                </div>
                <span className="text-white">$345,678</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Holders</span>
                <span className="text-white">1,234</span>
              </div>
            </div>
          </div>

          <div className="bg-rugai-gray-light p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <LockClosedIcon className="h-5 w-5 text-rugai-green" />
              <h4 className="text-rugai-green font-semibold">Liquidity Status</h4>
              <Tooltip content="Information about locked liquidity, which helps prevent rug pulls" />
            </div>
            <div className="space-y-2">
              <SecurityIndicator 
                status={analysis.liquidityLock ? 'safe' : 'danger'}
                message={analysis.liquidityLock ? 'Liquidity is locked' : 'Liquidity is not locked - High Risk'}
                score={analysis.liquidityLock ? 90 : 30}
              />
              <div className="flex justify-between">
                <span className="text-gray-400">Lock Duration</span>
                <span className="text-white">365 days</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-rugai-gray-light p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <UserGroupIcon className="h-5 w-5 text-rugai-green" />
            <h4 className="text-rugai-green font-semibold">Top Holders Analysis</h4>
            <Tooltip content="Distribution of token ownership among top wallet addresses" />
          </div>
          <div className="space-y-2">
            <SecurityIndicator 
              status={analysis.devHoldings < 20 ? 'safe' : 'warning'}
              message={`Developer holds ${analysis.devHoldings}% of total supply`}
              score={100 - analysis.devHoldings}
            />
            <div className="mt-3 space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-400">Wallet {i}</span>
                  <span className="text-white">{Math.floor(Math.random() * 15)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <motion.button
          onClick={onAskMore}
          className="w-full bg-rugai-green/20 hover:bg-rugai-green/30 text-rugai-green p-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <QuestionMarkCircleIcon className="h-5 w-5" />
          <span>Ask More About This Token</span>
        </motion.button>

        <div className="bg-rugai-gray-light p-4 rounded-lg">
          <h4 className="text-rugai-green font-semibold mb-3">Recent Transactions</h4>
          <div className="space-y-3">
            {analysis.transactions.map((tx, index) => (
              <SecurityIndicator 
                key={index}
                status={tx.risk}
                message={tx.message}
              />
            ))}
          </div>
        </div>

        <div className="bg-rugai-gray-light p-4 rounded-lg">
          <h4 className="text-rugai-green font-semibold mb-3">Audit Status</h4>
          <SecurityIndicator 
            status={analysis.contractAudited ? 'safe' : 'warning'}
            message={analysis.contractAudited ? 'Contract is audited' : 'No audit found'}
            score={analysis.contractAudited ? 100 : 50}
          />
          {analysis.contractAudited && (
            <div className="mt-3">
              <a 
                href="#" 
                className="text-rugai-green hover:text-rugai-green-dark underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Audit Report
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-rugai-gray-light">
        <h4 className="text-white font-semibold mb-2">Overall Risk Assessment</h4>
        <SecurityIndicator 
          status={analysis.overallRisk}
          message={analysis.riskMessage}
          score={riskScore}
        />
      </div>
    </motion.div>
  );
};

export default TokenAnalysis;