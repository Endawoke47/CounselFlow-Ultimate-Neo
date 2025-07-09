import React from 'react'
import { Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react'

interface TimelineItem {
  id: string
  title: string
  description: string
  time: string
  type: 'completed' | 'pending' | 'urgent'
  icon: React.ReactNode
}

interface TimelineProps {
  className?: string
}

export const Timeline: React.FC<TimelineProps> = ({ className }) => {
  const timelineItems: TimelineItem[] = [
    {
      id: '1',
      title: 'Draft Patent Filing',
      description: 'Patent application for AI-based legal analysis system',
      time: '2 hours ago',
      type: 'pending',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: '2',
      title: 'NDA Executed',
      description: 'Non-disclosure agreement signed with TechCorp Inc.',
      time: '5 hours ago',
      type: 'completed',
      icon: <CheckCircle className="h-4 w-4" />
    },
    {
      id: '3',
      title: 'Compliance Review Due',
      description: 'Quarterly compliance audit for GDPR requirements',
      time: '1 day ago',
      type: 'urgent',
      icon: <AlertCircle className="h-4 w-4" />
    },
    {
      id: '4',
      title: 'Contract Amendment',
      description: 'Software licensing agreement updated with new terms',
      time: '2 days ago',
      type: 'completed',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: '5',
      title: 'Risk Assessment',
      description: 'Evaluated potential legal risks for new product launch',
      time: '3 days ago',
      type: 'completed',
      icon: <CheckCircle className="h-4 w-4" />
    }
  ]

  const getItemStyles = (type: string) => {
    switch (type) {
      case 'completed':
        return {
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          lineColor: 'bg-green-200'
        }
      case 'urgent':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          lineColor: 'bg-red-200'
        }
      default:
        return {
          iconBg: 'bg-teal-100',
          iconColor: 'text-teal-600',
          lineColor: 'bg-teal-200'
        }
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <Clock className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {timelineItems.map((item, index) => {
          const styles = getItemStyles(item.type)
          const isLast = index === timelineItems.length - 1
          
          return (
            <div key={item.id} className="relative">
              <div className="flex items-start">
                <div className={`flex-shrink-0 w-8 h-8 ${styles.iconBg} rounded-full flex items-center justify-center ${styles.iconColor}`}>
                  {item.icon}
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
              
              {!isLast && (
                <div className={`absolute left-4 top-8 w-0.5 h-6 ${styles.lineColor} -ml-px`} />
              )}
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-sm text-teal-600 hover:text-teal-700 font-medium">
          View all activity
        </button>
      </div>
    </div>
  )
}