import api from '../api';
import { UserService } from './userService';

export interface Trigger {
  _id?: string;
  userId: string;
  trigger: string;
  detrigger: string;
  blur_images: boolean;
  previousDetriggers?: string[];
}

export type TriggerDb = { [name: string]: Trigger };

export const TriggerService = {
  async get() {
    const userId = await UserService.getUserId();

    const { data } = await api.sanityProxy.get('/triggers', { headers: { ['x-user-id']: userId } });

    return data.result;
  },

  async patch(trigger: Trigger) {
    const userId = await UserService.getUserId();

    const { data } = await api.sanityProxy.patch(`/triggers/${trigger._id}`, trigger, {
      headers: { ['x-user-id']: userId },
    });

    console.log({ data });

    return data;
  },
  async create(trigger: Trigger) {
    const userId = await UserService.getUserId();

    const { data } = await api.sanityProxy.post(`/triggers`, trigger, {
      headers: { ['x-user-id']: userId },
    });

    return data;
  },
  async delete(trigger: Trigger) {
    const userId = await UserService.getUserId();

    const { data } = await api.sanityProxy.delete(`/triggers/${trigger._id}`, {
      headers: { ['x-user-id']: userId },
    });

    return data;
  },
};
