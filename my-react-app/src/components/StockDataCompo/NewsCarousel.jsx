import React, { useState } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

const NewsCarousel = ({ news }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <NewsContainer>
      <h2>News</h2>
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
      >
        {news.map((article, index) => (
          <SwiperSlide key={index}>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <p><small>{new Date(article.date).toLocaleString()}</small></p>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
      <Pagination>
        {currentIndex + 1} / {news.length}
      </Pagination>
    </NewsContainer>
  );
};

export default NewsCarousel;

const NewsContainer = styled.div`
  margin-top: 2rem;
  width: 300px;
  height: 400px;
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  h2 {
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  }
`;

const Pagination = styled.div`
  margin-top: 1rem;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  color: #555;
`;
