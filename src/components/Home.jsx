import { useState,useEffect,useCallback,useRef } from "react";

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "IDR", "SGD", "AUD", "CAD", "CNY", "CHF", "KRW", "MYR", "THB", "HKD", "INR"];

const API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY;

function Home() {
    const [amount, setAmount] = useState(100);
    const [fromCur, setFromCur] = useState("USD");
    const [toCur, setToCur] = useState("IDR");
    const [rates,setRates] = useState(null);
    const [lastUpdated, setLastUpdated] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");    
    const cacheRef = useRef({});
    const debounceRef = useRef(null);

    const handleFromCurChange = (e) => {
        const value = e.target.value;
        setFromCur(value);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchRates(value);
        }, 300);
    }
    const handleAmountChange = (e) => {
        const value = parseFloat(e.target.value);
        if (isNaN(value) || value < 0) return;
        if (value > 1_000_000_000_000) return;
        setAmount(value);
    }


    const fetchRates = useCallback(async (base)=> {
        if (cacheRef.current[base]) {
            setRates(cacheRef.current[base]);
            return;
        }

        if (!CURRENCIES.includes(base)) return;

        setLoading(true);
        setError("");
        try {
            const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${base}`);
            if (!res.ok) throw new Error("Failed to fetch rates");
            const data = await res.json();
            setRates(data.conversion_rates);
            setLastUpdated(new Date(data.time_last_update_utc).toLocaleDateString());
        }
        catch (err) {
            setError("Couldn't fetch live rates! Please try again.");           
        }
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(()=> {
        fetchRates(fromCur);
    }, [fromCur,fetchRates]);

    const handleSwap = ()=> {
        setFromCur(toCur);
        setToCur(fromCur);
    };

    const rate = rates ? (rates[toCur] || 0) : 0;
    const result = (amount * rate).toLocaleString("en-US", {maximumFractionDigits: 4})

    return (
        <div className="converter">
            <div className="field-label">You send</div>
            <div className="input-row">
                <input type="number"
                className="amount-input"
                value={amount}
                min={0}
                onChange={handleAmountChange}
                />
                <select 
                className="currency-select" 
                value={fromCur}
                onChange={handleAmountChange}
                >
                {CURRENCIES.map((c) => (
                    <option key={c} value ={c}>{c}</option>
                ))}
                </select>
            </div>

            <button className="swap-btn" onClick={handleSwap}>⇅ Swap Currencies</button>
            
            <div className="field-label">You receive</div>
            <select 
            className="currency-select full-width"
            value={toCur}
            onChange={(e) => setToCur(e.target.value)}
            >
                {CURRENCIES.map((c) => (
                    <option key={c} value ={c}>{c}</option>
                ))}
            </select>

            {error && <p className="error">{error}</p>}

            {loading || !rates ? (
                <div className="loading">Fetching live rates...</div>
            ) : (
                <div className="result-card">
                    <div className="result-label">{amount.toLocaleString()} {fromCur} =</div>
                    <div className="result-amount">{result}</div>
                    <div className="result-currency">{toCur}</div>
                    <div className="rate-row">
                        <span>1 {fromCur} = {rate.toFixed(6)} {toCur}</span>
                        <span>Updated {lastUpdated}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home