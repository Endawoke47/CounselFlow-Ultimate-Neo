import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopNav } from '../components/TopNav';
import { dataManager, Matter } from '../data';
import { 
  MattersIcon, 
  PlusIcon, 
  EditIcon, 
  EyeIcon, 
  DownloadIcon,
  FilterIcon,
  SearchIcon,
  ClockIcon,
  UserIcon,
  LocationIcon,
  TrendingUpIcon
} from '../components/icons';

export const MattersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('matters');
  const [matters, setMatters] = useState<Matter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMatter, setSelectedMatter] = useState<Matter | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    practiceArea: '',
    priority: '',
    status: '',
    jurisdiction: ''
  });

  useEffect(() => {
    setMatters(dataManager.getMatters());
  }, []);

  const filteredMatters = matters.filter(matter => {
    const matchesSearch = matter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         matter.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         matter.attorney.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (!filters.practiceArea || matter.practiceArea === filters.practiceArea) &&
      (!filters.priority || matter.priority === filters.priority) &&
      (!filters.status || matter.status === filters.status) &&
      (!filters.jurisdiction || matter.jurisdiction.toLowerCase().includes(filters.jurisdiction.toLowerCase()));

    return matchesSearch && matchesFilters;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const matterStats = {
    total: matters.length,
    active: matters.filter(m => m.status === 'active').length,
    highPriority: matters.filter(m => m.priority === 'high' || m.priority === 'critical').length,
    dueThisWeek: matters.filter(m => {
      const dueDate = new Date(m.dueDate);
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return dueDate <= weekFromNow;
    }).length
  };


  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="ml-56">
        <TopNav />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
              <MattersIcon className="h-8 w-8 text-teal-600 mr-3" />
              Matters Management
            </h1>
            <p className="text-gray-600">Track legal matters, deadlines, and case progress</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-teal-100">
                  <MattersIcon className="h-6 w-6 text-teal-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Matters</p>
                  <p className="text-2xl font-bold text-gray-900">{matterStats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <TrendingUpIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Matters</p>
                  <p className="text-2xl font-bold text-gray-900">{matterStats.active}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-red-100">
                  <TrendingUpIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">High Priority</p>
                  <p className="text-2xl font-bold text-gray-900">{matterStats.highPriority}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-orange-100">
                  <ClockIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Due This Week</p>
                  <p className="text-2xl font-bold text-gray-900">{matterStats.dueThisWeek}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Legal Matters</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Filters
                </button>
                <button className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Matter
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search matters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Practice Area</label>
                  <select
                    value={filters.practiceArea}
                    onChange={(e) => setFilters({ ...filters, practiceArea: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Areas</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Energy">Energy</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Priorities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jurisdiction</label>
                  <select
                    value={filters.jurisdiction}
                    onChange={(e) => setFilters({ ...filters, jurisdiction: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Jurisdictions</option>
                    <option value="south africa">South Africa</option>
                    <option value="nigeria">Nigeria</option>
                    <option value="ghana">Ghana</option>
                    <option value="kenya">Kenya</option>
                  </select>
                </div>
              </div>
            )}

            {/* Matters Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client & Attorney
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMatters.map((matter) => (
                    <tr key={matter.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{matter.title}</div>
                        <div className="text-sm text-gray-500">{matter.matterID}</div>
                        <div className="text-sm text-gray-500">{matter.practiceArea}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm text-gray-900">{matter.client}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <UserIcon className="h-3 w-3 mr-1" />
                              {matter.attorney}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <LocationIcon className="h-3 w-3 mr-1" />
                              {matter.jurisdiction}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(matter.priority)}`}>
                          {matter.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(matter.status)}`}>
                          {matter.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{matter.dueDate}</div>
                        <div className={`text-xs ${isOverdue(matter.dueDate) ? 'text-red-600' : 'text-gray-500'}`}>
                          {isOverdue(matter.dueDate) ? 
                            `${Math.abs(getDaysUntilDue(matter.dueDate))} days overdue` :
                            `${getDaysUntilDue(matter.dueDate)} days remaining`
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedMatter(matter)}
                            className="text-teal-600 hover:text-teal-900"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900">
                            <EditIcon className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <DownloadIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Matter Details Modal */}
          {selectedMatter && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Matter Details</h3>
                    <button
                      onClick={() => setSelectedMatter(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Matter Information</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Title</label>
                          <p className="text-sm text-gray-900">{selectedMatter.title}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Matter ID</label>
                          <p className="text-sm text-gray-900">{selectedMatter.matterID}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Practice Area</label>
                          <p className="text-sm text-gray-900">{selectedMatter.practiceArea}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Industry</label>
                          <p className="text-sm text-gray-900">{selectedMatter.industry}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Jurisdiction</label>
                          <p className="text-sm text-gray-900">{selectedMatter.jurisdiction}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Legal Team</label>
                          <p className="text-sm text-gray-900">{selectedMatter.legalTeam}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Case Details</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Client</label>
                          <p className="text-sm text-gray-900">{selectedMatter.client}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Attorney</label>
                          <p className="text-sm text-gray-900">{selectedMatter.attorney}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Priority</label>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedMatter.priority)}`}>
                            {selectedMatter.priority}
                          </span>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Status</label>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedMatter.status)}`}>
                            {selectedMatter.status}
                          </span>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Due Date</label>
                          <p className="text-sm text-gray-900">{selectedMatter.dueDate}</p>
                        </div>
                        {selectedMatter.description && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <p className="text-sm text-gray-900">{selectedMatter.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Linked Items</h4>
                    <div className="space-y-2">
                      {selectedMatter.linkedContractID && (
                        <div className="flex items-center p-3 bg-teal-50 rounded-lg">
                          <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                          <span className="text-sm text-teal-800">
                            Contract: {selectedMatter.linkedContractID}
                          </span>
                        </div>
                      )}
                      {selectedMatter.linkedDisputeID && (
                        <div className="flex items-center p-3 bg-red-50 rounded-lg">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                          <span className="text-sm text-red-800">
                            Dispute: {selectedMatter.linkedDisputeID}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};