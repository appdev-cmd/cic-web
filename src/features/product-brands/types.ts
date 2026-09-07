export type ProductBrandLocale='vi'|'en';
export type ProductBrandItem=Readonly<{id:string;name:string;alias:string;ordering:number;published:boolean;usageCount:number;createdTime:string|null;updatedTime:string|null}>;
export type ProductBrandModuleData=Readonly<Record<ProductBrandLocale,readonly ProductBrandItem[]>>;
