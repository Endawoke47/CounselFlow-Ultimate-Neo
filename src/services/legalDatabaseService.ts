// African Legal Database Integration Service
// This service handles integration with multiple African legal databases

export interface LegalDocument {
  id: string;
  title: string;
  citation: string;
  court: string;
  date: string;
  jurisdiction: string;
  url: string;
  source: string;
  summary: string;
  fullText?: string;
  categories: string[];
  keywords: string[];
  relevanceScore?: number;
}

export interface DatabaseSource {
  id: string;
  name: string;
  url: string;
  description: string;
  jurisdiction: string[];
  isActive: boolean;
  apiEndpoint?: string;
}

export interface SearchQuery {
  query: string;
  jurisdiction?: string;
  dateFrom?: string;
  dateTo?: string;
  court?: string;
  category?: string;
  limit?: number;
}

export interface SearchResult {
  documents: LegalDocument[];
  totalCount: number;
  searchTime: number;
  sources: string[];
  suggestions?: string[];
}

class LegalDatabaseService {
  private static instance: LegalDatabaseService;
  private databases: DatabaseSource[] = [];
  private cache: Map<string, SearchResult> = new Map();
  private readonly CACHE_DURATION = 3600000; // 1 hour

  private constructor() {
    this.initializeDatabases();
  }

  public static getInstance(): LegalDatabaseService {
    if (!LegalDatabaseService.instance) {
      LegalDatabaseService.instance = new LegalDatabaseService();
    }
    return LegalDatabaseService.instance;
  }

  private initializeDatabases(): void {
    this.databases = [
      {
        id: 'africanlii',
        name: 'African Legal Information Institute',
        url: 'https://africanlii.org/',
        description: 'Pan-African legal database with cases from multiple African jurisdictions',
        jurisdiction: ['Africa', 'Multi-jurisdictional'],
        isActive: true,
        apiEndpoint: 'https://africanlii.org/api/v1'
      },
      {
        id: 'saflii',
        name: 'Southern African Legal Information Institute',
        url: 'https://www.saflii.org/',
        description: 'Legal information from Southern African countries',
        jurisdiction: ['South Africa', 'Botswana', 'Lesotho', 'Namibia', 'Swaziland'],
        isActive: true,
        apiEndpoint: 'https://www.saflii.org/api/v1'
      },
      {
        id: 'kenyalaw',
        name: 'Kenya Law Reports',
        url: 'https://kenyalaw.org/caselaw/',
        description: 'Comprehensive database of Kenyan legal cases and legislation',
        jurisdiction: ['Kenya'],
        isActive: true,
        apiEndpoint: 'https://kenyalaw.org/api/v1'
      },
      {
        id: 'supremecourt_ke',
        name: 'Kenya Supreme Court Library',
        url: 'https://supremecourt.judiciary.go.ke/the-supreme-court-library/',
        description: 'Official Kenya Supreme Court case database',
        jurisdiction: ['Kenya'],
        isActive: true,
        apiEndpoint: 'https://supremecourt.judiciary.go.ke/api/v1'
      },
      {
        id: 'worldlii',
        name: 'World Legal Information Institute',
        url: 'https://www.worldlii.org/',
        description: 'Global legal database including African jurisdictions',
        jurisdiction: ['Global', 'Africa'],
        isActive: true,
        apiEndpoint: 'https://www.worldlii.org/api/v1'
      },
      {
        id: 'bailii',
        name: 'British and Irish Legal Information Institute',
        url: 'https://www.bailii.org/',
        description: 'UK and Irish legal database (relevant for common law precedents)',
        jurisdiction: ['UK', 'Ireland'],
        isActive: true,
        apiEndpoint: 'https://www.bailii.org/api/v1'
      },
      {
        id: 'landportal',
        name: 'Land Portal Foundation',
        url: 'https://landportal.org/library-all',
        description: 'Land and property law resources for Africa',
        jurisdiction: ['Africa', 'Land Law'],
        isActive: true,
        apiEndpoint: 'https://landportal.org/api/v1'
      }
    ];
  }

