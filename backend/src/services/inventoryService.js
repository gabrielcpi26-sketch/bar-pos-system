import { supabase } from '../utils/supabaseClient.js';

export async function consumeInventoryFromOrderItems(orderItems) {
  for (const item of orderItems) {
    const { data: recipeItems } = await supabase
      .from('recipes')
      .select('ingredient_id, quantity')
      .eq('product_id', item.product_id);
    if (!recipeItems) continue;
    for (const recipe of recipeItems) {
      const { data: ingredient } = await supabase
        .from('inventory')
        .select('id, quantity, low_stock_threshold')
        .eq('ingredient_id', recipe.ingredient_id)
        .single();
      if (!ingredient) continue;
      const newQty = (ingredient.quantity || 0) - recipe.quantity * item.quantity;
      await supabase
        .from('inventory')
        .update({ quantity: newQty, updated_at: new Date().toISOString() })
        .eq('id', ingredient.id);
      if (newQty <= ingredient.low_stock_threshold) {
        await supabase.from('stock_movements').insert({
          ingredient_id: recipe.ingredient_id,
          change: 0,
          reason: 'LOW_STOCK_ALERT',
          metadata: { newQty }
        });
      }
    }
  }
}
