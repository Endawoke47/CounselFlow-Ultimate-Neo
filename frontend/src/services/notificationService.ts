import { apiClient } from './apiClient'
import { NotificationData } from '@/types/common'

export interface NotificationSubscription {
  id: string
  module: string
  event: string
  callback: (data: any) => void
}

export interface ModuleLinkage {
  sourceModule: string
  targetModule: string
  sourceId: string
  targetId: string
  linkType: 'reference' | 'dependency' | 'relationship'
  metadata?: Record<string, any>
}

class NotificationService {
  private subscriptions: NotificationSubscription[] = []
  private eventSource: EventSource | null = null
  private linkages: ModuleLinkage[] = []

  // Initialize real-time notifications
  initializeRealTimeNotifications(): void {
    if (this.eventSource) {
      this.eventSource.close()
    }

    const token = localStorage.getItem('access_token')
    if (!token) return

    this.eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/notifications/stream?token=${token}`
    )

    this.eventSource.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data)
        this.handleNotification(notification)
      } catch (error) {
        console.error('Error parsing notification:', error)
      }
    }

    this.eventSource.onerror = (error) => {
      console.error('EventSource error:', error)
      // Reconnect after 5 seconds
      setTimeout(() => this.initializeRealTimeNotifications(), 5000)
    }
  }

  // Subscribe to module events
  subscribe(module: string, event: string, callback: (data: any) => void): string {
    const subscription: NotificationSubscription = {
      id: this.generateId(),
      module,
      event,
      callback
    }

    this.subscriptions.push(subscription)
    return subscription.id
  }

  // Unsubscribe from events
  unsubscribe(subscriptionId: string): void {
    this.subscriptions = this.subscriptions.filter(s => s.id !== subscriptionId)
  }

  // Publish event to other modules
  async publishEvent(module: string, event: string, data: any): Promise<void> {
    try {
      await apiClient.post('/notifications/publish', {
        module,
        event,
        data,
        timestamp: new Date().toISOString()
      })

      // Also notify local subscribers
      this.notifySubscribers(module, event, data)
    } catch (error) {
      console.error('Error publishing event:', error)
    }
  }

  // Get notifications for current user
  async getNotifications(): Promise<NotificationData[]> {
    try {
      const response = await apiClient.get('/notifications')
      return response.data || []
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return []
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await apiClient.patch(`/notifications/${notificationId}/read`)
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.patch('/notifications/read-all')
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  // Create inter-module linkage
  async createLinkage(linkage: Omit<ModuleLinkage, 'id'>): Promise<ModuleLinkage> {
    try {
      const response = await apiClient.post('/linkages', linkage)
      const newLinkage = response.data
      this.linkages.push(newLinkage)
      
      // Notify relevant modules
      await this.publishEvent(linkage.sourceModule, 'linkage_created', newLinkage)
      await this.publishEvent(linkage.targetModule, 'linkage_created', newLinkage)
      
      return newLinkage
    } catch (error) {
      console.error('Error creating linkage:', error)
      throw error
    }
  }

  // Get linkages for a module
  async getLinkages(module: string, entityId?: string): Promise<ModuleLinkage[]> {
    try {
      const params = entityId ? { module, entity_id: entityId } : { module }
      const response = await apiClient.get('/linkages', { params })
      return response.data || []
    } catch (error) {
      console.error('Error fetching linkages:', error)
      return []
    }
  }

  // Remove linkage
  async removeLinkage(linkageId: string): Promise<void> {
    try {
      await apiClient.delete(`/linkages/${linkageId}`)
      this.linkages = this.linkages.filter(l => l.id !== linkageId)
    } catch (error) {
      console.error('Error removing linkage:', error)
      throw error
    }
  }

  // Create cross-module references
  async createReference(
    sourceModule: string,
    sourceId: string,
    targetModule: string,
    targetId: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.createLinkage({
      sourceModule,
      sourceId,
      targetModule,
      targetId,
      linkType: 'reference',
      metadata
    })
  }

  // Entity lifecycle events
  async notifyEntityCreated(module: string, entityId: string, entityData: any): Promise<void> {
    await this.publishEvent(module, 'entity_created', {
      entityId,
      entityData,
      timestamp: new Date().toISOString()
    })
  }

  async notifyEntityUpdated(module: string, entityId: string, changes: any): Promise<void> {
    await this.publishEvent(module, 'entity_updated', {
      entityId,
      changes,
      timestamp: new Date().toISOString()
    })
  }

  async notifyEntityDeleted(module: string, entityId: string): Promise<void> {
    await this.publishEvent(module, 'entity_deleted', {
      entityId,
      timestamp: new Date().toISOString()
    })
  }

  // Risk assessment notifications
  async notifyRiskAssessment(
    entityModule: string,
    entityId: string,
    riskLevel: 'low' | 'medium' | 'high' | 'critical',
    details: any
  ): Promise<void> {
    await this.publishEvent('risk_management', 'risk_assessment_required', {
      entityModule,
      entityId,
      riskLevel,
      details,
      timestamp: new Date().toISOString()
    })
  }

  // Compliance notifications
  async notifyComplianceEvent(
    entityModule: string,
    entityId: string,
    eventType: 'deadline' | 'violation' | 'review_required',
    details: any
  ): Promise<void> {
    await this.publishEvent('policy_management', 'compliance_event', {
      entityModule,
      entityId,
      eventType,
      details,
      timestamp: new Date().toISOString()
    })
  }

  // Document-related notifications
  async notifyDocumentEvent(
    entityModule: string,
    entityId: string,
    eventType: 'uploaded' | 'reviewed' | 'expired',
    documentId: string,
    details: any
  ): Promise<void> {
    await this.publishEvent('knowledge_management', 'document_event', {
      entityModule,
      entityId,
      eventType,
      documentId,
      details,
      timestamp: new Date().toISOString()
    })
  }

  // Task-related notifications
  async notifyTaskEvent(
    entityModule: string,
    entityId: string,
    eventType: 'created' | 'assigned' | 'completed' | 'overdue',
    taskId: string,
    details: any
  ): Promise<void> {
    await this.publishEvent('task_management', 'task_event', {
      entityModule,
      entityId,
      eventType,
      taskId,
      details,
      timestamp: new Date().toISOString()
    })
  }

  // Contract-related notifications
  async notifyContractEvent(
    entityId: string,
    eventType: 'created' | 'signed' | 'expired' | 'renewed',
    contractId: string,
    details: any
  ): Promise<void> {
    await this.publishEvent('contract_management', 'contract_event', {
      entityId,
      eventType,
      contractId,
      details,
      timestamp: new Date().toISOString()
    })
  }

  // Dispute-related notifications
  async notifyDisputeEvent(
    entityId: string,
    eventType: 'created' | 'escalated' | 'resolved',
    disputeId: string,
    details: any
  ): Promise<void> {
    await this.publishEvent('dispute_management', 'dispute_event', {
      entityId,
      eventType,
      disputeId,
      details,
      timestamp: new Date().toISOString()
    })
  }

  // Private methods
  private handleNotification(notification: NotificationData): void {
    // Handle different notification types
    switch (notification.type) {
      case 'info':
        console.info('Notification:', notification.message)
        break
      case 'warning':
        console.warn('Warning:', notification.message)
        break
      case 'error':
        console.error('Error:', notification.message)
        break
      case 'success':
        console.log('Success:', notification.message)
        break
    }

    // Notify subscribers
    this.notifySubscribers('notifications', notification.type, notification)
  }

  private notifySubscribers(module: string, event: string, data: any): void {
    this.subscriptions
      .filter(s => s.module === module && s.event === event)
      .forEach(s => {
        try {
          s.callback(data)
        } catch (error) {
          console.error('Error in notification callback:', error)
        }
      })
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  // Cleanup
  cleanup(): void {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
    this.subscriptions = []
  }
}

export const notificationService = new NotificationService()

// Initialize on app start
if (typeof window !== 'undefined') {
  notificationService.initializeRealTimeNotifications()
}