  public getDatabases(): DatabaseSource[] {
    return this.databases;
  }

  public getActiveDatabases(): DatabaseSource[] {
    return this.databases.filter(db => db.isActive);
  }

  public async search(query: SearchQuery): Promise<SearchResult> {
    const cacheKey = this.generateCacheKey(query);
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const startTime = Date.now();
    const results = await this.performSearch(query);
    const searchTime = Date.now() - startTime;

    const searchResult: SearchResult = {
      documents: results,
      totalCount: results.length,
      searchTime,
      sources: this.getActiveDatabases().map(db => db.name),
      suggestions: this.generateSuggestions(query.query)
    };

    // Cache the results
    this.cache.set(cacheKey, searchResult);
    
    // Clean up cache after duration
    setTimeout(() => {
      this.cache.delete(cacheKey);
    }, this.CACHE_DURATION);

    return searchResult;
  }

  private async performSearch(query: SearchQuery): Promise<LegalDocument[]> {
    // In a real implementation, this would make actual API calls to each database
    // For now, we'll return mock data based on the query
    
    const mockDocuments: LegalDocument[] = [
      {
        id: '1',
        title: 'S v Makwanyane and Another',
        citation: '1995 (3) SA 391 (CC)',
        court: 'Constitutional Court of South Africa',
        date: '1995-06-06',
        jurisdiction: 'South Africa',
        url: 'https://saflii.org/za/cases/ZACC/1995/3.html',
        source: 'SAFLII',
        summary: 'Landmark case abolishing the death penalty in South Africa. The Constitutional Court held that the death penalty violated the right to life and human dignity.',
        categories: ['Constitutional Law', 'Criminal Law', 'Human Rights'],
        keywords: ['death penalty', 'constitutional law', 'human rights', 'dignity'],
        relevanceScore: 95
      },
      {
        id: '2',
        title: 'Azanian Peoples Organisation (AZAPO) v President of the Republic of South Africa',
        citation: '1996 (4) SA 672 (CC)',
        court: 'Constitutional Court of South Africa',
        date: '1996-07-25',
        jurisdiction: 'South Africa',
        url: 'https://saflii.org/za/cases/ZACC/1996/8.html',
        source: 'SAFLII',
        summary: 'Constitutional Court decision on the amnesty provisions of the Truth and Reconciliation Commission.',
        categories: ['Constitutional Law', 'Transitional Justice'],
        keywords: ['amnesty', 'truth and reconciliation', 'transitional justice'],
        relevanceScore: 88
      },
      {
        id: '3',
        title: 'Republic v Kanyotu & Others',
        citation: '[2005] eKLR',
        court: 'High Court of Kenya',
        date: '2005-03-15',
        jurisdiction: 'Kenya',
        url: 'https://kenyalaw.org/caselaw/cases/view/12345',
        source: 'Kenya Law',
        summary: 'High Court decision on corruption charges against senior government officials.',
        categories: ['Criminal Law', 'Anti-Corruption'],
        keywords: ['corruption', 'government officials', 'criminal charges'],
        relevanceScore: 82
      },
      {
        id: '4',
        title: 'Mumo Matemu v Trusted Society of Human Rights Alliance',
        citation: '[2013] eKLR',
        court: 'Supreme Court of Kenya',
        date: '2013-12-20',
        jurisdiction: 'Kenya',
        url: 'https://supremecourt.judiciary.go.ke/cases/view/67890',
        source: 'Kenya Supreme Court',
        summary: 'Supreme Court ruling on the independence of the judiciary and administrative oversight.',
        categories: ['Constitutional Law', 'Judicial Independence'],
        keywords: ['judicial independence', 'constitutional law', 'administration'],
        relevanceScore: 79
      },
      {
        id: '5',
        title: 'Attorney-General v Dow',
        citation: '[1992] BLR 119 (CA)',
        court: 'Court of Appeal of Botswana',
        date: '1992-06-03',
        jurisdiction: 'Botswana',
        url: 'https://africanlii.org/bw/cases/BWCA/1992/1.html',
        source: 'African LII',
        summary: 'Court of Appeal decision on citizenship rights and gender equality under customary law.',
        categories: ['Constitutional Law', 'Gender Rights', 'Customary Law'],
        keywords: ['citizenship', 'gender equality', 'customary law', 'women rights'],
        relevanceScore: 75
      },
      {
        id: '6',
        title: 'R v Laba',
        citation: '[1994] 3 SCR 965',
        court: 'Supreme Court of Canada',
        date: '1994-12-08',
        jurisdiction: 'Canada',
        url: 'https://www.bailii.org/ca/cases/SCC/1994/20.html',
        source: 'BAILII',
        summary: 'Supreme Court of Canada decision on reverse onus provisions in criminal law.',
        categories: ['Criminal Law', 'Constitutional Law'],
        keywords: ['reverse onus', 'criminal law', 'constitutional rights'],
        relevanceScore: 72
      },
      {
        id: '7',
        title: 'Land Rights and Food Security in Africa',
        citation: 'Land Portal Report 2023',
        court: 'N/A',
        date: '2023-03-01',
        jurisdiction: 'Africa',
        url: 'https://landportal.org/library/resources/land-rights-food-security-africa',
        source: 'Land Portal',
        summary: 'Comprehensive analysis of land rights and their impact on food security across African countries.',
        categories: ['Land Law', 'Food Security', 'Human Rights'],
        keywords: ['land rights', 'food security', 'agriculture', 'rural development'],
        relevanceScore: 68
      },
      {
        id: '8',
        title: 'Mining Rights and Environmental Protection in Ghana',
        citation: 'African Mining Law Journal 2022',
        court: 'N/A',
        date: '2022-09-15',
        jurisdiction: 'Ghana',
        url: 'https://africanlii.org/gh/journals/mining-law/2022/15.html',
        source: 'African LII',
        summary: 'Analysis of the balance between mining rights and environmental protection in Ghana.',
        categories: ['Mining Law', 'Environmental Law'],
        keywords: ['mining rights', 'environmental protection', 'Ghana', 'natural resources'],
        relevanceScore: 65
      }
    ];

    // Filter based on query parameters
    let filteredDocuments = mockDocuments;

    if (query.jurisdiction) {
      filteredDocuments = filteredDocuments.filter(doc => 
        doc.jurisdiction.toLowerCase().includes(query.jurisdiction!.toLowerCase())
      );
    }

    if (query.court) {
      filteredDocuments = filteredDocuments.filter(doc => 
        doc.court.toLowerCase().includes(query.court!.toLowerCase())
      );
    }

    if (query.category) {
      filteredDocuments = filteredDocuments.filter(doc => 
        doc.categories.some(cat => cat.toLowerCase().includes(query.category!.toLowerCase()))
      );
    }

    if (query.dateFrom) {
      filteredDocuments = filteredDocuments.filter(doc => 
        new Date(doc.date) >= new Date(query.dateFrom!)
      );
    }

    if (query.dateTo) {
      filteredDocuments = filteredDocuments.filter(doc => 
        new Date(doc.date) <= new Date(query.dateTo!)
      );
    }

    // Search in title, summary, and keywords
    if (query.query) {
      const searchTerms = query.query.toLowerCase().split(' ');
      filteredDocuments = filteredDocuments.filter(doc => {
        const searchableText = [
          doc.title,
          doc.summary,
          ...doc.keywords,
          ...doc.categories
        ].join(' ').toLowerCase();
        
        return searchTerms.every(term => searchableText.includes(term));
      });
    }

    // Sort by relevance score
    filteredDocuments.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    // Apply limit
    if (query.limit) {
      filteredDocuments = filteredDocuments.slice(0, query.limit);
    }

    return filteredDocuments;
  }

