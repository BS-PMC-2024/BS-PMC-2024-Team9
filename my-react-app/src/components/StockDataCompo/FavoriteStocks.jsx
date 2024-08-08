import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrash } from 'react-icons/fa'; // ייבוא האייקון

const FavoriteStocks = ({ favorites, handleRemoveFavorite }) => {
  return (
    <FavoritesContainer>
      <h3>Your Favorite Stocks</h3>
      <FavoriteList>
        {favorites.map((favorite, index) => (
          <FavoriteItem key={index}>
            <Link to={`/stock-detail/${favorite}`}>
              {favorite}
            </Link>
            <DeleteButton onClick={() => handleRemoveFavorite(favorite)}>
              <FaTrash /> {/* שימוש באייקון */}
            </DeleteButton>
          </FavoriteItem>
        ))}
      </FavoriteList>
    </FavoritesContainer>
  );
};

export default FavoriteStocks;

const FavoritesContainer = styled.div`
  margin-top: 2rem;
`;

const FavoriteList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FavoriteItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  border: 1px solid #eee;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 5px;
  transition: background 0.3s;

  &:hover {
    background: #eaeaea;
  }
`;

const DeleteButton = styled.button`
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;

  &:hover {
    background: #c0392b;
  }

  svg {
    margin-left: 0.5rem; // מרווח קטן מהטקסט אם יש צורך
}
`;