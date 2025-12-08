import { RecipeEditSection } from '@/modules/recipe/widgets/RecipeEditSection';

interface PageProps {
  params: { id: string };
}

export default async function EditRecipePage({ params }: PageProps) {
  const { id } = await params;
  return <RecipeEditSection id={id} />;
}