  private generateCacheKey(query: SearchQuery): string {
    return JSON.stringify(query);
  }

  private generateSuggestions(query: string): string[] {
    const suggestions = [
      'constitutional law',
      'criminal law',
      'civil rights',
      'contract law',
      'property law',
      'corporate law',
      'international law',
      'human rights',
      'environmental law',
      'mining law',
      'land rights',
      'judicial review',
      'administrative law',
      'family law',
      'labor law',
      'tax law',
      'competition law',
      'intellectual property',
      'banking law',
      'insurance law'
    ];

    return suggestions.filter(suggestion => 
      suggestion.includes(query.toLowerCase()) || 
      query.toLowerCase().includes(suggestion)
    ).slice(0, 5);
  }

  public async getDocumentById(id: string): Promise<LegalDocument | null> {
    // In a real implementation, this would fetch full document details
    const allDocuments = await this.performSearch({ query: '' });
    return allDocuments.find(doc => doc.id === id) || null;
  }

  public async downloadDocument(document: LegalDocument, format: 'pdf' | 'doc' | 'txt'): Promise<Blob> {
    // In a real implementation, this would download the document from the source
    // For now, we'll create a mock document
    
    const content = this.generateDocumentContent(document, format);
    const mimeType = this.getMimeType(format);
    
    return new Blob([content], { type: mimeType });
  }

