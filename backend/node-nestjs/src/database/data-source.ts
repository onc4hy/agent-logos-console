import { DataSource } from 'typeorm'
import { User } from './entities/user.entity.js'
import { Agent } from './entities/agent.entity.js'
import { Post } from './entities/post.entity.js'
import { Comment } from './entities/comment.entity.js'
import { promises as fs } from 'fs'
import { join } from 'path'

// 创建备份目录
const BACKUP_DIR = 'backups'
const DATABASE_FILE = 'database.sqlite'

// 确保备份目录存在
async function ensureBackupDir() {
  try {
    await fs.access(BACKUP_DIR)
  } catch {
    await fs.mkdir(BACKUP_DIR, { recursive: true })
  }
}

// 创建数据库备份
async function createBackup() {
  try {
    await ensureBackupDir()
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFileName = `backup-${timestamp}.sqlite`
    const backupPath = join(BACKUP_DIR, backupFileName)
    // 复制数据库文件作为备份
    await fs.copyFile(DATABASE_FILE, backupPath)
    console.log(`Database backup created: ${backupPath}`)
    // 清理旧备份（保留最近7个）
    await cleanupOldBackups()
    return backupPath
  } catch (error) {
    console.error('Failed to create database backup:', error)
    throw error
  }
}

// 清理旧备份文件
async function cleanupOldBackups() {
  try {
    const files = await fs.readdir(BACKUP_DIR)
    const backupFiles = files
      .filter((file) => file.startsWith('backup-') && file.endsWith('.sqlite'))
      .sort()
      .reverse()
    // 保留最近7个备份
    if (backupFiles.length > 7) {
      for (let i = 7; i < backupFiles.length; i++) {
        const oldBackup = join(BACKUP_DIR, backupFiles[i])
        await fs.unlink(oldBackup)
        console.log(`Removed old backup: ${oldBackup}`)
      }
    }
  } catch (error) {
    console.error('Failed to cleanup old backups:', error)
  }
}

// 恢复数据库备份
async function restoreBackup(backupFileName: string) {
  try {
    const backupPath = join(BACKUP_DIR, backupFileName)
    await fs.access(backupPath)
    // 关闭当前数据源连接
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy()
    }
    // 复制备份文件覆盖当前数据库
    await fs.copyFile(backupPath, DATABASE_FILE)
    console.log(`Database restored from: ${backupPath}`)
    // 重新初始化数据源
    await AppDataSource.initialize()
  } catch (error) {
    console.error('Failed to restore database backup:', error)
    throw error
  }
}

// 获取可用备份列表
async function listBackups() {
  try {
    await ensureBackupDir()
    const files = await fs.readdir(BACKUP_DIR)
    return files
      .filter((file) => file.startsWith('backup-') && file.endsWith('.sqlite'))
      .sort()
      .reverse()
  } catch (error) {
    console.error('Failed to list backups:', error)
    return []
  }
}

// 自动持续化保存功能
let autoSaveInterval: NodeJS.Timeout | null = null

// 启动自动保存（将内存数据持久化到数据库文件）
function startAutoSave() {
  // 如果已经存在自动保存任务，先清除
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval)
    console.log('Existing auto-save interval cleared')
  }

  // 每5分钟将内存中的数据持久化到数据库文件
  autoSaveInterval = setInterval(
    () => {
      // 使用TypeORM的queryRunner执行PRAGMA命令将内存数据写入文件
      AppDataSource.query('PRAGMA wal_checkpoint(TRUNCATE);')
        .then(() => {
          console.log(
            'Auto-save successful: Memory data persisted to database file',
          )
        })
        .catch((error) => {
          console.error('Auto-save failed:', error)
        })
    },
    5 * 60 * 1000,
  ) // 5分钟

  console.log(
    'Auto-save started (every 5 minutes) - Persisting memory data to database file',
  )
  return true
}

// 停止自动保存
function stopAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval)
    autoSaveInterval = null
    console.log('Auto-save stopped')
    return true
  }
  return false
}

// 获取自动保存状态
function isAutoSaveRunning() {
  return autoSaveInterval !== null
}

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: DATABASE_FILE,
  entities: [User, Agent, Post, Comment],
  synchronize: true,
  logging: false,
})

// 导出备份和恢复功能
export {
  createBackup,
  restoreBackup,
  listBackups,
  BACKUP_DIR,
  DATABASE_FILE,
  startAutoSave,
  stopAutoSave,
  isAutoSaveRunning,
}
