import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import TokenAnalysis from './components/TokenAnalysis';
import TrendingCoins from './components/TrendingCoins';
import ScanAnimation from './components/ScanAnimation';
import ChatInterface from './components/ChatInterface';

function App() {
  const [tokenAddress, setTokenAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);

  useEffect(() => {
    fetchTrendingCoins();
    // Set up periodic refresh
    const interval = setInterval(fetchTrendingCoins, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchTrendingCoins = async () => {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            category: 'meme-token',
            order: 'market_cap_desc',
            per_page: 10,
            sparkline: false,
            price_change_percentage: '24h'
          }
        }
      );
      
      // Update coins while preserving animations
      setTrendingCoins(prevCoins => {
        return response.data.map(newCoin => {
          const prevCoin = prevCoins.find(p => p.id === newCoin.id);
          return {
            ...newCoin,
            animate: prevCoin ? false : true
          };
        });
      });
    } catch (err) {
      console.error('Failed to fetch trending coins:', err);
    }
  };

  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
    analyzeToken(coin.id);
  };

  const analyzeToken = async (tokenId) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock analysis for demonstration
      const mockAnalysis = {
        liquidityLock: Math.random() > 0.5,
        devHoldings: Math.floor(Math.random() * 40),
        contractAudited: Math.random() > 0.7,
        transactions: [
          {
            risk: 'safe',
            message: 'Normal trading activity detected'
          },
          {
            risk: Math.random() > 0.7 ? 'warning' : 'safe',
            message: 'Recent large transfers detected'
          }
        ],
        overallRisk: Math.random() > 0.7 ? 'safe' : 'warning',
        riskMessage: Math.random() > 0.7 ? 
          'Token appears to have normal activity and security measures in place' :
          'Some risk factors detected - proceed with caution'
      };

      setAnalysis(mockAnalysis);
    } catch (err) {
      setError('Failed to analyze token. Please check the address and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAskMore = () => {
    if (selectedCoin) {
      const question = `Tell me more about ${selectedCoin.name} (${selectedCoin.symbol.toUpperCase()}) including its recent performance, market trends, and potential risks.`;
      return question;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-rugai-black">
      <motion.nav 
        className="bg-rugai-gray-dark shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.img 
                src="/logo.svg" 
                alt="RUGAI" 
                className="h-8 w-auto"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
              <motion.h1 
                className="ml-3 text-xl font-bold text-rugai-green"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                RUGAI
              </motion.h1>
            </div>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <motion.div 
            className="bg-rugai-gray-dark shadow rounded-lg p-6 relative overflow-hidden text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.h2 
              className="text-3xl font-bold text-white mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              RUGAI: Your ultimate rug defender! 
            </motion.h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              RUGAI helps detect potential rug pulls in the Solana ecosystem, specifically focusing on memecoins which are known for high volatility and scam risks.
            </p>
            <div className="mt-6 relative max-w-xl mx-auto">
              <input
                type="text"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                placeholder="Enter token address"
                className="w-full px-4 py-2 bg-rugai-gray-light text-white border-rugai-green border rounded-md focus:ring-rugai-green focus:border-rugai-green placeholder-gray-500"
              />
              <motion.button
                onClick={() => analyzeToken(tokenAddress)}
                disabled={loading || !tokenAddress}
                className={`mt-4 w-full px-4 py-2 rounded-md text-rugai-black font-semibold
                  ${loading || !tokenAddress 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-rugai-green hover:bg-rugai-green-dark'} 
                  focus:outline-none focus:ring-2 focus:ring-rugai-green focus:ring-offset-2 focus:ring-offset-rugai-black`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Scanning...' : 'Scan Token'}
              </motion.button>
              
              {loading && <ScanAnimation />}
              
              {error && (
                <motion.div 
                  className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-red-500">{error}</p>
                </motion.div>
              )}
            </div>

            {analysis && <TokenAnalysis analysis={analysis} onAskMore={handleAskMore} />}
          </motion.div>

          <TrendingCoins coins={trendingCoins} onCoinSelect={handleCoinSelect} />
          <ChatInterface 
            onSendMessage={handleAskMore} 
            selectedToken={selectedCoin} 
          />
        </div>
      </main>
    </div>
  );
}

export default App;