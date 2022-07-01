import classNames, { Argument as ClassName } from 'classnames';
import React from 'react';

interface BoxProps {
  type?: string;
  classes?: ClassName[];
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const Box: React.FC<BoxProps> = ({ type = 'div', classes = [], style, children }) => {
  const className = classNames(classes) || undefined;
  return React.createElement(type, { className, style }, children);
};

export default Box;
