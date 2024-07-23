// components/AnalysisList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { url } from '../../features/api';

const AnalysisList = () => {
  const [analyses, setAnalyses] = useState([]);

  useEffect(() => {
    const fetchAnalyses = async () => {
      const res = await axios.get(`${url}/analysis/all`);
      setAnalyses(res.data);
    };

    fetchAnalyses();
  }, []);

  return (
    <div>
      <h2>Your Analyses</h2>
      <ul>
        {analyses.map((analysis) => (
          <li key={analysis._id}>
            <Link to={`/analysis/${analysis._id}`}>{analysis.ticker}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnalysisList;
