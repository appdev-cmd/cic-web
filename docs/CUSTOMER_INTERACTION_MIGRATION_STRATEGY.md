# Chiến Lược Chuyển Dữ Liệu Từ Module Cũ
# Customer Interaction System - Migration Strategy

## Tổng quan (Overview)

Tài liệu này chi tiết hóa chiến lược chuyển đổi dữ liệu từ module hiện tại sang hệ thống Tương tác khách hàng mới, đảm bảo không mất dữ liệu và downtime tối thiểu.

---

## 1. Audit Module Hiện Tại (Current Module Audit)

### 1.1 Content Blocks Module Analysis

Dựa trên codebase hiện tại, module `content_blocks` hiện tại quản lý:

#### Current CTA Implementation
- **Vị trí**: `src/cms/modules/content_blocks/`
- **Data structure**: `BlockContentData` interface với các fields:
  - `cta_text` - Text hiển thị trên CTA
  - `cta_url` - URL khi click
  - `secondary_cta_text` - Secondary CTA text
  - `secondary_cta_url` - Secondary CTA URL

- **Block types có CTA**:
  - `hero_cta` - Hero banner với CTA
  - `announcement_bar` - Thanh thông báo với CTA
  - Các block types khác có thể có CTA content

#### Current Form Implementation
- **Trạng thái hiện tại**: Không có dedicated form management
- **Forms có thể được embedded** qua:
  - HTML content trong rich text blocks
  - Custom embed code
  - Third-party integrations

#### Data Inventory
```typescript
// Audit script để đếm existing data
interface ContentBlockAudit {
  totalBlocks: number;
  blocksWithCta: number;
  blocksWithForms: number;
  ctaUrls: string[];
  formEmbeds: string[];
  usageByPage: Record<string, number>;
}
```

### 1.2 Existing Customer Data
- **Current location**: Không có centralized customer request management
- **Phân tán ở**: 
  - Email forms
  - Third-party CRM
  - Manual records
  - Database tables khác (nếu có)

---

## 2. Mapping Strategy (Chiến Lược Mapping)

### 2.1 CTA Mapping

#### Old Structure → New Structure

```typescript
// Old structure (ContentBlock)
interface OldCtaData {
  cta_text: string;
  cta_url: string;
  secondary_cta_text?: string;
  secondary_cta_url?: string;
}

// New structure (CTA)
interface NewCtaData {
  adminName: string;
  displayText: string;
  description?: string;
  code: string;
  icon?: string;
  actionConfig: CtaActionConfig;
  status: CtaStatus;
}
```

#### Mapping Rules

1. **Text-based CTAs** → New CTA với action type `redirect_external`
   ```typescript
   {
     displayText: old.cta_text,
     actionConfig: {
       type: 'redirect_external',
       url: old.cta_url,
       openInNewTab: true // Default cho external links
     }
   }
   ```

2. **Internal CTAs** → New CTA với action type `redirect_internal`
   ```typescript
   if (isInternalUrl(old.cta_url)) {
     actionConfig: {
       type: 'redirect_internal',
       url: old.cta_url,
       openInNewTab: false
     }
   }
   ```

3. **Secondary CTAs** → Separate CTA entries
   - Mỗi secondary CTA thành separate CTA item
   - Tên quản trị với suffix " (Secondary)"

#### Naming Convention
```typescript
function generateCtaAdminName(block: BlockItem, isSecondary: boolean): string {
  const baseName = `${block.title} - CTA`;
  return isSecondary ? `${baseName} (Secondary)` : baseName;
}

function generateCtaCode(block: BlockItem, isSecondary: boolean): string {
  const baseCode = block.code_alias.replace(/-/g, '_');
  return isSecondary ? `${baseCode}_secondary` : baseCode;
}
```

### 2.2 Form Mapping

#### HTML Forms → New Form Structure

