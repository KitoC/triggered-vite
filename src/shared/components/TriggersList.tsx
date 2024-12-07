import { useEffect, useState, useCallback } from 'react';
import { TriggerService, Trigger } from '../services/triggerService';
import TriggerEditor from './TriggerEditor';
import { Button } from '@radix-ui/themes';
import { UserMetaData, UserService } from '../services/userService';

const TriggersList = () => {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [userMetaData, setUserMetaData] = useState<UserMetaData>();
  const [showNewTrigger, setShowNewTrigger] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [promises, setPromises] = useState<{ action: string; data: Trigger; promise: Promise<Trigger> }[]>([]);

  const loadTriggers = useCallback(async () => {
    setIsLoading(true);
    const userMetaData = await UserService.getUserMetaData();
    const data = await TriggerService.get();

    setUserMetaData(userMetaData);
    setTriggers(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadTriggers();
  }, [loadTriggers]);

  const handleOnTriggerSave = useCallback(
    async (trigger: Trigger) => {
      if (trigger._id) {
        const previousTrigger = triggers.find(tggr => trigger._id === tggr._id)?.detrigger;

        const updatedPreviousTriggers = [...(trigger.previousDetriggers || []), previousTrigger];
        const newTrigger = await TriggerService.patch({
          ...trigger,
          previousDetriggers: updatedPreviousTriggers.slice(-2, updatedPreviousTriggers.length),
        });
        const updatedTriggers = triggers.map(trig => (trig._id === trigger._id ? newTrigger : trig));
        setTriggers(updatedTriggers);

        chrome.storage.sync.set({ triggers: updatedTriggers });
      } else {
        const newTrigger = await TriggerService.create(trigger);

        setTriggers([newTrigger, ...triggers]);
        setShowNewTrigger(false);
      }
    },
    [triggers],
  );

  const handleOnTriggerDelete = useCallback(
    async (trigger: Trigger) => {
      setPromises([...promises, { action: 'delete', data: trigger, promise: TriggerService.delete(trigger) }]);
    },
    [promises],
  );

  useEffect(() => {
    promises.forEach(promise => {
      promise.promise.then(() => {
        if (promise.action === 'delete') {
          setTriggers(triggers.filter(t => t._id !== promise.data._id));
        }
        setPromises(promises.filter(p => p.data._id !== promise.data._id));
      });
    });
  }, [promises, triggers]);

  const triggeredMetaData = userMetaData?.apps.find(app => app.name === 'triggered');
  const TIERS = {
    FREE: 3,
    PRO: 10,
    ENTERPRISE: 'unlimited',
  };
  const USER_TIER = TIERS[triggeredMetaData?.tier || 'FREE'];

  const canCreateNewTrigger = USER_TIER === 'unlimited' ? true : triggers.length < USER_TIER;

  return (
    <div className="flex flex-col gap-3 w-full grow">
      <p>
        {USER_TIER - triggers.length} of {USER_TIER} free triggers left
      </p>
      {isLoading ? (
        <TriggerEditor loading onSave={() => null} onCancel={() => null} />
      ) : (
        <>
          {!!triggers.length && canCreateNewTrigger && (
            <Button disabled={showNewTrigger} className="mb-4" onClick={() => setShowNewTrigger(true)}>
              Add new Trigger
            </Button>
          )}
          {(!triggers.length || showNewTrigger) && (
            <TriggerEditor
              key={triggers.length}
              onSave={handleOnTriggerSave}
              onCancel={() => setShowNewTrigger(false)}
            />
          )}
          {triggers.map(trigger => (
            <TriggerEditor
              key={trigger._id}
              trigger={trigger}
              onSave={handleOnTriggerSave}
              onDelete={handleOnTriggerDelete}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default TriggersList;
