import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [tokenAddress, setTokenAddress] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tokenAddress) {
      navigate(`/token/${tokenAddress}`);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl mb-5">Enter Token Address to Check</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="text"
          placeholder="Enter Token Address..."
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          className="w-full p-2 border rounded-lg text-black"
        />
        <button
          type="submit"
          className="mt-3 w-full p-2 bg-primary text-black font-bold rounded-lg"
        >
          Check Token
        </button>
      </form>
    </div>
  );
}

export default Home;