```typescript
// Parse HTML form để extract fields
interface ParsedForm {
  fields: ParsedFormField[];
  action: string;
  method: string;
}

interface ParsedFormField {
  name: string;
  type: string;
  label?: string;
  required: boolean;
  options?: string[];
}

// Map sang new form structure
function mapParsedFormToNewForm(parsed: ParsedForm, block: BlockItem): FormItem {
  return {
    adminName: `${block.title} - Form`,
    title: `Form từ ${block.title}`,
    code: generateFormCode(block),
    fields: parsed.fields.map((field, index) => ({
      fieldKey: sanitizeFieldKey(field.name),
      label: field.label || field.name,
      fieldType: mapFieldType(field.type),
      position: index,
      isRequired: field.required,
      isLocked: false,
      validation: { required: field.required }
    })),
    // ... other fields
  };
}
```

#### Field Type Mapping
```typescript
function mapFieldType(htmlType: string): FieldType {
  const mapping: Record<string, FieldType> = {
    'text': 'text',
    'textarea': 'textarea',
    'email': 'email',
    'tel': 'email', // tel → phone type
    'number': 'number',
    'select': 'select',
    'radio': 'radio',
    'checkbox': 'checkbox',
    'date': 'date',
    'file': 'file_upload',
    'hidden': 'hidden'
  };
  return mapping[htmlType] || 'text';
}
```

### 2.3 Customer Request Mapping

#### Email/Manual Records → New Structure

```typescript
interface LegacyCustomerRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source: string;
  createdAt: string;
}

function mapLegacyRecord(latest: LegacyCustomerRecord): CustomerRequest {
  return {
    id: generateNewId(),
    sourceConfig: {
      formId: MIGRATED_FORM_ID,
      formVersion: 1,
      formName: 'Migrated Form',
      pageType: 'unknown',
      pageId: 'unknown',
      pageUrl: latest.source,
      pageTitle: 'Migrated Record',
      submittedAt: latest.createdAt
    },
    submissionValues: [
      {
        fieldKey: 'full_name',
        fieldLabel: 'Họ tên',
        fieldType: 'text',
        valueText: latest.name
      },
      {
        fieldKey: 'email',
        fieldLabel: 'Email',
        fieldType: 'email',
        valueText: latest.email
      },
      // ... other fields
    ],
    status: 'completed', // Legacy records assume completed
    createdAt: latest.createdAt,
    updatedAt: new Date().toISOString()
  };
}
```

---

## 3. Migration Implementation (Triển Khai Migration)

### 3.1 Phase 1: Data Extraction

#### Script: Extract CTA Data
```typescript
// scripts/extract_cta_data.ts
import { BlockItem } from '../src/cms/modules/content_blocks/types';

interface ExtractedCta {
  blockId: string;
  blockTitle: string;
  blockCode: string;
  ctaType: 'primary' | 'secondary';
  displayText: string;
  url: string;
  placement: string;
  pages: string[];
}

export async function extractCtaData(): Promise<ExtractedCta[]> {
  const extractedCtas: ExtractedCta[] = [];
  
  // Query all content blocks
  const blocks = await getAllContentBlocks();
  
  for (const block of blocks) {
    // Extract primary CTA
    if (block.content.cta_text && block.content.cta_url) {
      extractedCtas.push({
        blockId: block.id,
        blockTitle: block.title,
        blockCode: block.code_alias,
        ctaType: 'primary',
        displayText: block.content.cta_text,
        url: block.content.cta_url,
        placement: block.placement_name,
        pages: block.used_by_pages.map(p => p.page_path)
      });
    }
    
    // Extract secondary CTA
    if (block.content.secondary_cta_text && block.content.secondary_cta_url) {
      extractedCtas.push({
        blockId: block.id,
        blockTitle: block.title,
        blockCode: block.code_alias,
        ctaType: 'secondary',
        displayText: block.content.secondary_cta_text,
        url: block.content.secondary_cta_url,
        placement: block.placement_name,
        pages: block.used_by_pages.map(p => p.page_path)
      });
    }
  }
  
  return extractedCtas;
}
```

