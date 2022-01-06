import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './App.css';
import Coin from './Coin';
import styled, { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, GlobalStyles } from './themes.js';
import { Helmet } from 'react-helmet';

const StyledApp = styled.div`
  color: ${(props) => props.theme.fontColor};
`;

function App() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('')

  const [theme, setTheme] = useState("light");
  const themeToggler = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light');
  };

  useEffect(() => {
    axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=php&order=market_cap_desc&per_page=100&page=1&sparkline=false')
      .then(res => {
        setCoins(res.data);
      }).catch(error => console.log(error))
  }, []);

  const handleChange = e => {
    setSearch(e.target.value)
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <GlobalStyles />
      <StyledApp>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Crypto PH</title>
          <meta name="description" content="Crypto API" />
        </Helmet>
        <div className='coin-app'>
          <label className="switch">
            <input type="checkbox" onClick={() => themeToggler()} />
            <span className="slider round"></span>
          </label>
          <div className='coin-search'>
            <h1 className='coin-text'>Search a currency</h1>
            <form>
              <input type='text' placeholder='Search' className='coin-input' onChange={handleChange} />
            </form>
          </div>
          <div className='coin-container'>
            <div className="coin-row">
              <div className="coin">
                <p>Name</p>
                <p className="coin-symbol"></p>
              </div>
              <div className="coin-data">
                <p className="coin-price">Price</p>
                <p className="coin-volume">Volume</p>
                <p className="coin-percent">24h</p>
                <p className="coin-marketcap">Market Cap</p>
              </div>
            </div>
          </div>
          {filteredCoins.map(coin => {
            return (
              <Coin
                key={coin.id}
                name={coin.name}
                image={coin.image}
                symbol={coin.symbol}
                marketcap={coin.market_cap}
                price={coin.current_price}
                priceChange={coin.price_change_percentage_24h}
                volume={coin.total_volume}
              />
            );
          })}
        </div>
      </StyledApp>
    </ThemeProvider>
  );
}

export default App;
