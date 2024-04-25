import { useEffect, useState, useCallback } from 'react';
import { TriggerService, Trigger } from '../services/triggerService';
import TriggerEditor from './TriggerEditor';
import { Button, Spinner } from '@radix-ui/themes';

const TriggersList = () => {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [showNewTrigger, setShowNewTrigger] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadTriggers = useCallback(async () => {
    setIsLoading(true);
    const data = await TriggerService.get();
    setTriggers(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadTriggers();
  }, [loadTriggers]);

  const handleOnTriggerSave = useCallback(
    async (trigger: Trigger) => {
      if (trigger._id) {
        const newTrigger = await TriggerService.patch({ ...trigger, previousDetriggers: [] });
        setTriggers(triggers.map(trig => (trig._id === trigger._id ? newTrigger : trig)));
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
      await TriggerService.delete(trigger);

      setTriggers(triggers.filter(t => t._id !== trigger._id));
    },
    [triggers],
  );

  return (
    <div className="flex flex-col gap-3 w-full grow">
      {isLoading ? (
        <div className="flex items-center justify-center grow">
          <Spinner size="3" />
        </div>
      ) : (
        <>
          {!!triggers.length && (
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
