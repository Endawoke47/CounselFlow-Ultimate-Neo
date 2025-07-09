import React, { useState, useEffect } from 'react';
import { legalDatabaseService, SearchQuery, SearchResult, LegalDocument } from '../../services/legalDatabaseService';
import { 
  SearchIcon, 
  AIIcon, 
  FilterIcon, 
  DownloadIcon, 
  EyeIcon, 
  LoadingIcon,
  DatabaseIcon,
  CalendarIcon,
  LocationIcon,
  FileIcon
} from '../icons';

interface AILegalSearchProps {
  onDocumentSelect?: (document: LegalDocument) => void;
}

export const AILegalSearch: React.FC<AILegalSearchProps> = ({ onDocumentSelect }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Partial<SearchQuery>>({});
  const [jurisdictions, setJurisdictions] = useState<string[]>([]);
  const [courts, setCourts] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [databases] = useState(legalDatabaseService.getDatabases());

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    const [jurisdictionsData, courtsData, categoriesData] = await Promise.all([
      legalDatabaseService.getJurisdictions(),
      legalDatabaseService.getCourts(),
      legalDatabaseService.getCategories()
    ]);
    
    setJurisdictions(jurisdictionsData);
    setCourts(courtsData);
    setCategories(categoriesData);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const searchQuery: SearchQuery = {
        query: query.trim(),
        ...filters,
        limit: 50
      };

      const results = await legalDatabaseService.search(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentClick = async (document: LegalDocument) => {
    setSelectedDocument(document);
    if (onDocumentSelect) {
      onDocumentSelect(document);
    }
  };

  const handleDownload = async (doc: LegalDocument, format: 'pdf' | 'doc' | 'txt') => {
    try {
      const blob = await legalDatabaseService.downloadDocument(doc, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.title.replace(/[^a-z0-9]/gi, '_')}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const quickSearches = [
    'constitutional law South Africa',
    'criminal law Kenya',
    'land rights Nigeria',
    'mining law Ghana',
    'human rights Africa',
    'contract law Botswana',
    'environmental law',
    'corporate governance'
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
            <AIIcon className="h-5 w-5 text-white" />
          </div>
          <div className="ml-3">
            <h2 className="text-xl font-semibold text-gray-900">AI Legal Search</h2>
            <p className="text-sm text-gray-500">Search across African legal databases with AI assistance</p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search legal cases, legislation, or enter a legal question..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              disabled={isLoading}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FilterIcon className="h-5 w-5 text-gray-600" />
          </button>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <LoadingIcon className="h-5 w-5" />
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jurisdiction</label>
              <select
                value={filters.jurisdiction || ''}
                onChange={(e) => setFilters({ ...filters, jurisdiction: e.target.value || undefined })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">All Jurisdictions</option>
                {jurisdictions.map(jurisdiction => (
                  <option key={jurisdiction} value={jurisdiction}>{jurisdiction}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Court</label>
              <select
                value={filters.court || ''}
                onChange={(e) => setFilters({ ...filters, court: e.target.value || undefined })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">All Courts</option>
                {courts.map(court => (
                  <option key={court} value={court}>{court}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category || ''}
                onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value || undefined })}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value || undefined })}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Searches */}
      {!searchResults && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Searches:</h3>
          <div className="flex flex-wrap gap-2">
            {quickSearches.map((quickSearch, index) => (
              <button
                key={index}
                onClick={() => setQuery(quickSearch)}
                className="px-3 py-1 text-sm bg-teal-50 text-teal-700 rounded-full hover:bg-teal-100 transition-colors"
              >
                {quickSearch}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Database Sources */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Available Databases:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {databases.filter(db => db.isActive).map(database => (
            <div key={database.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <DatabaseIcon className="h-5 w-5 text-teal-600 mr-2" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{database.name}</p>
                <p className="text-xs text-gray-500">{database.jurisdiction.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Search Results ({searchResults.totalCount} documents)
            </h3>
            <p className="text-sm text-gray-500">
              Search completed in {searchResults.searchTime}ms
            </p>
          </div>

          {searchResults.suggestions && searchResults.suggestions.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">Did you mean:</p>
              <div className="flex flex-wrap gap-2">
                {searchResults.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(suggestion)}
                    className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {searchResults.documents.map((document) => (
              <div key={document.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 mb-1">{document.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{document.citation}</p>
                    <p className="text-sm text-gray-700 mb-3">{document.summary}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {document.categories.map((category, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-teal-100 text-teal-800 rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <LocationIcon className="h-4 w-4 mr-1" />
                        {document.jurisdiction}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(document.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <DatabaseIcon className="h-4 w-4 mr-1" />
                        {document.source}
                      </div>
                      {document.relevanceScore && (
                        <div className="flex items-center">
                          <span className="text-teal-600 font-medium">
                            {document.relevanceScore}% relevant
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => handleDocumentClick(document)}
                      className="flex items-center px-3 py-1 text-sm text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleDownload(document, 'pdf')}
                        className="flex items-center px-2 py-1 text-xs text-gray-600 hover:text-gray-700 transition-colors"
                        title="Download as PDF"
                      >
                        <DownloadIcon className="h-3 w-3 mr-1" />
                        PDF
                      </button>
                      <button
                        onClick={() => handleDownload(document, 'doc')}
                        className="flex items-center px-2 py-1 text-xs text-gray-600 hover:text-gray-700 transition-colors"
                        title="Download as Word Document"
                      >
                        <FileIcon className="h-3 w-3 mr-1" />
                        DOC
                      </button>
                      <button
                        onClick={() => handleDownload(document, 'txt')}
                        className="flex items-center px-2 py-1 text-xs text-gray-600 hover:text-gray-700 transition-colors"
                        title="Download as Text"
                      >
                        <FileIcon className="h-3 w-3 mr-1" />
                        TXT
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Document Preview</h3>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedDocument.title}</h4>
              <p className="text-gray-600 mb-4">{selectedDocument.citation}</p>
              <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Court:</p>
                  <p className="text-sm text-gray-600">{selectedDocument.court}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Date:</p>
                  <p className="text-sm text-gray-600">{new Date(selectedDocument.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Jurisdiction:</p>
                  <p className="text-sm text-gray-600">{selectedDocument.jurisdiction}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Source:</p>
                  <p className="text-sm text-gray-600">{selectedDocument.source}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Summary:</p>
                <p className="text-gray-700">{selectedDocument.summary}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Categories:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedDocument.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-teal-100 text-teal-800 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Keywords:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedDocument.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <a
                  href={selectedDocument.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  View Original
                </a>
                <button
                  onClick={() => handleDownload(selectedDocument, 'pdf')}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AILegalSearch;