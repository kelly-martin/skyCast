import React from 'react';
import ReactDOM from 'react-dom';
import App from './../FutureForecastCard';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FutureForecastCard />, div);
  ReactDOM.unmountComponentAtNode(div);
});
