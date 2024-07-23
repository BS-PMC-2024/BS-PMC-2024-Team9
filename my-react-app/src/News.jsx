import React from 'react';
import styled from 'styled-components';
import { FaExternalLinkAlt } from 'react-icons/fa';

const NewsContainer = styled.div`
  margin-top: 2rem;
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const NewsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const NewsItem = styled.li`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  transition: background 0.3s;

  &:hover {
    background: #f0f0f0;
  }
`;

const NewsLink = styled.a`
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;

  h3 {
    margin: 0;
    flex-grow: 1;
  }

  p {
    margin: 0.5rem 0;
  }

  small {
    color: #777;
  }
`;

const ExternalLinkIcon = styled(FaExternalLinkAlt)`
  margin-left: 0.5rem;
  color: #3498db;
  transition: color 0.3s;

  ${NewsLink}:hover & {
    color: #1d70b8;
  }
`;

const NewsSectionTitle = styled.h2`
  margin-bottom: 1rem;
  color: #333;
  border-bottom: 2px solid #ddd;
  padding-bottom: 0.5rem;
`;

const News = ({ news }) => {
    const sortedNews = news.slice().sort((a,b) => new Date(b.date) - new Date(a.date));

  return (
    <NewsContainer>
      <NewsSectionTitle>News</NewsSectionTitle>
      <NewsList>
        {sortedNews.map((article, index) => (
          <NewsItem key={index}>
            <NewsLink href={article.url} target="_blank" rel="noopener noreferrer">
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <p><small>{new Date(article.date).toLocaleString()}</small></p>
              <ExternalLinkIcon size={20} />
            </NewsLink>
          </NewsItem>
        ))}
      </NewsList>
    </NewsContainer>
  );
};

export default News;