#### Script: Extract Form Data
```typescript
// scripts/extract_form_data.ts
interface ExtractedForm {
  blockId: string;
  blockTitle: string;
  htmlContent: string;
  parsedFields: ParsedFormField[];
  placement: string;
  pages: string[];
}

export async function extractFormData(): Promise<ExtractedForm[]> {
  const extractedForms: ExtractedForm[] = [];
  
  const blocks = await getAllContentBlocks();
  
  for (const block of blocks) {
    if (block.content.body_html) {
      const forms = parseHtmlForms(block.content.body_html);
      
      for (const form of forms) {
        extractedForms.push({
          blockId: block.id,
          blockTitle: block.title,
          htmlContent: form.html,
          parsedFields: form.fields,
          placement: block.placement_name,
          pages: block.used_by_pages.map(p => p.page_path)
        });
      }
    }
  }
  
  return extractedForms;
}
```

### 3.2 Phase 2: Data Transformation

#### Script: Transform CTA Data
```typescript
// scripts/transform_cta_data.ts
import { ExtractedCta } from './extract_cta_data';
import { CtaItem, ActionType } from '../src/cms/modules/customer_interaction/cta/types';

export function transformCtaData(extracted: ExtractedCta[]): CtaItem[] {
  return extracted.map(extracted => {
    const actionType = determineActionType(extracted.url);
    
    return {
      id: generateNewId(),
      adminName: generateCtaAdminName(extracted),
      displayText: extracted.displayText,
      description: `Migrated from content block: ${extracted.blockTitle}`,
      code: generateCtaCode(extracted),
      actionConfig: {
        type: actionType,
        url: extracted.url,
        openInNewTab: actionType === 'redirect_external'
      },
      status: 'active',
      usedByCount: extracted.pages.length,
      usedByPages: extracted.pages.map(page => ({
        pageId: extractPageId(page),
        pageTitle: extractPageTitle(page),
        pagePath: page,
        placementKey: extracted.placement
      })),
      analytics: {
        impressions: 0, // Reset analytics sau migration
        clicks: 0,
        ctr: 0
      },
      createdBy: 'SYSTEM_MIGRATION',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });
}

function determineActionType(url: string): ActionType {
  if (isInternalUrl(url)) {
    return 'redirect_internal';
  }
  return 'redirect_external';
}
```

#### Script: Transform Form Data
```typescript
// scripts/transform_form_data.ts
import { ExtractedForm } from './extract_form_data';
import { FormItem, FormField } from '../src/cms/modules/customer_interaction/forms/types';

export function transformFormData(extracted: ExtractedForm[]): FormItem[] {
  return extracted.map(extracted => {
    const fields: FormField[] = extracted.parsedFields.map((field, index) => ({
      id: generateNewId(),
      fieldKey: sanitizeFieldKey(field.name),
      label: field.label || field.name,
      fieldType: mapFieldType(field.type),
      position: index,
      isRequired: field.required,
      isLocked: false,
      validation: { required: field.required },
      options: field.options ? field.options.map(opt => ({
        value: opt,
        label: opt
      })) : undefined
    }));
    
    return {
      id: generateNewId(),
      adminName: `${extracted.blockTitle} - Form`,
      title: `Form từ ${extracted.blockTitle}`,
      description: `Migrated from content block`,
      code: generateFormCode(extracted),
      status: 'active',
      currentVersion: 1,
      fields: fields,
      submitConfig: {
        saveToDatabase: true,
        createCustomerRequest: true,
        sendAdminEmail: false, // Configure sau migration
        adminEmails: [],
        sendConfirmationEmail: false,
        successMessage: 'Cảm ơn bạn đã gửi thông tin',
        webhookUrl: undefined,
        crmSyncEnabled: false
      },
      analytics: {
        opens: 0,
        submissions: 0,
        completionRate: 0
      },
      createdBy: 'SYSTEM_MIGRATION',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });
}
```

