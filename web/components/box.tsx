import classNames, { Argument as ClassName } from 'classnames';
import { createElement, CSSProperties, FC, PropsWithChildren } from 'react';

type BoxProps = PropsWithChildren<{
  type?: string;
  classes?: ClassName[];
  style?: CSSProperties;
}>;

const Box: FC<BoxProps> = ({ type = 'div', classes = [], style, children }) => {
  const className = classNames(classes) || undefined;
  return createElement(type, { className, style }, children);
};

export default Box;
