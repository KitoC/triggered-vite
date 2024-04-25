import { ChangeEvent } from 'react';
import clsx from 'clsx';

interface InputProps {
  id: string;
  label?: string;
  placeholder?: string;
  type?: string;
  labelClassName?: string;
  disabled?: boolean;
  autofocus?: boolean;
  className?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: (string | number | readonly string[]) | boolean;
}

const Input = (props: InputProps) => {
  const { id, labelClassName, value, ...inputProps } = props;
  const isCheckbox = inputProps.type === 'checkbox';

  const valueOrChecked = isCheckbox
    ? ({ checked: value } as { checked: boolean })
    : ({ value } as { value: string | number | readonly string[] });

  return (
    <label
      htmlFor={id}
      className={clsx('flex flex-col gap-2', labelClassName, {
        '!flex-row-reverse items-center w-fit ': isCheckbox,
        'items-start ': !isCheckbox,
      })}>
      <span className="font-semibold">{props.label}</span>
      <input
        id={id}
        {...inputProps}
        {...valueOrChecked}
        className={clsx('border caret-black w-full care p-1 h-8 rounded', inputProps.className, {
          '!w-fit': isCheckbox,
        })}
      />
    </label>
  );
};

export default Input;
