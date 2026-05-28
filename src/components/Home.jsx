import { useState,useEffect,useCallback } from "react"

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "IDR", "SGD", "AUD", "CAD", "CNY", "CHF", "KRW"]

function Home() {
    const [amount, setAmount] = useState(100);
    const [fromCur, setFromCur] = useState("USD");
    const [toCur, setToCur] = useState("IDR");
    const [rates,setRates] = useState({});
    const [lastUpdated, setLastUpdated] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchRates = useCallback(async (base)=> {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`https://open.exchangerate-api.com/v6/latest/${base}`);
            if (!res.ok) throw new Error("Failed to fetch rates");
            const data = await res.json();
            setRates(data.rates);
            setLastUpdated(new Date(data.time_last_update_utc).toLocaleDateString());
        }
        catch (err) {
            setError("Couldn't fetch live rates! PLease try again.");           
        }
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(()=> {
        fetchRates(fromCur);
    }, [fromCur,setRates]);

    const handleSwap = ()=> {
        setFromCur(toCur);
        setToCur(fromCur);
    };

    const rate = rates[toCur] || 0;
    const result = (amount * rate).toLocaleString("en-US", {maximumFractionDigits: 4})

    return (
        <div className="converter">
            <div className="field-label">You send</div>
            <div className="input-row">
                <input type="number"
                className="amount-input"
                value={amount}
                min={0}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                />
                <select 
                className="currency-select" 
                value={fromCur}
                onChange={(e) => setFromCur(e.target.value)}
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

            {loading ? (
                <div className="loading">Fetching live rates...</div>
            ) : (
                <div className="result-card">
                    <div className="result-label">{amount.toLocaleString()} {fromCur} =</div>
                    <div className="result-amount">{result}</div>
                    <div className="result-currency">{toCur}</div>
                    <div className="rate-row">
                        <span>1 {fromCur} = {rate.toFxed(6)} {toCur}</span>
                        <span>Updated {lastUpdated}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home