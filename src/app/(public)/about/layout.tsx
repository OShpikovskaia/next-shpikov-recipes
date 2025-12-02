import type { FC, ReactNode } from 'react';

interface AboutLayoutProps {
  children: ReactNode;
}

const AboutLayout: FC<AboutLayoutProps> = ({ children }) => {
  return <section>{children}</section>;
};

export default AboutLayout;
