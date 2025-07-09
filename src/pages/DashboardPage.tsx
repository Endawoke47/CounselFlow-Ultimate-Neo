import React, { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { TopNav } from '../components/TopNav'
import { Calendar } from '../components/Calendar'
import { Timeline } from '../components/Timeline'
import { AIAssistant } from '../components/AIAssistant'
import { 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const stats = [
    {
      title: 'Contracts This Month',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50'
    },
    {
      title: 'Compliance Issues',
      value: '6',
      change: '-8%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Active Matters',
      value: '18',
      change: '+3%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Legal Spend',
      value: '$127K',
      change: '+5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    }
  ]

  const recentMatters = [
    {
      id: '1',
      title: 'Patent Filing - AI System',
      client: 'TechCorp Inc.',
      attorney: 'Sarah Johnson',
      status: 'active',
      priority: 'high',
      dueDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Employment Contract Review',
      client: 'StartupCo',
      attorney: 'Mike Chen',
      status: 'pending',
      priority: 'medium',
      dueDate: '2024-01-18'
    },
    {
      id: '3',
      title: 'Compliance Audit',
      client: 'GlobalTech',
      attorney: 'Lisa Park',
      status: 'completed',
      priority: 'low',
      dueDate: '2024-01-10'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="ml-56">
        <TopNav />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Legal Operations Dashboard</h1>
            <p className="text-gray-600">Monitor your legal matters, compliance status, and team performance</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <span className={`ml-2 text-sm font-medium ${
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - AI Assistant */}
            <div className="lg:col-span-1">
              <AIAssistant />
            </div>

            {/* Middle Column - Recent Matters */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Matters</h3>
                  <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                    View all
                  </button>
                </div>
                
                <div className="space-y-4">
                  {recentMatters.map((matter) => (
                    <div key={matter.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">{matter.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(matter.priority)}`}>
                            {matter.priority}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(matter.status)}`}>
                            {matter.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{matter.client}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Attorney: {matter.attorney}</span>
                        <span className="text-gray-500">Due: {matter.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Calendar */}
            <div className="lg:col-span-1">
              <Calendar />
            </div>
          </div>

          {/* Bottom Row - Timeline */}
          <div className="mt-6">
            <Timeline />
          </div>
        </main>
      </div>
    </div>
  )
}