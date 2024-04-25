import client from '../sanity/client';
import { UserService } from './userService';

const TYPE = 'trigger';

export interface Trigger {
  _id?: string;
  userId: string;
  trigger: string;
  detrigger: string;
  blur_images: boolean;
  previousDetriggers?: string[];
}

export type TriggerDb = { [name: string]: Trigger };

const TRIGGERS_QUERY = `*[_type == "trigger" && userId == $userId]`;

export const TriggerService = {
  async get() {
    const userId = await UserService.getUserId();
    const params = { userId };

    const data = await client.fetch<Trigger[], { userId: string }>(TRIGGERS_QUERY, params);

    return data;
  },

  async patch(trigger: Trigger) {
    const data = await client
      .patch(trigger._id) // Document ID to patch
      .set(trigger) // Shallow merge
      .commit<Trigger>(); // Perform the patch and return a promise

    return data;
  },
  async create(trigger: Trigger) {
    const userId = await UserService.getUserId();

    return client.create<Trigger>({ ...trigger, userId, _type: TYPE });
  },
  async delete(trigger: Trigger) {
    return client.delete<Trigger>(trigger._id);
  },
};
