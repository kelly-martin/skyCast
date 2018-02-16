import React from 'react';
import ReactDOM from 'react-dom';
import CurrentWeatherCard from './../CurrentWeatherCard';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CurrentWeatherCard />, div);
  ReactDOM.unmountComponentAtNode(div);
});
