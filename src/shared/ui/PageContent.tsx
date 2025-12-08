import type { FC, PropsWithChildren } from 'react';

const PageContent: FC<PropsWithChildren> = ({ children }) => {
  return <section className="mx-auto w-full max-w-3xl px-4 py-8">{children}</section>;
};

export default PageContent;
