import IngredientEditorSkeleton from '../features/IngredientEditor.skeleton';
import IngredientsTableSkeleton from '../ui/IngredientsTable.skeleton';

function IngredientsPageSkeleton() {
  return (
    <div className="w-full">
      {/* we assume title is on the page already, so skeleton for content only */}
      <div className="space-y-6">
        <IngredientEditorSkeleton />
        <IngredientsTableSkeleton />
      </div>
    </div>
  );
}

export default IngredientsPageSkeleton;
