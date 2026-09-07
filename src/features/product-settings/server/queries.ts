import 'server-only';
import { getProductCategoryModuleData } from '@/features/product-categories/server/queries';
/** Compatibility boundary: each Product Settings route must request only its own dataset. */
export async function getProductSettingsData(){return{categories:await getProductCategoryModuleData()};}
