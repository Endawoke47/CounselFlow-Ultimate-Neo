import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopNav } from '../components/TopNav';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsEngine';
import { dataManager, Contract } from '../data';
import { 
  ContractIcon, 
  PlusIcon, 
  EditIcon, 
  EyeIcon, 
  DownloadIcon,
  FilterIcon,
  SearchIcon,
  TrendingUpIcon,
  RiskIcon,
  DollarIcon,
  CalendarIcon
} from '../components/icons';

export const ContractsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('clm');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    practiceArea: '',
    status: '',
    riskFlag: '',
    country: ''
  });

  useEffect(() => {
    setContracts(dataManager.getContracts());
  }, []);

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.contractName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.counterparty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (!filters.practiceArea || contract.practiceArea === filters.practiceArea) &&
      (!filters.status || contract.status === filters.status) &&
      (!filters.riskFlag || (filters.riskFlag === 'true' ? contract.riskFlag : !contract.riskFlag)) &&
      (!filters.country || contract.governingLaw.toLowerCase().includes(filters.country.toLowerCase()));

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

  const contractStats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    totalValue: contracts.reduce((sum, c) => sum + c.contractValue_USD, 0),
    highRisk: contracts.filter(c => c.riskFlag).length
  };

  const getLinkedItems = (contract: Contract) => {
    const linked = dataManager.getLinkedItems('Contract', contract.contractId);
    return linked;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'NGN' ? 'NGN' : currency === 'ZAR' ? 'ZAR' : 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="ml-56">
        <TopNav />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
              <ContractIcon className="h-8 w-8 text-teal-600 mr-3" />
              Contract Lifecycle Management
            </h1>
            <p className="text-gray-600">Manage contracts, track compliance, and monitor performance</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-teal-100">
                  <ContractIcon className="h-6 w-6 text-teal-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Contracts</p>
                  <p className="text-2xl font-bold text-gray-900">{contractStats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <TrendingUpIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Contracts</p>
                  <p className="text-2xl font-bold text-gray-900">{contractStats.active}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <DollarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(contractStats.totalValue / 1000000).toFixed(0)}M
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-red-100">
                  <RiskIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">High Risk</p>
                  <p className="text-2xl font-bold text-gray-900">{contractStats.highRisk}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Dashboard */}
          <div className="mb-6">
            <AnalyticsDashboard />
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Contracts</h2>
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
                  Add Contract
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
                  placeholder="Search contracts..."
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Risk Flag</label>
                  <select
                    value={filters.riskFlag}
                    onChange={(e) => setFilters({ ...filters, riskFlag: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Contracts</option>
                    <option value="true">High Risk</option>
                    <option value="false">Low Risk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <select
                    value={filters.country}
                    onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">All Countries</option>
                    <option value="south africa">South Africa</option>
                    <option value="nigeria">Nigeria</option>
                    <option value="ghana">Ghana</option>
                    <option value="kenya">Kenya</option>
                  </select>
                </div>
              </div>
            )}

            {/* Contracts Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contract
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parties
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{contract.contractName}</div>
                        <div className="text-sm text-gray-500">{contract.contractId}</div>
                        <div className="text-sm text-gray-500">{contract.practiceArea}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{contract.client}</div>
                        <div className="text-sm text-gray-500">vs {contract.counterparty}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(contract.contractValue_USD, 'USD')}
                        </div>
                        {contract.contractValue_NGN > 0 && (
                          <div className="text-sm text-gray-500">
                            {formatCurrency(contract.contractValue_NGN, 'NGN')}
                          </div>
                        )}
                        {contract.contractValue_ZAR > 0 && (
                          <div className="text-sm text-gray-500">
                            {formatCurrency(contract.contractValue_ZAR, 'ZAR')}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {contract.riskFlag && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            High Risk
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedContract(contract)}
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

          {/* Contract Details Modal */}
          {selectedContract && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Contract Details</h3>
                    <button
                      onClick={() => setSelectedContract(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Contract Information</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Contract Name</label>
                          <p className="text-sm text-gray-900">{selectedContract.contractName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Contract ID</label>
                          <p className="text-sm text-gray-900">{selectedContract.contractId}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Practice Area</label>
                          <p className="text-sm text-gray-900">{selectedContract.practiceArea}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Industry</label>
                          <p className="text-sm text-gray-900">{selectedContract.industry}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Effective Date</label>
                          <p className="text-sm text-gray-900">{selectedContract.effectiveDate}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Governing Law</label>
                          <p className="text-sm text-gray-900">{selectedContract.governingLaw}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Parties & Value</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Client</label>
                          <p className="text-sm text-gray-900">{selectedContract.client}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Counterparty</label>
                          <p className="text-sm text-gray-900">{selectedContract.counterparty}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Contract Value (USD)</label>
                          <p className="text-sm text-gray-900">{formatCurrency(selectedContract.contractValue_USD, 'USD')}</p>
                        </div>
                        {selectedContract.contractValue_NGN > 0 && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">Contract Value (NGN)</label>
                            <p className="text-sm text-gray-900">{formatCurrency(selectedContract.contractValue_NGN, 'NGN')}</p>
                          </div>
                        )}
                        {selectedContract.contractValue_ZAR > 0 && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">Contract Value (ZAR)</label>
                            <p className="text-sm text-gray-900">{formatCurrency(selectedContract.contractValue_ZAR, 'ZAR')}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Linked Items</h4>
                    <div className="space-y-2">
                      {selectedContract.linkedMatterID && (
                        <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-sm text-blue-800">
                            Matter: {selectedContract.linkedMatterID}
                          </span>
                        </div>
                      )}
                      {selectedContract.linkedDisputeID && (
                        <div className="flex items-center p-3 bg-red-50 rounded-lg">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                          <span className="text-sm text-red-800">
                            Dispute: {selectedContract.linkedDisputeID}
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