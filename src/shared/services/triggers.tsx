/*global chrome*/

export interface Trigger {
  id?: string;
  trggr: string;
  dtrggr: string;
  blur_images: boolean;
  prev_dtrggr?: string;
}
const MODEL_KEY = 'trggrs';

export type TriggerDb = { [name: string]: Trigger };

export const TriggerService = {
  get: async () => {
    if (chrome.storage) {
      const { trggrs = {} } = await chrome.storage.sync.get([MODEL_KEY]);

      return trggrs;
    } else {
      const lsData = localStorage.getItem(MODEL_KEY);

      return lsData ? JSON.parse(lsData) : {};
    }
  },
  set: async (triggers: TriggerDb) => {
    if (chrome.storage) {
      return chrome.storage.sync.set({ [MODEL_KEY]: triggers });
    } else {
      return localStorage.setItem(MODEL_KEY, JSON.stringify(triggers));
    }
  },
};
