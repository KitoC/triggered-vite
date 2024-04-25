import { ReactNode, SyntheticEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { Button as RButton } from '@radix-ui/themes';

const getBaseStyles = (type: string, color = 'primary') => {
  const styles: { [key: string]: string } = {
    button: `bg-${color} hover:bg-${color}-dark  disabled:bg-slate-300 transition-all rounded text-white px-3 h-8`,
    link: `text-${color} hover:text-${color}-dark underline`,
    'icon-button': `text-${color} hover:text-${color}-dark disabled:bg-slate-300 transition-all rounded flex items-center h-fit`,
  };

  return styles[type];
};

interface ButtonProps {
  label?: string;
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
  onClick: (e: SyntheticEvent) => void;
  type?: 'button' | 'link' | 'danger-link';
  icon?: FontAwesomeIconProps['icon'];
  iconProps?: Omit<FontAwesomeIconProps, 'icon'>;
  color?: string;
}

const Button = (props: ButtonProps) => {
  const { type = 'button', color, className = '', icon, iconProps, children, ...buttonProps } = props;

  const baseStyles = getBaseStyles(icon ? `icon-${type}` : type, color);

  const buttonClassName = `${baseStyles} ${className}`;

  return (
    <RButton className={buttonClassName} {...buttonProps} onClick={e => props.onClick(e)}>
      {icon ? <FontAwesomeIcon {...iconProps} className="w-fit h-[32px]" icon={icon} /> : children}
    </RButton>
  );
};

export default Button;
