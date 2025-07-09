import React from 'react'
import { useLocation } from 'react-router-dom'
import { 
  Home, 
  Briefcase, 
  FileText, 
  Scale, 
  Users, 
  Shield, 
  CreditCard, 
  BarChart3, 
  Settings,
  Building2,
  CheckSquare,
  BookOpen,
  Target,
  DollarSign,
  AlertTriangle
} from 'lucide-react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const sidebarItems = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'matters', name: 'Matters', icon: Briefcase },
  { id: 'clm', name: 'CLM', icon: FileText },
  { id: 'disputes', name: 'Disputes', icon: Scale },
  { id: 'intake', name: 'Intake', icon: Users },
  { id: 'entities', name: 'Entities', icon: Building2 },
  { id: 'tasks', name: 'Tasks', icon: CheckSquare },
  { id: 'knowledge', name: 'Knowledge', icon: BookOpen },
  { id: 'risk', name: 'Risk', icon: AlertTriangle },
  { id: 'outsourcing', name: 'Outsourcing', icon: Target },
  { id: 'billing', name: 'Billing', icon: CreditCard },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'settings', name: 'Settings', icon: Settings },
]

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed inset-y-0 left-0 z-50 w-56 bg-teal-600 shadow-lg">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 bg-teal-700 border-b border-teal-500">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-white mr-3">CF</div>
            <div className="text-white">
              <div className="text-lg font-semibold">CounselFlow</div>
              <div className="text-xs opacity-75">Legal Platform</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-teal-100 hover:bg-teal-700 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-teal-300'}`} />
                {item.name}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-teal-500">
          <div className="text-xs text-teal-100 text-center">
            © 2024 CounselFlow
          </div>
        </div>
      </div>
    </div>
  )
}