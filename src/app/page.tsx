import { Suspense } from 'react';

import { auth } from '@/modules/auth/model/auth';
import { getRecipes } from '@/modules/recipe/model/server-actions';
import RecipesListSection from '@/modules/recipe/widgets/RecipesListSection';
import { RecipesListSectionSkeleton } from '@/modules/recipe/widgets/RecipesListSection.skeleton';

async function RecipesListSectionData({
  userId,
  isAuth,
}: {
  userId: string | null;
  isAuth: boolean;
}) {
  const result = await getRecipes(userId);
  const recipes = result.success ? result.recipes : [];

  return (
    <RecipesListSection
      initialRecipes={recipes}
      isAuthInitial={isAuth}
      currentUserIdInitial={userId}
    />
  );
}

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const isAuth = Boolean(userId);

  return (
    <Suspense fallback={<RecipesListSectionSkeleton isAuth={isAuth} cardsCount={6} />}>
      <RecipesListSectionData userId={userId} isAuth={isAuth} />
    </Suspense>
  );
}
