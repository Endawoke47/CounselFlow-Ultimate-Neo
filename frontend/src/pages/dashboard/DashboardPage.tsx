import React from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Building2, 
  FileText, 
  Scale, 
  Briefcase, 
  Shield, 
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/utils/cn'

const stats = [
  { name: 'Total Entities', value: '15', change: '+2.3%', changeType: 'positive', icon: Building2 },
  { name: 'Active Contracts', value: '128', change: '+5.2%', changeType: 'positive', icon: FileText },
  { name: 'Open Disputes', value: '7', change: '-12.5%', changeType: 'negative', icon: Scale },
  { name: 'Active Matters', value: '42', change: '+8.1%', changeType: 'positive', icon: Briefcase },
]

const recentActivities = [
  {
    id: 1,
    type: 'contract',
    title: 'New MSA signed with TechCorp Inc.',
    time: '2 hours ago',
    status: 'completed',
    icon: FileText,
  },
  {
    id: 2,
    type: 'dispute',
    title: 'Dispute #2024-001 requires attention',
    time: '4 hours ago',
    status: 'urgent',
    icon: Scale,
  },
  {
    id: 3,
    type: 'entity',
    title: 'Corporate structure updated for Acme Corp',
    time: '1 day ago',
    status: 'completed',
    icon: Building2,
  },
  {
    id: 4,
    type: 'risk',
    title: 'Risk assessment completed for Project Alpha',
    time: '2 days ago',
    status: 'completed',
    icon: Shield,
  },
]

const upcomingTasks = [
  {
    id: 1,
    title: 'Contract review deadline',
    description: 'Review and approve Service Agreement',
    dueDate: 'Today',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Board meeting preparation',
    description: 'Prepare legal documents for quarterly board meeting',
    dueDate: 'Tomorrow',
    priority: 'medium',
  },
  {
    id: 3,
    title: 'Compliance audit',
    description: 'Quarterly compliance review for subsidiary entities',
    dueDate: 'In 3 days',
    priority: 'low',
  },
]

const riskAlerts = [
  {
    id: 1,
    title: 'Contract expiring soon',
    description: 'MSA with TechCorp expires in 30 days',
    severity: 'medium',
    category: 'Contract',
  },
  {
    id: 2,
    title: 'Regulatory deadline approaching',
    description: 'Annual compliance filing due in 15 days',
    severity: 'high',
    category: 'Compliance',
  },
  {
    id: 3,
    title: 'Dispute escalation risk',
    description: 'Customer complaint may escalate to formal dispute',
    severity: 'medium',
    category: 'Dispute',
  },
]

export const DashboardPage: React.FC = () => {
  const { user } = useAuth()

  return (
    <>
      <Helmet title="Dashboard" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.first_name}!
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Here's what's happening with your legal matters today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span
                    className={cn(
                      'text-sm font-medium',
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {stat.changeType === 'positive' ? (
                      <TrendingUp className="h-4 w-4 inline mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 inline mr-1" />
                    )}
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon
                    return (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={cn(
                          'p-2 rounded-lg',
                          activity.status === 'completed' ? 'bg-green-50' : 'bg-yellow-50'
                        )}>
                          <Icon className={cn(
                            'h-5 w-5',
                            activity.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        <div className="flex-shrink-0">
                          {activity.status === 'completed' ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        )}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{task.dueDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk Alerts */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Risk Alerts</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {riskAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3">
                      <div className={cn(
                        'p-1 rounded-full',
                        alert.severity === 'high' ? 'bg-red-100' : 'bg-yellow-100'
                      )}>
                        <AlertTriangle className={cn(
                          'h-4 w-4',
                          alert.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                        <p className="text-xs text-gray-500">{alert.description}</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                          {alert.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
              <p className="text-sm text-gray-600 mt-1">
                Based on your recent activities, here are some recommendations:
              </p>
              <ul className="mt-3 space-y-1 text-sm text-gray-700">
                <li>• Consider reviewing 3 contracts that expire within 60 days</li>
                <li>• Risk assessment recommended for 2 new matters</li>
                <li>• Compliance deadline approaching for subsidiary entities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}