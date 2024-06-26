import api from '../api';

const USER_ID_KEY = 'USER_ID';

export interface AppMeta {
  name: string;
  tier: string;
}

export interface UserMetaData {
  _id?: string;
  userId: string;
  apps: AppMeta[];
}

function getRandomToken() {
  // E.g. 8 * 32 = 256 bits token
  const randomPool = new Uint8Array(32);
  crypto.getRandomValues(randomPool);

  let hex = '';

  for (let i = 0; i < randomPool.length; ++i) {
    hex += randomPool[i].toString(16);
  }
  // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
  return hex;
}

export const UserService = {
  async getUserMetaData() {
    const userId = await UserService.getUserId();

    const { data } = await api.sanityProxy.get(`/users/${userId}`, { headers: { ['x-user-id']: userId } });

    return data.result;
  },
  async getUserId(): Promise<string> {
    const items = await chrome.storage.sync.get(USER_ID_KEY);

    let userId = items[USER_ID_KEY];

    if (!userId) {
      userId = getRandomToken();

      await chrome.storage.sync.set({ [USER_ID_KEY]: userId });
    }

    return userId;
  },
};
