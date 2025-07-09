import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopNav } from '../components/TopNav';
import { AILegalSearch } from '../components/knowledge/AILegalSearch';
import { dataManager, Knowledge, LegalDocument } from '../data';
import { 
  KnowledgeIcon, 
  PlusIcon, 
  EditIcon, 
  EyeIcon, 
  DownloadIcon,
  FilterIcon,
  SearchIcon,
  AIIcon,
  DatabaseIcon,
  FileIcon,
  BookIcon
} from '../components/icons';

export const KnowledgePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('knowledge');
  const [activeSubTab, setActiveSubTab] = useState('library');
  const [knowledge, setKnowledge] = useState<Knowledge[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKnowledge, setSelectedKnowledge] = useState<Knowledge | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    jurisdiction: '',
    sourceModule: ''
  });

  useEffect(() => {
    setKnowledge(dataManager.getKnowledge());
  }, []);

  const filteredKnowledge = knowledge.filter(item => {
    const matchesSearch = item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilters = 
      (!filters.type || item.type === filters.type) &&
      (!filters.jurisdiction || item.jurisdiction === filters.jurisdiction) &&
      (!filters.sourceModule || item.sourceModule === filters.sourceModule);

    return matchesSearch && matchesFilters;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Clause': return 'bg-blue-100 text-blue-800';
      case 'Template': return 'bg-green-100 text-green-800';
      case 'Playbook': return 'bg-purple-100 text-purple-800';
      case 'Precedent': return 'bg-orange-100 text-orange-800';
      case 'Regulation': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const knowledgeStats = {
    total: knowledge.length,
    clauses: knowledge.filter(k => k.type === 'Clause').length,
    templates: knowledge.filter(k => k.type === 'Template').length,
    playbooks: knowledge.filter(k => k.type === 'Playbook').length
  };

  const handleDocumentSelect = (document: LegalDocument) => {
    // Handle document selection from AI search
    console.log('Selected document:', document);
  };

  const subTabs = [
    { id: 'library', name: 'Knowledge Library', icon: KnowledgeIcon },
    { id: 'search', name: 'AI Legal Search', icon: AIIcon },
    { id: 'databases', name: 'Legal Databases', icon: DatabaseIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="ml-56">
        <TopNav />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
              <KnowledgeIcon className="h-8 w-8 text-teal-600 mr-3" />
              Knowledge Management
            </h1>
            <p className="text-gray-600">Access legal knowledge, search databases, and manage resources</p>
          </div>

          {/* Sub-navigation */}
          <div className="mb-6">
            <nav className="flex space-x-8">
              {subTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id)}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeSubTab === tab.id
                        ? 'bg-teal-100 text-teal-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Knowledge Library Tab */}
          {activeSubTab === 'library' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-teal-100">
                      <BookIcon className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Items</p>
                      <p className="text-2xl font-bold text-gray-900">{knowledgeStats.total}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-blue-100">
                      <FileIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Clauses</p>
                      <p className="text-2xl font-bold text-gray-900">{knowledgeStats.clauses}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-green-100">
                      <FileIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Templates</p>
                      <p className="text-2xl font-bold text-gray-900">{knowledgeStats.templates}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-purple-100">
                      <FileIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Playbooks</p>
                      <p className="text-2xl font-bold text-gray-900">{knowledgeStats.playbooks}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Knowledge Library</h2>
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
                      Add Item
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
                      placeholder="Search knowledge items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">All Types</option>
                        <option value="Clause">Clause</option>
                        <option value="Template">Template</option>
                        <option value="Playbook">Playbook</option>
                        <option value="Precedent">Precedent</option>
                        <option value="Regulation">Regulation</option>
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
                        <option value="South Africa">South Africa</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Kenya">Kenya</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Source Module</label>
                      <select
                        value={filters.sourceModule}
                        onChange={(e) => setFilters({ ...filters, sourceModule: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">All Sources</option>
                        <option value="Contracts">Contracts</option>
                        <option value="Disputes">Disputes</option>
                        <option value="Policy">Policy</option>
                        <option value="Matters">Matters</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Knowledge Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredKnowledge.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(item.type)}`}>
                          {item.type}
                        </span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => setSelectedKnowledge(item)}
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
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">{item.subject}</h3>
                      <p className="text-xs text-gray-600 mb-3">{item.jurisdiction}</p>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* AI Legal Search Tab */}
          {activeSubTab === 'search' && (
            <AILegalSearch onDocumentSelect={handleDocumentSelect} />
          )}

          {/* Legal Databases Tab */}
          {activeSubTab === 'databases' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Legal Databases</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    name: 'African Legal Information Institute',
                    url: 'https://africanlii.org/',
                    description: 'Pan-African legal database with cases from multiple African jurisdictions',
                    jurisdictions: ['Africa', 'Multi-jurisdictional']
                  },
                  {
                    name: 'Southern African Legal Information Institute',
                    url: 'https://www.saflii.org/',
                    description: 'Legal information from Southern African countries',
                    jurisdictions: ['South Africa', 'Botswana', 'Lesotho', 'Namibia']
                  },
                  {
                    name: 'Kenya Law Reports',
                    url: 'https://kenyalaw.org/caselaw/',
                    description: 'Comprehensive database of Kenyan legal cases and legislation',
                    jurisdictions: ['Kenya']
                  },
                  {
                    name: 'Kenya Supreme Court Library',
                    url: 'https://supremecourt.judiciary.go.ke/the-supreme-court-library/',
                    description: 'Official Kenya Supreme Court case database',
                    jurisdictions: ['Kenya']
                  },
                  {
                    name: 'World Legal Information Institute',
                    url: 'https://www.worldlii.org/',
                    description: 'Global legal database including African jurisdictions',
                    jurisdictions: ['Global', 'Africa']
                  },
                  {
                    name: 'Land Portal Foundation',
                    url: 'https://landportal.org/library-all',
                    description: 'Land and property law resources for Africa',
                    jurisdictions: ['Africa', 'Land Law']
                  }
                ].map((database, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900">{database.name}</h3>
                      <DatabaseIcon className="h-5 w-5 text-teal-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{database.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {database.jurisdictions.map((jurisdiction, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-teal-100 text-teal-800 rounded">
                          {jurisdiction}
                        </span>
                      ))}
                    </div>
                    <a
                      href={database.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-teal-600 hover:text-teal-700"
                    >
                      Visit Database →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Knowledge Details Modal */}
          {selectedKnowledge && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Knowledge Item Details</h3>
                    <button
                      onClick={() => setSelectedKnowledge(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Type</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${getTypeColor(selectedKnowledge.type)}`}>
                        {selectedKnowledge.type}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Subject</label>
                      <p className="text-sm text-gray-900">{selectedKnowledge.subject}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Jurisdiction</label>
                      <p className="text-sm text-gray-900">{selectedKnowledge.jurisdiction}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Source Module</label>
                      <p className="text-sm text-gray-900">{selectedKnowledge.sourceModule}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Tags</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedKnowledge.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {selectedKnowledge.content && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Content</label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-900">{selectedKnowledge.content}</p>
                        </div>
                      </div>
                    )}
                    {selectedKnowledge.documentPath && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Document Path</label>
                        <p className="text-sm text-gray-900">{selectedKnowledge.documentPath}</p>
                      </div>
                    )}
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