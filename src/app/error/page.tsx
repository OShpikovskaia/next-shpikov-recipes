'use client';

import { useSearchParams } from 'next/navigation';

const ErrorPage = () => {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'Uknown error';

  return (
    <div className="flex items-center justify-center">
      <p className="text-xl text-red-500">{message}</p>
    </div>
  );
};

export default ErrorPage;