### 3.3 Phase 3: Data Loading

#### Script: Load CTA Data
```typescript
// scripts/load_cta_data.ts
import { CtaItem } from '../src/cms/modules/customer_interaction/cta/types';

export async function loadCtaData(ctas: CtaItem[]): Promise<void> {
  const client = await getDatabaseClient();
  
  try {
    await client.transaction(async (trx) => {
      for (const cta of ctas) {
        // Insert CTA
        await trx('ctas').insert({
          id: cta.id,
          admin_name: cta.adminName,
          display_text: cta.displayText,
          description: cta.description,
          code: cta.code,
          action_type: cta.actionConfig.type,
          action_config: JSON.stringify(cta.actionConfig),
          status: cta.status,
          created_by: cta.createdBy,
          created_at: cta.createdAt,
          updated_at: cta.updatedAt
        });
        
        // Log migration
        await trx('migration_logs').insert({
          entity_type: 'cta',
          old_id: null, // New entity
          new_id: cta.id,
          migration_action: 'create',
          metadata: JSON.stringify({ source: 'content_block_migration' })
        });
      }
    });
    
    console.log(`Successfully loaded ${ctas.length} CTAs`);
  } catch (error) {
    console.error('Error loading CTA data:', error);
    throw error;
  }
}
```

#### Script: Load Form Data
```typescript
// scripts/load_form_data.ts
import { FormItem } from '../src/cms/modules/customer_interaction/forms/types';

export async function loadFormData(forms: FormItem[]): Promise<void> {
  const client = await getDatabaseClient();
  
  try {
    await client.transaction(async (trx) => {
      for (const form of forms) {
        // Insert Form
        await trx('forms').insert({
          id: form.id,
          admin_name: form.adminName,
          title: form.title,
          description: form.description,
          code: form.code,
          status: form.status,
          current_version: form.currentVersion,
          submit_config: JSON.stringify(form.submitConfig),
          created_by: form.createdBy,
          created_at: form.createdAt,
          updated_at: form.updatedAt
        });
        
        // Insert Form Fields
        for (const field of form.fields) {
          await trx('form_fields').insert({
            id: field.id,
            form_id: form.id,
            form_version: form.currentVersion,
            field_key: field.fieldKey,
            label: field.label,
            field_type: field.fieldType,
            role_type: field.roleType,
            position: field.position,
            is_required: field.isRequired,
            validation_config: JSON.stringify(field.validation),
            option_config: field.options ? JSON.stringify(field.options) : null,
            is_locked: field.isLocked,
            status: 'active'
          });
        }
        
        // Log migration
        await trx('migration_logs').insert({
          entity_type: 'form',
          old_id: null,
          new_id: form.id,
          migration_action: 'create',
          metadata: JSON.stringify({ source: 'content_block_migration' })
        });
      }
    });
    
    console.log(`Successfully loaded ${forms.length} Forms`);
  } catch (error) {
    console.error('Error loading Form data:', error);
    throw error;
  }
}
```

### 3.4 Phase 4: Reference Updates

