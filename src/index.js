import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';
import App from '../src/components/app/App';
import Modal from 'react-modal';

const container = document.getElementById('root');
const root = createRoot(container);

// Set the app element to '#root'
Modal.setAppElement('#root');

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
