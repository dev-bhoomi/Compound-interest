import React, { useEffect, useState, useRef } from "react";
import { Chart } from 'chart.js/auto';

export default function Calculator() {
  const [initialAmount, setInitialAmount] = useState('');
  const [investmentYears, setInvestmentYears] = useState('');
  const [estimatedRates, setEstimatedRates] = useState('');
  const [compoundInterval, setCompoundInterval] = useState('1'); // Default to 'Annually'

  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [message, setMessage] = useState('');

  const canvasRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    drawGraph();
  }, [data, labels]);

  const calculateGrowth = (e) => {
    e.preventDefault();
    setData([]);
    setLabels([]);
    setMessage('');
    
    try {
      const initial = parseFloat(initialAmount);
      const period = parseInt(investmentYears);
      const interest = parseFloat(estimatedRates);
      const comp = parseInt(compoundInterval);

      const newData = [];
      const newLabels = [];
      let growth = 0;

      for (let i = 1; i <= period; i++) {
        const final = initial * Math.pow(1 + (interest / 100) / comp, comp * i);
        newData.push(toDecimal(final, 2));
        newLabels.push("Year " + i);
        growth = toDecimal(final, 2);
      }

      setMessage(`You will have this amount ${growth} after ${period} years`);
      setData(newData);
      setLabels(newLabels);
    } catch (error) {
      console.error(error);
    }
  }

  function drawGraph() {
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvas.getContext("2d");

      if (context) {
        if (lineRef.current) {
          lineRef.current.destroy();
        }

        lineRef.current = new Chart(context, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Compound",
                data: data,
                fill: true,
                backgroundColor: "rgba(12, 141, 0, 0.7)",
                borderWidth: 3,
              },
            ],
          },
        });
      }
    }
  }

  function toDecimal(value, decimals) {
    return +value.toFixed(decimals);
  }

  return (
    <>
      <section className="container">
        <div className="calculator">
          <div className="heading">
            <h3>Compound Interest Calculator</h3>
            <small>Your money growth over time using compound interest...</small>
          </div>
          <form className="compound-form">
            <div className="input-group">
              <label htmlFor="initialamount">Initial Amount</label>
              <input
                type="number"
                id="initialamount"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="investmentYears">Investment Years</label>
              <input
                type="number"
                id="investmentYears"
                value={investmentYears}
                onChange={(e) => setInvestmentYears(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="estimatedRates">Estimated Rates(%)</label>
              <input
                type="number"
                id="estimatedRates"
                value={estimatedRates}
                onChange={(e) => setEstimatedRates(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="compound">Compound Interval</label>
              <select
                id="compound"
                value={compoundInterval}
                onChange={(e) => setCompoundInterval(e.target.value)}
              >
                <option value="1">Annually</option>
                <option value="4">Quarterly</option>
                <option value="2">Semi-annually</option>
                <option value="12">Monthly</option>
              </select>
            </div>
            <div className="input-group">
              <button onClick={calculateGrowth}>Calculate</button>
            </div>
          </form>
        </div>
        <div className="results">
          <h3 id="message">{message}</h3>
          <canvas ref={canvasRef} id="data-set"></canvas>
        </div>
      </section>
    </>
  );
}