import classNames, { Argument as ClassName } from 'classnames';
import React from 'react';

interface BoxProps {
  type?: string;
  classes?: ClassName[];
  style?: React.CSSProperties;
}

const Box: React.FC<BoxProps> = ({ type, classes, style, children }) => {
  const className = classes && classes.length > 0 ? classNames(...classes) : undefined;
  return React.createElement(type || 'div', { className, style }, children);
};

export default Box;
