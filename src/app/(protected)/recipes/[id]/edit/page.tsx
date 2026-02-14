import { RecipeEditSection } from '@/modules/recipe/widgets/RecipeEditSection';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditRecipePage({ params }: PageProps) {
  const { id } = await params;
  return <RecipeEditSection id={id} />;
}
