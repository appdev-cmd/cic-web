export interface Capabilities {
  modules: Record<string, boolean>;
  features: Record<string, boolean>;
  permissions: string[];
}

export function canAccess(
  capabilities: Capabilities,
  requirement: { module?: string; feature?: string; permission?: string },
) {
  if (requirement.module && !capabilities.modules[requirement.module]) return false;
  if (requirement.feature && !capabilities.features[requirement.feature]) return false;
  if (requirement.permission && !capabilities.permissions.includes(requirement.permission)) return false;
  return true;
}
