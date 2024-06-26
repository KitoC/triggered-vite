import { useCallback, useEffect, useState, useRef } from 'react';
import Input from './Input';
import { Trigger } from '../services/triggerService';
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
import { Spinner, Card, Button, IconButton } from '@radix-ui/themes';
import type { ButtonProps } from '@radix-ui/themes';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const dice = [faDiceOne, faDiceTwo, faDiceThree, faDiceFour, faDiceFive, faDiceSix];

interface TriggerEditorProps {
  isSaving?: boolean;
  trigger?: Trigger;
  onSave: (trigger: Trigger) => void;
  onDelete?: (trigger: Trigger) => void;
  onCancel?: () => void;
}
interface InputConfig {
  id: keyof Trigger;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  autofocus?: boolean;
  Randomizer?: JSX.Element;
}

const blankTrigger: Trigger = {
  userId: '',
  trigger: '',
  detrigger: '',
  blur_images: false,
};

const omittedAttrs = ['previousDetriggers', '_updatedAt', '_rev'];

const TriggerEditor = (props: TriggerEditorProps) => {
  const { onSave, onDelete } = props;

  const formRef = useRef<HTMLFormElement>();

  const [isRandomizing, setIsRandomizing] = useState<number>(0);
  const [currentDie, setCurrentDie] = useState<number>(3);
  const [trigger, setTrigger] = useState<Trigger>(props.trigger || blankTrigger);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(!props.trigger);
  const [isSaving, setIsSaving] = useState(false);

  const updateTrigger = useCallback(
    (key: string, value: string | number | readonly string[] | boolean) => {
      setTrigger({ ...trigger, [key]: value });
    },
    [trigger],
  );

  const hasChanged = !isEqual(omit(trigger, ...omittedAttrs), omit(props.trigger, ...omittedAttrs));

  const saveTrigger = useCallback(async () => {
    setIsSaving(true);

    await onSave?.(trigger);

    setIsSaving(false);
  }, [trigger, onSave]);

  const onCancel = () => {
    setTrigger(props.trigger || blankTrigger);
    props.onCancel?.();
  };

  const deleteTrigger = async () => {
    setIsSaving(true);
    onDelete?.(trigger);
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

      const randomWord = `${capitalize(faker.word.adjective())} ${animalType}`;

      updateTrigger('detrigger', randomWord);
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [isRandomizing, updateTrigger]);

  useEffect(() => {
    if (!props.trigger && formRef.current) {
      document.getElementById('trigger').focus();
    }
  }, [props.trigger]);

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
        autofocus={input.autofocus}
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

  const isValid = !!trigger.trigger && !!trigger.detrigger;

  const buttons = [
    {
      hidden: !onDelete,
      label: showAdvancedOptions ? 'Hide advanced options' : 'Advanced options',
      props: { className: 'mr-auto', onClick: () => setShowAdvancedOptions(!showAdvancedOptions), variant: 'surface' },
    },
    {
      hidden: !onDelete,
      label: 'Delete',
      props: { variant: 'surface', color: 'red', onClick: deleteTrigger },
    },
    {
      disabled: !hasChanged,
      label: 'Cancel',
      props: { onClick: onCancel },
    },
    {
      disabled: !hasChanged || !isValid,
      label: 'Save',
      props: { onClick: saveTrigger },
    },
  ];

  const inputs: InputConfig[] = [
    {
      id: 'trigger',
      label: 'Trigger',
      placeholder: 'What word or phrase triggers you?',
      disabled: isSaving,
      autofocus: true,
    },
    {
      id: 'detrigger',
      label: 'Replacement',
      placeholder: 'What do you want to replace it with?',
      disabled: !!isRandomizing || isSaving,
      Randomizer: (
        <IconButton disabled={isSaving} onClick={() => randomize()}>
          <FontAwesomeIcon icon={dice[currentDie]} />
        </IconButton>
      ),
    },
  ];

  const advancedInputs: InputConfig[] = [
    {
      id: 'blur_images',
      label: 'Blur images',
      type: 'checkbox',
      disabled: isSaving,
    },
  ];

  return (
    <div className="relative">
      {isSaving && (
        <div className="absolute w-full h-full z-10 bg-slate-300/25 flex items-center justify-center rounded pointer-events-none">
          <Spinner size="3" />
        </div>
      )}
      <form ref={formRef} onSubmit={e => e.preventDefault()}>
        <Card className="shadow-sm p-3 rounded flex flex-col gap-3 overflow-hidden">
          <div className="flex flex-col w-full md:flex-row md:items-end justify-between gap-3  w-full mb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-3 w-full">{inputs.map(getInput)}</div>
          </div>

          <div className="flex flex-col gap-3 items-start">
            {showAdvancedOptions && <div>{advancedInputs.map(getInput)}</div>}

            <div className="flex items-end justify-end gap-3 w-full">
              {buttons
                .filter(button => !button.hidden)
                .map(button => (
                  <Button
                    key={button.label}
                    {...(button.props as ButtonProps)}
                    disabled={button.disabled || isSaving || !!isRandomizing}>
                    {button.label}
                  </Button>
                ))}
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default TriggerEditor;
