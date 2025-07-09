import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Building2, 
  FileText, 
  Scale, 
  Briefcase, 
  Shield, 
  FileCheck, 
  BookOpen, 
  Certificate, 
  DollarSign, 
  CheckSquare, 
  Bot, 
  BarChart3, 
  Home, 
  X 
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Entity Management', href: '/entities', icon: Building2 },
  { name: 'Contract Management', href: '/contracts', icon: FileText },
  { name: 'Dispute Management', href: '/disputes', icon: Scale },
  { name: 'Matter Management', href: '/matters', icon: Briefcase },
  { name: 'Risk Management', href: '/risk', icon: Shield },
  { name: 'Policy Management', href: '/policy', icon: FileCheck },
  { name: 'Knowledge Management', href: '/knowledge', icon: BookOpen },
  { name: 'Licensing & Regulatory', href: '/licensing', icon: Certificate },
  { name: 'Outsourcing & Legal Spend', href: '/outsourcing', icon: DollarSign },
  { name: 'Task Management', href: '/tasks', icon: CheckSquare },
  { name: 'AI Assistant', href: '/ai-assistant', icon: Bot },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
]

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation()

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-lg">
          <div className="flex h-16 shrink-0 items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">CounselFlow</h1>
                <p className="text-xs text-gray-500">Ultimate Neo</p>
              </div>
            </Link>
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.href
                    
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={cn(
                            isActive
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                            'group flex gap-x-3 rounded-l-md p-2 text-sm leading-6 font-medium'
                          )}
                        >
                          <Icon
                            className={cn(
                              isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500',
                              'h-5 w-5 shrink-0'
                            )}
                          />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
              
              <li className="mt-auto">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">AI Assistant</p>
                      <p className="text-xs text-gray-500">Always here to help</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={cn(
        'relative z-50 lg:hidden',
        isOpen ? 'fixed inset-0' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-gray-900/80" />
        
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">CounselFlow</h1>
                <p className="text-xs text-gray-500">Ultimate Neo</p>
              </div>
            </Link>
            
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="mt-6">
            <ul role="list" className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className={cn(
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium'
                      )}
                    >
                      <Icon
                        className={cn(
                          isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500',
                          'h-5 w-5 shrink-0'
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}