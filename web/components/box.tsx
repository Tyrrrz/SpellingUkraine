import classNames, { Argument as ClassName } from 'classnames';
import { createElement, CSSProperties, FC, ReactNode } from 'react';

interface BoxProps {
  type?: string;
  classes?: ClassName[];
  style?: CSSProperties;
  children?: ReactNode;
}

const Box: FC<BoxProps> = ({ type = 'div', classes = [], style, children }) => {
  const className = classNames(classes) || undefined;
  return createElement(type, { className, style }, children);
};

export default Box;
