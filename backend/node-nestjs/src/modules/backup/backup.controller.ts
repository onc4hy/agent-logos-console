import {
  Controller,
  Post,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Logger,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import {
  createBackup,
  restoreBackup,
  listBackups,
  startAutoSave,
  stopAutoSave,
  isAutoSaveRunning,
} from '../../database/data-source.js'

@Controller('api/backup')
@UseGuards(JwtAuthGuard)
export class BackupController {
  private readonly logger = new Logger(BackupController.name)

  @Post('create')
  @HttpCode(HttpStatus.OK)
  async createBackup() {
    try {
      this.logger.log('Creating database backup')
      const backupPath = await createBackup()
      this.logger.log('Database backup created successfully')
      return { message: 'Backup created successfully', backupPath }
    } catch (error) {
      this.logger.error(
        'Failed to create database backup',
        (error as Error).stack,
      )
      return {
        error: 'Failed to create backup',
        details: (error as Error).message,
      }
    }
  }

  @Get('list')
  async listBackups() {
    try {
      this.logger.log('Listing database backups')
      const backups = await listBackups()
      this.logger.log(`Found ${backups.length} backups`)
      return { backups }
    } catch (error) {
      this.logger.error('Failed to list backups', (error as Error).stack)
      return {
        error: 'Failed to list backups',
        details: (error as Error).message,
      }
    }
  }

  @Post('restore/:filename')
  @HttpCode(HttpStatus.OK)
  async restoreBackup(@Param('filename') filename: string) {
    try {
      this.logger.log(`Restoring database from backup: ${filename}`)

      // 验证文件名格式
      if (
        !filename.match(/^backup-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}\.sqlite$/)
      ) {
        this.logger.warn(`Invalid backup filename format: ${filename}`)
        return { error: 'Invalid backup filename format' }
      }

      await restoreBackup(filename)
      this.logger.log(`Database restored from ${filename} successfully`)
      return { message: `Database restored from ${filename}` }
    } catch (error) {
      this.logger.error(
        `Failed to restore database backup: ${filename}`,
        (error as Error).stack,
      )
      return {
        error: 'Failed to restore backup',
        details: (error as Error).message,
      }
    }
  }

  @Post('start-auto-save')
  @HttpCode(HttpStatus.OK)
  startAutoSave() {
    try {
      this.logger.log('Starting auto-save')
      const result = startAutoSave()
      this.logger.log('Auto-save started successfully')
      return { message: 'Auto-save started successfully', result }
    } catch (error) {
      this.logger.error('Failed to start auto-save', (error as Error).stack)
      return {
        error: 'Failed to start auto-save',
        details: (error as Error).message,
      }
    }
  }

  @Post('stop-auto-save')
  @HttpCode(HttpStatus.OK)
  stopAutoSave() {
    try {
      this.logger.log('Stopping auto-save')
      const result = stopAutoSave()
      this.logger.log('Auto-save stopped successfully')
      return { message: 'Auto-save stopped successfully', result }
    } catch (error) {
      this.logger.error('Failed to stop auto-save', (error as Error).stack)
      return {
        error: 'Failed to stop auto-save',
        details: (error as Error).message,
      }
    }
  }

  @Get('auto-save-status')
  @HttpCode(HttpStatus.OK)
  getAutoSaveStatus() {
    try {
      const isRunning = isAutoSaveRunning()
      this.logger.log(`Auto-save status: ${isRunning ? 'running' : 'stopped'}`)
      return { isRunning }
    } catch (error) {
      this.logger.error(
        'Failed to get auto-save status',
        (error as Error).stack,
      )
      return {
        error: 'Failed to get auto-save status',
        details: (error as Error).message,
      }
    }
  }
}
