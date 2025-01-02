import React from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import App from './components/app/App';
import store from './store/store';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <Provider store={store}>
  <App />
</Provider>);