#### Script: Update Content Block References
```typescript
// scripts/update_block_references.ts
export async function updateContentBlockReferences(): Promise<void> {
  const client = await getDatabaseClient();
  
  try {
    // Get mapping old block ID → new CTA/Form IDs
    const mapping = await getMigrationMapping();
    
    // Update content_blocks table
    await client('content_blocks')
      .whereNotNull('content->cta_text')
      .update({
        content: client.raw(`
          jsonb_set(
            content,
            '{cta_id}',
            ?::jsonb
          )
        `, [JSON.stringify(mapping.primaryCtaId)])
      });
    
    // Remove old CTA fields (keep as backup)
    // await client('content_blocks')
    //   .update({
    //     content: client.raw(`
    //       content - 'cta_text' - 'cta_url' - 'secondary_cta_text' - 'secondary_cta_url'
    //     `)
    //   });
    
    console.log('Successfully updated content block references');
  } catch (error) {
    console.error('Error updating references:', error);
    throw error;
  }
}
```

---

## 4. Migration Execution Plan (Kế Hoạch Thực Thi)

### 4.1 Pre-Migration Checklist

- [ ] **Backup database**:
  ```bash
  pg_dump -h localhost -U postgres cic14005_cic_fs > backup_before_migration.sql
  ```

- [ ] **Create migration tables**:
  ```sql
  CREATE TABLE migration_logs (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50),
    old_id VARCHAR(100),
    new_id VARCHAR(100),
    migration_action VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```

- [ ] **Run data audit**:
  ```bash
  npm run audit:existing-data
  ```

- [ ] **Review audit report** và approve migration plan

### 4.2 Migration Steps

#### Step 1: Development Environment Migration
```bash
# 1. Switch to dev database
export DATABASE_URL=postgresql://user:pass@localhost/cic_dev

# 2. Run migration scripts
npm run migration:extract
npm run migration:transform
npm run migration:load

# 3. Validate results
npm run migration:validate

# 4. Test functionality
npm run test:e2e
```

#### Step 2: Staging Environment Migration
```bash
# 1. Backup staging database
pg_dump -h staging-host -U postgres cic_staging > staging_backup.sql

# 2. Run migration on staging
npm run migration:all --env=staging

# 3. Comprehensive testing
npm run test:comprehensive

# 4. Performance testing
npm run test:performance

# 5. Data integrity validation
npm run migration:validate --env=staging
```

#### Step 3: Production Migration
```bash
# 1. Schedule maintenance window
# 2. Notify users
# 3. Backup production database
pg_dump -h prod-host -U postgres cic_prod > prod_backup.sql

# 4. Put site in maintenance mode
npm run maintenance:on

# 5. Run migration
npm run migration:all --env=production

# 6. Validate migration
npm run migration:validate --env=production

# 7. Smoke testing
npm run test:smoke

# 8. Take site out of maintenance
npm run maintenance:off

# 9. Monitor for issues
npm run monitor:post-migration
```

### 4.3 Rollback Plan

```bash
# Nếu migration fails, rollback:
# 1. Restore database from backup
psql -h localhost -U postgres cic_prod < prod_backup.sql

# 2. Restart application
npm run restart

# 3. Verify system is working
npm run test:smoke
```

---

## 5. Post-Migration Tasks (Tasks Sau Migration)

### 5.1 Data Validation
```typescript
// Validation script
interface ValidationResult {
  totalOldBlocks: number;
  totalNewCtas: number;
  totalNewForms: number;
  referenceIntegrity: boolean;
  dataConsistency: boolean;
  issues: string[];
}

export async function validateMigration(): Promise<ValidationResult> {
  const issues: string[] = [];
  
  // Count validation
  const oldBlockCount = await countOldContentBlocks();
  const newCtaCount = await countNewCtas();
  const newFormCount = await countNewForms();
  
  // Reference integrity check
  const orphanedReferences = await findOrphanedReferences();
  if (orphanedReferences.length > 0) {
    issues.push(`Found ${orphanedReferences.length} orphaned references`);
  }
  
  // Data consistency check
  const inconsistentData = await findInconsistentData();
  if (inconsistentData.length > 0) {
    issues.push(`Found ${inconsistentData.length} inconsistent records`);
  }
  
  return {
    totalOldBlocks: oldBlockCount,
    totalNewCtas: newCtaCount,
    totalNewForms: newFormCount,
    referenceIntegrity: orphanedReferences.length === 0,
    dataConsistency: inconsistentData.length === 0,
    issues
  };
}
```

### 5.2 Performance Monitoring
```typescript
// Monitor performance post-migration
interface PerformanceMetrics {
  queryTimes: Record<string, number>;
  pageLoadTimes: Record<string, number>;
  errorRates: Record<string, number>;
}

