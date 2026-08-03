export interface PermissionTask {
  id: string;
  module: string;
  view: string;
  task: string;
  description: string;
  published: boolean;
  ordering: number;
}

export interface PermissionFunction {
  id: string;
  taskId: string;
  code: string;
  name: string;
}

export interface PermissionField {
  id: string;
  moduleId: string;
  fieldCode: string;
  fieldName: string;
}

export interface UserPermissionState {
  userId: string;
  grantedTaskIds: string[];
  grantedFunctionIds: string[];
  grantedFieldIds: string[]; // Fields allowed to edit/view
}

export interface CmsUserPermissionTarget {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
}
