import React from 'react';
import ReactDOM from 'react-dom';
import App from './../HistoricalWeatherCard';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HistoricalWeatherCard />, div);
  ReactDOM.unmountComponentAtNode(div);
});
