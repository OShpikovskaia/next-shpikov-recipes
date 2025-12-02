'use client';

import Link from 'next/link';
import { Button } from '@heroui/react';

import RecipeCard from '@/components/common/recipe-card';
import { useAuthStore } from '@/store/auth.store';
import { useRecipeStore } from '@/store/recipe.store';

const Home = () => {
  const { recipes, isLoading, error } = useRecipeStore();
  const { isAuth } = useAuthStore();

  return (
    <>
      {isAuth && (
        <div className="mb-4 flex w-full items-center justify-center">
          <Link href="/recipes/new">
            <Button color="primary">Add recipe</Button>
          </Link>
        </div>
      )}

      {error && <p className="mb-4 text-red-500">{error}</p>}

      {isLoading && <p>Loading...</p>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard recipe={recipe} key={recipe.id} />
        ))}
      </div>
    </>
  );
};

export default Home;
