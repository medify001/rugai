import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchTokenData, refreshTokenData } from "../api/solSniffer";

function TokenDetails() {
  const { address } = useParams();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTokenData() {
      setLoading(true);
      const data = await fetchTokenData(address);
      setToken(data);
      setLoading(false);
    }
    getTokenData();
  }, [address]);

  const handleRefresh = async () => {
    setLoading(true);
    const updatedData = await refreshTokenData(address);
    setToken(updatedData);
    setLoading(false);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="mt-5">
      <h2 className="text-2xl text-center">{token?.tokenData?.tokenName} ({token?.tokenData?.tokenSymbol})</h2>
      <img src={token?.tokenData?.tokenImg} alt="Token Logo" className="mx-auto my-3 w-20" />
      <p className="text-center">Score: {token?.tokenData?.score}</p>
      <p className="text-center">Market Cap: ${token?.tokenData?.marketCap.toLocaleString()}</p>
      <button onClick={handleRefresh} className="mt-3 w-full p-2 bg-primary text-black font-bold rounded-lg">
        Refresh Data
      </button>
    </div>
  );
}

export default TokenDetails;
