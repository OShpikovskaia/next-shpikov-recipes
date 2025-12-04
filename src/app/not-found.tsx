'use client';

import EmptyState from '@/components/common/empty-state';

const NotFoundPage = () => {
  return (
    <div className="mx-auto w-full max-w-3xl px-6">
      <EmptyState
        variant="recipeNotFound"
        title="Page not found"
        description="This page doesn’t exist or might have been moved."
        primaryActionLabel="Back to recipes"
        primaryActionHref="/"
      />
    </div>
  );
};

export default NotFoundPage;
