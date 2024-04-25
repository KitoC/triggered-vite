import { useEffect, useState, useCallback } from 'react';
import { TriggerService, Trigger } from '../services/triggerService';
import TriggerEditor from './TriggerEditor';
import { Button } from '@radix-ui/themes';

const TriggersList = () => {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [showNewTrigger, setShowNewTrigger] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    TriggerService.get().then(setTriggers);
  }, []);

  const handleOnTriggerSave = useCallback(
    async (trigger: Trigger) => {
      setIsSaving(true);

      if (trigger._id) {
        const newTrigger = await TriggerService.patch({ ...trigger, previousDetriggers: [] });
        setTriggers(triggers.map(trig => (trig._id === trigger._id ? newTrigger : trig)));
      } else {
        const newTrigger = await TriggerService.create(trigger);

        setTriggers([...triggers, newTrigger]);
      }
      setIsSaving(false);
    },
    [triggers],
  );

  const handleOnTriggerDelete = useCallback(
    async (trigger: Trigger) => {
      setIsSaving(true);

      await TriggerService.delete(trigger);

      setTriggers(triggers.filter(t => t._id !== trigger._id));

      setIsSaving(false);
    },
    [triggers],
  );

  return (
    <div className="flex flex-col gap-3 w-full">
      {triggers.map(trigger => (
        <TriggerEditor
          key={trigger._id}
          trigger={trigger}
          onSave={handleOnTriggerSave}
          onDelete={handleOnTriggerDelete}
          isSaving={isSaving}
        />
      ))}

      {(!triggers.length || showNewTrigger) && (
        <TriggerEditor key={triggers.length} onSave={handleOnTriggerSave} isSaving={isSaving} />
      )}

      {!!triggers.length && (
        <Button className="mt-4" onClick={() => setShowNewTrigger(true)}>
          Add new Trigger
        </Button>
      )}
    </div>
  );
};

export default TriggersList;
