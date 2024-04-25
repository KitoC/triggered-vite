import React from 'react';
import { createRoot } from 'react-dom/client';
import { attachTwindStyle } from '@src/shared/style/twind';
import '@radix-ui/themes/styles.css';
import './global.stye.css';
import { Theme } from '@radix-ui/themes';

export default function themedInit(Component: React.FC) {
  const appContainer = document.querySelector('#app-container');

  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }

  attachTwindStyle(appContainer, document);

  const root = createRoot(appContainer);

  root.render(
    <Theme className="h-full flex flex-col" accentColor="blue">
      <Component />
    </Theme>,
  );
}
