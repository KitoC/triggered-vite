import replaceAllInstances from './replaceAllInstances';
import { TriggerService } from '@root/src/shared/services/triggers';

const getAndReplaceTriggers = async () => {
  let shouldResetCursor = false;

  const trggrs = await TriggerService.get();

  Object.values(trggrs).forEach(async trggr => {
    shouldResetCursor = await replaceAllInstances(trggr);
  });

  return shouldResetCursor;
};

export default getAndReplaceTriggers;
