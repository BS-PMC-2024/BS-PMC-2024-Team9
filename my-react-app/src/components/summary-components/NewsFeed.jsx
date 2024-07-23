import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../features/api';

const NewsFeed = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${url}/news`);
        setNews(response.data.articles);
      } catch (error) {
        console.error("Error fetching news: ", error); // Debug: Log the error
        setError('Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="news-feed">
      {news.map((article, index) => (
        <div key={index} className="news-article">
          <h3>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.title}
            </a>
          </h3>
          <p>{article.description}</p>
        </div>
      ))}
    </div>
  );
};

export default NewsFeed;
