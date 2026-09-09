export type SalesOwnerLocale = 'vi' | 'en';
export type SalesOwnerAssignments = Readonly<{
  contact: readonly string[];
  sales: readonly string[];
  technical: readonly string[];
  northSales: readonly string[];
  southSales: readonly string[];
}>;
export type SalesOwnerItem = Readonly<{
  id:string; name:string; alias:string; phone:string; skype:string; zalo:string;
  ordering:number; published:boolean; createdTime:string|null; updatedTime:string|null;
  assignments:SalesOwnerAssignments; usageCount:number; orphanProductIds:readonly string[];
}>;
export type SalesOwnerProductOption = Readonly<{id:string;name:string;published:boolean}>;
export type SalesOwnerModuleData = Readonly<Record<SalesOwnerLocale,Readonly<{items:readonly SalesOwnerItem[];products:readonly SalesOwnerProductOption[]}>>>;
export type PublicSalesContact = Readonly<{id:string;name:string;phone:string}>;
export type PublicProductContacts = Readonly<{contact:readonly PublicSalesContact[];sales:readonly PublicSalesContact[];technical:readonly PublicSalesContact[];northSales:readonly PublicSalesContact[];southSales:readonly PublicSalesContact[]}>;
export type PublicProductContactMap = Readonly<Record<string,PublicProductContacts>>;
