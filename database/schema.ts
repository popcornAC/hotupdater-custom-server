import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const otaBundles = sqliteTable('ota_bundles', {
  id: text('id').primaryKey(),
  version: text('version').notNull(),
  platform: text('platform').notNull(), // 'ios' | 'android'
  channel: text('channel').notNull(),
  status: text('status').notNull(), // 'UPDATE' | 'ROLLBACK'
  s3Key: text('s3_key').notNull(),
  message: text('message'),
  shouldForceUpdate: integer('should_force_update').$type<boolean>().notNull(),
  fileHash: text('file_hash').notNull(),
});