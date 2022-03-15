import { Box } from './box';

export const HDock: React.FC = ({ children }) => {
  return <Box classes={['flex', 'justify-between']}>{children}</Box>;
};
