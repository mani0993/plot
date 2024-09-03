import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
    let script = `//@version=5
indicator("Momentum Stocks", overlay=true)
// Define individual symbols and quantities
`;

    symbols.forEach((item, index) => {
      script += `symbol${index + 1} = "${item.symbol}"
qty${index + 1} = ${item.qty}
`;
    });

    script += `
// Initialize combined value
combinedValue = 0.0
// Calculate the combined value
`;

    symbols.forEach((_, index) => {
      script += `combinedValue := combinedValue + (request.security(symbol${index + 1}, "D", close) * qty${index + 1})
`;
    });

    script += `
// Plot the combined value as a line
plot(combinedValue, color=color.blue, title="Combined Value")
`;

    setOutput(script);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">PineScript Symbol Editor</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Paste Symbols and Quantities</h2>
        <p className="text-sm text-gray-600 mb-2">
          Paste your data from Excel or Google Sheets here. 
          Ensure it's in two columns: Symbol and Quantity, separated by a tab.
        </p>
        <Textarea
          value={inputData}
          onChange={handleInputChange}
          placeholder="NSE:IIFLSEC  106&#10;NSE:RECLTD   36&#10;NSE:NBCC     126"
          rows={10}
          className="font-mono"
        />
      </div>
      <Button onClick={processInput} className="mr-2">
        Process Input
      </Button>
      <Button onClick={generatePineScript} disabled={symbols.length === 0}>
        Generate PineScript
      </Button>
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Generated PineScript</h2>
        <Textarea
          value={output}
          readOnly
          rows={10}
          placeholder="Generated PineScript will appear here"
          className="font-mono"
        />
      </div>
    </div>
  );
};

export default PineScriptEditor;
