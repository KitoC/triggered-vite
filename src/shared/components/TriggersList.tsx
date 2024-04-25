import { useEffect, useState } from 'react';
import { TriggerDb, TriggerService, Trigger } from '../services/triggers';
import TriggerEditor from './TriggerEditor';
import Button from './Button';

const TriggersList = () => {
  const [triggers, setTriggers] = useState<TriggerDb>({});
  const [showNewTrigger, setShowNewTrigger] = useState(false);

  useEffect(() => {
    TriggerService.get().then(setTriggers);
  }, []);

  const handleOnTriggerSave = async (trigger: Trigger) => {
    let prev_dtrggr = undefined;

    if (triggers[trigger.id] && triggers[trigger.id].dtrggr !== trigger.dtrggr) {
      prev_dtrggr = triggers[trigger.id].dtrggr;
    }

    const nextTriggers: TriggerDb = {
      ...triggers,
      [trigger.id]: { ...trigger, prev_dtrggr },
    };

    await TriggerService.set(nextTriggers);

    setTriggers(nextTriggers);
  };
  const handleOnTriggerDelete = async (trigger: Trigger) => {
    const newTriggers = { ...triggers };

    delete newTriggers[trigger.id];

    await TriggerService.set(newTriggers);

    setTriggers(newTriggers);
  };

  const triggerList = Object.values(triggers);

  return (
    <div className="flex flex-col gap-3 w-full">
      {triggerList.map(trigger => (
        <TriggerEditor
          key={trigger.id}
          trigger={trigger}
          onSave={handleOnTriggerSave}
          onDelete={handleOnTriggerDelete}
        />
      ))}

      {(!triggerList.length || showNewTrigger) && (
        <TriggerEditor key={triggerList.length} onSave={handleOnTriggerSave} />
      )}

      {!!triggerList.length && (
        <Button className="mt-4" onClick={() => setShowNewTrigger(true)}>
          Add new Trigger
        </Button>
      )}
    </div>
  );
};

export default TriggersList;