  private generateDocumentContent(document: LegalDocument, format: 'pdf' | 'doc' | 'txt'): string {
    const content = `
${document.title}
${document.citation}
${document.court}
Date: ${document.date}
Jurisdiction: ${document.jurisdiction}

Summary:
${document.summary}

Categories: ${document.categories.join(', ')}
Keywords: ${document.keywords.join(', ')}

Source: ${document.source}
URL: ${document.url}

${document.fullText || 'Full text not available in this demo version.'}
`;

    return content;
  }

  private getMimeType(format: 'pdf' | 'doc' | 'txt'): string {
    switch (format) {
      case 'pdf':
        return 'application/pdf';
      case 'doc':
        return 'application/msword';
      case 'txt':
        return 'text/plain';
      default:
        return 'text/plain';
    }
  }

  public async getJurisdictions(): Promise<string[]> {
    const allJurisdictions = new Set<string>();
    
    this.databases.forEach(db => {
      db.jurisdiction.forEach(jurisdiction => {
        allJurisdictions.add(jurisdiction);
      });
    });

    return Array.from(allJurisdictions).sort();
  }

  public async getCourts(): Promise<string[]> {
    // In a real implementation, this would fetch from the databases
    return [
      'Constitutional Court of South Africa',
      'Supreme Court of Appeal of South Africa',
      'High Court of South Africa',
      'Supreme Court of Kenya',
      'Court of Appeal of Kenya',
      'High Court of Kenya',
      'Court of Appeal of Botswana',
      'High Court of Botswana',
      'Supreme Court of Ghana',
      'Court of Appeal of Ghana',
      'High Court of Ghana',
      'Supreme Court of Nigeria',
      'Court of Appeal of Nigeria',
      'Federal High Court of Nigeria',
      'African Court on Human and Peoples Rights',
      'East African Court of Justice'
    ];
  }

  public async getCategories(): Promise<string[]> {
    return [
      'Constitutional Law',
      'Criminal Law',
      'Civil Law',
      'Commercial Law',
      'Contract Law',
      'Property Law',
      'Family Law',
      'Labor Law',
      'Tax Law',
      'Environmental Law',
      'Mining Law',
      'Land Law',
      'Human Rights',
      'Administrative Law',
      'International Law',
      'Corporate Law',
      'Banking Law',
      'Insurance Law',
      'Intellectual Property',
      'Competition Law',
      'Maritime Law',
      'Aviation Law',
      'Telecommunications Law',
      'Energy Law',
      'Healthcare Law'
    ];
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const legalDatabaseService = LegalDatabaseService.getInstance();
export default legalDatabaseService;