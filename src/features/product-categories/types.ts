export type ProductCategoryLocale = 'vi' | 'en';
export type ProductCategoryItem = Readonly<{ id:string;name:string;alias:string;code:string|null;description:string|null;parentId:string|null;parentName:string|null;level:number;ordering:number;published:boolean;usageCount:number;childCount:number;createdTime:string|null;updatedTime:string|null }>;
export type ProductCategoryModuleData = Readonly<Record<ProductCategoryLocale, readonly ProductCategoryItem[]>>;
