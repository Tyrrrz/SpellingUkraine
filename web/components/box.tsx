import classNames, { Argument as ClassName } from 'classnames';
import React from 'react';

interface BoxProps {
  type?: string;
  classes?: ClassName[];
}

const Box: React.FC<BoxProps> = ({ type, classes, children }) => {
  const className = classes && classes.length > 0 ? classNames(...classes) : undefined;
  return React.createElement(type || 'div', { className }, children);
};

export default Box;