export async function monitorPerformance(duration: number): Promise<PerformanceMetrics> {
  // Monitor for specified duration (e.g., 24 hours)
  // Collect metrics and compare with baseline
  // Alert if performance degrades significantly
}
```

### 5.3 User Communication
- [ ] Send notification về migration completion
- [ ] Provide training materials cho new system
- [ ] Schedule Q&A sessions
- [ ] Collect feedback và iterate

### 5.4 Deprecation of Old System
```typescript
// Phase 1: Hide old features (immediately after migration)
const DEPRECATION_PHASE_1 = {
  hideCtaFields: true,
  showMigrationNotice: true,
  preventNewCtaCreation: true
};

// Phase 2: Read-only mode (1 month after migration)
const DEPRECATION_PHASE_2 = {
  makeCtaFieldsReadOnly: true,
  showDeprecationWarning: true
};

// Phase 3: Complete removal (3 months after migration)
const DEPRECATION_PHASE_3 = {
  removeOldFields: true,
  cleanupMigrationLogs: false // Keep for audit
};
```

---

## 6. Risk Mitigation (Giảm Thiểu Rủi Ro)

### 6.1 Data Loss Prevention
- **Multiple backups**: Before, during, after migration
- **Immutable backup**: Original backup never modified
- **Point-in-time recovery**: Enable PITR for database
- **Data validation**: Comprehensive validation at each step

### 6.2 Downtime Minimization
- **Blue-green deployment**: Switch traffic instantly
- **Feature flags**: Gradual rollout of new features
- **Load testing**: Ensure system can handle load
- **Rollback plan**: Quick rollback if issues arise

### 6.3 User Impact Minimization
- **Maintenance window**: Schedule during low-traffic period
- **Clear communication**: Notify users well in advance
- **Graceful degradation**: Old system remains partially functional
- **Support readiness**: Extra support during migration period

---

## 7. Success Criteria (Tiêu Chuẩn Thành Công)

### 7.1 Technical Success
- [ ] Zero data loss
- [ ] Reference integrity maintained
- [ ] Performance within 10% of baseline
- [ ] Zero critical bugs post-migration
- [ ] Rollback tested and verified

### 7.2 Business Success
- [ ] All users can access new system
- [ ] Training completion rate > 90%
- [ ] User satisfaction score > 4/5
- [ ] Support ticket volume does not increase
- [ ] Migration completed within scheduled window

---

## 8. Timeline (Thời Gian)

### Week 1: Preparation
- Day 1-2: Data audit and analysis
- Day 3-4: Migration script development
- Day 5: Testing on development environment

### Week 2: Staging Migration
- Day 1-2: Migration on staging
- Day 3-4: Comprehensive testing
- Day 5: Performance optimization

### Week 3: Production Migration
- Day 1: Pre-migration checks and backup
- Day 2: Production migration
- Day 3-4: Monitoring and validation
- Day 5: Documentation and handover

---

## 9. Resources Needed (Nguồn Lực)

### Personnel
- 1 Database Developer (migration scripts)
- 1 Backend Developer (API integration)
- 1 Frontend Developer (UI updates)
- 1 QA Engineer (testing)
- 1 DevOps Engineer (deployment)

### Infrastructure
- Development environment (existing)
- Staging environment (existing)
- Production environment (existing)
- Backup storage (additional)
- Monitoring tools (existing)

---

## 10. Conclusion

Chiến lược migration này đảm bảo:

1. **Data integrity**: Comprehensive validation và rollback procedures
2. **Minimal downtime**: Careful planning và execution
3. **User confidence**: Clear communication và support
4. **System stability**: Thorough testing và monitoring
5. **Future-proofing**: Clean architecture cho long-term maintenance

Việc theo dõi chiến lược này sẽ help ensure successful transition từ legacy system sang new Customer Interaction Management System.