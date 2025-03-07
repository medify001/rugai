import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon,
  ViewColumnsIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

const TrendingCoins = ({ coins, onCoinSelect }) => {
  const [view, setView] = useState('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatPrice = (price) => {
    if (price < 0.01) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    return price.toFixed(2);
  };

  const CoinCard = ({ coin, layout }) => {
    const isGrid = layout === 'grid';
    
    return (
      <motion.div
        layout
        key={coin.id}
        className={`bg-rugai-gray-light ${
          isGrid ? 'p-4' : 'p-3'
        } rounded-lg cursor-pointer hover:bg-rugai-gray-light/80 transition-colors duration-200`}
        onClick={() => onCoinSelect(coin)}
        whileHover={{ scale: isGrid ? 1.02 : 1.01 }}
        whileTap={{ scale: isGrid ? 0.98 : 0.99 }}
        initial={coin.animate ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={`flex items-center ${isGrid ? 'space-x-3' : 'justify-between'}`}>
          <div className="flex items-center space-x-3">
            <img 
              src={coin.image} 
              alt={coin.name} 
              className={`${isGrid ? 'w-8 h-8' : 'w-6 h-6'} rounded-full`} 
            />
            <div>
              <h4 className="text-white font-semibold">{coin.name}</h4>
              <p className={`text-gray-400 ${isGrid ? 'text-sm' : 'text-xs'}`}>
                {coin.symbol.toUpperCase()}
              </p>
            </div>
          </div>
          <div className={isGrid ? 'mt-2' : 'text-right'}>
            <p className="text-rugai-green">
              ${formatPrice(coin.current_price)}
            </p>
            <div className="flex items-center space-x-1">
              {coin.price_change_24h >= 0 ? (
                <ArrowTrendingUpIcon className={`${isGrid ? 'h-4 w-4' : 'h-3 w-3'} text-green-500`} />
              ) : (
                <ArrowTrendingDownIcon className={`${isGrid ? 'h-4 w-4' : 'h-3 w-3'} text-red-500`} />
              )}
              <p className={`${isGrid ? 'text-sm' : 'text-xs'} ${
                coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {coin.price_change_percentage_24h.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="mt-6 bg-rugai-gray-dark rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-rugai-green">Trending Coins</h3>
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-rugai-gray-light transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {view === 'grid' ? (
              <ListBulletIcon className="h-5 w-5" />
            ) : (
              <ViewColumnsIcon className="h-5 w-5" />
            )}
          </motion.button>
          <motion.button
            onClick={() => setIsRefreshing(true)}
            className={`p-2 text-gray-400 hover:text-white rounded-lg hover:bg-rugai-gray-light transition-colors duration-200 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={isRefreshing}
          >
            <ArrowPathIcon className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      <motion.div layout>
        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coins.map(coin => (
              <CoinCard key={coin.id} coin={coin} layout="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {coins.map(coin => (
              <CoinCard key={coin.id} coin={coin} layout="list" />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TrendingCoins;