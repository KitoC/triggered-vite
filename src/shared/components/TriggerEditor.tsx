import { useCallback, useEffect, useState } from 'react';
import Button from './Button';
import Input from './Input';
import { Trigger } from '../services/triggers';
import { capitalize, isEqual, omit, random } from 'lodash';
import { faker } from '@faker-js/faker';
import {
  faDiceOne,
  faDiceTwo,
  faDiceThree,
  faDiceFour,
  faDiceFive,
  faDiceSix,
} from '@fortawesome/free-solid-svg-icons';

const dice = [faDiceOne, faDiceTwo, faDiceThree, faDiceFour, faDiceFive, faDiceSix];

interface TriggerEditorProps {
  trigger?: Trigger;
  onSave: (trigger: Trigger) => void;
  onDelete?: (trigger: Trigger) => void;
}
interface InputConfig {
  id: keyof Trigger;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  Randomizer?: JSX.Element;
}

const blankTrigger = {
  trggr: '',
  dtrggr: '',
  blur_images: false,
};

const TriggerEditor = (props: TriggerEditorProps) => {
  const { onSave, onDelete } = props;

  const [isRandomizing, setIsRandomizing] = useState<number>(0);
  const [currentDie, setCurrentDie] = useState<number>(3);
  const [trigger, setTrigger] = useState<Trigger>(props.trigger || blankTrigger);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(!props.trigger);

  const updateTrigger = useCallback(
    (key: string, value: string | number | readonly string[] | boolean) => {
      setTrigger({ ...trigger, [key]: value });
    },
    [trigger],
  );

  const hasChanged = !isEqual(omit(trigger, 'prev_dtrggr'), omit(props.trigger, 'prev_dtrggr'));

  const inputs: InputConfig[] = [
    {
      id: 'trggr',
      label: 'Trigger',
      placeholder: 'What word or phrase triggers you?',
    },
    {
      id: 'dtrggr',
      label: 'Replacement',
      placeholder: 'What do you want to replace it with?',
      disabled: !!isRandomizing,
      Randomizer: <Button iconProps={{ size: '3x' }} icon={dice[currentDie]} onClick={() => randomize()}></Button>,
    },
  ];

  const advancedInputs: InputConfig[] = [
    {
      id: 'blur_images',
      label: 'Blur images',
      type: 'checkbox',
    },
  ];

  const onCreate = () => {
    onSave({ ...trigger, id: Math.random().toString().replace('.', '') });
    setTrigger(blankTrigger);
  };

  const onCancel = () => {
    setTrigger(props.trigger || blankTrigger);
  };

  const randomize = () => {
    setIsRandomizing(random(8, 14));
  };

  useEffect(() => {
    if (!isRandomizing) return;

    const timeout = setTimeout(() => {
      setCurrentDie(random(0, 5));
      setIsRandomizing(isRandomizing - 1);
      const animalType = faker.animal.type();

      const randomWord = `${capitalize(faker.word.adjective())} ${faker.animal[animalType]?.()}`;

      updateTrigger('dtrggr', randomWord);
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [isRandomizing, updateTrigger]);

  const getInput = (input: InputConfig) => (
    <div className="flex items-end gap-3">
      <Input
        labelClassName="flex-grow"
        className="flex-grow"
        key={input.id}
        type={input.type}
        value={trigger[input.id]}
        label={input.label}
        placeholder={input.placeholder}
        id={input.id}
        disabled={input.disabled}
        onChange={e => {
          if (input.type === 'checkbox') {
            updateTrigger(input.id, e.target.checked);
          } else {
            updateTrigger(input.id, e.target.value);
          }
        }}
      />
      {input.Randomizer && input.Randomizer}
    </div>
  );

  return (
    <div className="bg-white shadow-sm p-3 rounded flex flex-col gap-3 overflow-hidden">
      <div className="flex flex-col w-full md:flex-row md:items-end justify-between gap-3  w-full mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-3 w-full">{inputs.map(getInput)}</div>
      </div>
      <div className="flex flex-col gap-3 items-start">
        {showAdvancedOptions && <div>{advancedInputs.map(getInput)}</div>}

        <div className="flex items-end justify-end gap-3 w-full">
          <Button className="mr-auto" onClick={() => setShowAdvancedOptions(!showAdvancedOptions)} type="link">
            {showAdvancedOptions ? 'Hide advanced options' : 'Advanced options'}
          </Button>
          {props.trigger ? (
            <>
              {onDelete && (
                <Button type="link" color="danger" onClick={() => onDelete(trigger)}>
                  Delete
                </Button>
              )}
              <Button disabled={!hasChanged || !!isRandomizing} onClick={onCancel}>
                Cancel
              </Button>
              <Button disabled={!hasChanged || !!isRandomizing} onClick={() => onSave(trigger)}>
                Save
              </Button>
            </>
          ) : (
            <Button onClick={onCreate} disabled={!trigger.trggr || !trigger.dtrggr}>
              Save
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TriggerEditor;
