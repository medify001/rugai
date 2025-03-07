import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { generateCryptoAdvice } from '../services/openai';
import { 
  HandThumbUpIcon, 
  HandThumbDownIcon, 
  InformationCircleIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const QuickQuestion = ({ question, onClick }) => (
  <motion.button
    onClick={() => onClick(question)}
    className="px-3 py-1.5 bg-rugai-gray-light text-white text-sm rounded-full hover:bg-rugai-green hover:text-black transition-colors duration-200"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {question}
  </motion.button>
);

const ChatInterface = ({ onSendMessage, selectedToken }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [ratings, setRatings] = useState({});
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const quickQuestions = [
    "What makes a token safe?",
    "How to spot a rug pull?",
    "Latest market trends",
    "Top safe tokens"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedToken) {
      handleTokenSelection(selectedToken);
    }
  }, [selectedToken]);

  const handleTokenSelection = async (token) => {
    const prompt = `Please analyze this token: ${token}. Include information about market cap, liquidity, and potential risks.`;
    await handleSubmit(null, prompt);
  };

  const handleSubmit = async (e, customPrompt = null) => {
    if (e) e.preventDefault();
    const promptText = customPrompt || input;
    if (!promptText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: promptText
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await generateCryptoAdvice(promptText);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I apologize, but I'm unable to provide advice at the moment. Please try again later."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleRating = (messageId, isPositive) => {
    setRatings(prev => ({
      ...prev,
      [messageId]: isPositive
    }));
  };

  return (
    <div className="bg-rugai-gray-dark rounded-lg p-4 mt-4">
      <div className="mb-3 p-3 bg-yellow-900/20 border border-yellow-500/50 rounded-lg">
        <div className="flex items-start space-x-2">
          <InformationCircleIcon className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />
          <p className="text-yellow-200 text-sm">
            <span className="font-semibold">Disclaimer:</span> All cryptocurrency advice and analysis provided are for informational purposes only. Users are solely responsible for their investment decisions and any consequences thereof.
          </p>
        </div>
      </div>

      <div 
        ref={chatContainerRef}
        className="h-[calc(100vh-400px)] min-h-[300px] overflow-y-auto mb-3 space-y-3 scrollbar-thin scrollbar-thumb-rugai-green scrollbar-track-rugai-gray-light"
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`relative max-w-[80%] ${
                  message.type === 'user' 
                    ? 'bg-rugai-green text-black ml-4' 
                    : 'bg-rugai-gray-light text-white mr-4'
                } rounded-2xl p-4 shadow-lg`}
              >
                {message.type === 'bot' && (
                  <div className="absolute -left-3 top-4 w-3 h-3 bg-rugai-gray-light transform rotate-45" />
                )}
                {message.type === 'user' && (
                  <div className="absolute -right-3 top-4 w-3 h-3 bg-rugai-green transform rotate-45" />
                )}
                
                {message.type === 'bot' ? (
                  <>
                    <TypeAnimation
                      sequence={[message.content]}
                      wrapper="div"
                      speed={50}
                      cursor={false}
                    />
                    <div className="mt-2 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleRating(message.id, true)}
                        className={`p-1.5 rounded-full transition-colors duration-200 ${
                          ratings[message.id] === true 
                            ? 'bg-green-500 text-white' 
                            : 'hover:bg-rugai-gray-dark text-gray-400 hover:text-white'
                        }`}
                      >
                        <HandThumbUpIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRating(message.id, false)}
                        className={`p-1.5 rounded-full transition-colors duration-200 ${
                          ratings[message.id] === false 
                            ? 'bg-red-500 text-white' 
                            : 'hover:bg-rugai-gray-dark text-gray-400 hover:text-white'
                        }`}
                      >
                        <HandThumbDownIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  message.content
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-1 text-rugai-green ml-4"
          >
            <div className="animate-bounce">●</div>
            <div className="animate-bounce delay-100">●</div>
            <div className="animate-bounce delay-200">●</div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((question, index) => (
            <QuickQuestion
              key={index}
              question={question}
              onClick={(q) => handleSubmit(null, q)}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about token safety, market trends, or get crypto advice..."
              className="w-full pl-10 pr-4 py-2 bg-rugai-gray-light text-white border-rugai-green border rounded-lg focus:ring-rugai-green focus:border-rugai-green placeholder-gray-500"
            />
            <ChatBubbleLeftRightIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-2 bg-rugai-green text-black rounded-lg font-semibold flex items-center space-x-2
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-rugai-green-dark'} 
              focus:outline-none focus:ring-2 focus:ring-rugai-green focus:ring-offset-2 focus:ring-offset-rugai-black`}
          >
            {isLoading ? (
              <>
                <span>Thinking</span>
                <span className="flex space-x-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </span>
              </>
            ) : (
              'Send'
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;