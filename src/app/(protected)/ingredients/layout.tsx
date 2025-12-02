import type { FC, ReactNode } from 'react';

interface IngredientsLayoutProps {
  children: ReactNode;
}

const IngredientsLayout: FC<IngredientsLayoutProps> = ({ children }) => {
  return <section>{children}</section>;
};

export default IngredientsLayout;
