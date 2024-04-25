import '@pages/popup/index.css';
import '@radix-ui/themes/styles.css';

import Popup from '@pages/popup/Popup';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import themedInit from '@root/src/shared/themedInit';

refreshOnUpdate('pages/popup');

themedInit(Popup);
