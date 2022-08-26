/* @flow */

import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import Example from './Example';

const onReady = new Promise((resolve) => {
  if (document.readyState === 'complete') {
    resolve();
  } else {
    document.addEventListener('DOMContentLoaded', resolve, false);
    window.addEventListener('load', resolve, false);
  }
});

onReady.then(main).catch(e => {
  console.error(e, e.stack); // eslint-disable-line no-console
});

function main() {
  const mainDiv = document.getElementById('main');
  if (!mainDiv) throw new Error();
  const root = createRoot(mainDiv);
  root.render(
    <StrictMode>
      <Example />
    </StrictMode>
  );
}
