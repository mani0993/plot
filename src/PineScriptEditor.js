import React, { useState } from 'react';

const PineScriptEditor = () => {
    const [inputData, setInputData] = useState('');
    const [symbols, setSymbols] = useState([]);
    const [output, setOutput] = useState('');

    const handleInputChange = (e) => {
        setInputData(e.target.value);
    };

    const processInput = () => {
        const rows = inputData.trim().split('\n');
        const newSymbols = rows.map(row => {
            const [symbol, qty] = row.split('\t');
            return { symbol: symbol.trim(), qty: parseInt(qty.trim(), 10) };
        });
        setSymbols(newSymbols);
    };

    const generatePineScript = () => {
        let script = `//@version=5\nindicator("Momentum Stocks", overlay=true)\n// Define individual symbols and quantities\n`;
        symbols.forEach((item, index) => {
            script += `symbol${index + 1} = "${item.symbol}"\nqty${index + 1} = ${item.qty}\n`;
        });
        script += `// Initialize combined value\ncombinedValue = 0.0\n// Calculate the combined value\n`;
        symbols.forEach((_, index) => {
            script += `combinedValue := combinedValue + (request.security(symbol${index + 1}, "D", close) * qty${index + 1})\n`;
        });
        script += `// Plot the combined value as a line\nplot(combinedValue, color=color.blue, title="Combined Value")\n`;
        setOutput(script);
    };

    return (
        <div>
            <h1>PineScript Symbol Editor</h1>
            <textarea
                value={inputData}
                onChange={handleInputChange}
                placeholder="Paste your data from Excel or Google Sheets here. Ensure it's in two columns: Symbol and Quantity, separated by a tab."
                rows="10"
                cols="50"
                style={{ marginBottom: '10px', padding: '10px', fontSize: '16px' }}
            />
            <div>
                <button onClick={processInput} style={{ marginRight: '10px', padding: '10px 20px', fontSize: '16px' }}>
                    Process Input
                </button>
                <button onClick={generatePineScript} style={{ padding: '10px 20px', fontSize: '16px' }}>
                    Generate Pine Script
                </button>
            </div>
            <h2>Generated Pine Script:</h2>
            <textarea
                value={output}
                readOnly
                rows="10"
                cols="50"
                style={{ padding: '10px', fontSize: '16px' }}
            />
        </div>
    );
};

export default PineScriptEditor;
