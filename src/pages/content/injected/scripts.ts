import handleSelectionAndReplaceTriggers from './utils/handleSelectionAndReplaceTriggers';
import getAndReplaceTriggers from './utils/getAndReplaceTriggers';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/content/injected/toggleTheme');

async function startPolling() {
  const storageOnChanged = () => {
    getAndReplaceTriggers();
  };

  chrome.storage.sync.onChanged.addListener(storageOnChanged);

  handleSelectionAndReplaceTriggers();

  const interval = setInterval(() => {
    if (!chrome.runtime?.id) {
      clearInterval(interval);
      return;
    }

    handleSelectionAndReplaceTriggers();
  }, 5000);
}

void startPolling();
