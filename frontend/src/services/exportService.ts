import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { saveAs } from 'file-saver'
import { format } from 'date-fns'

// Extend jsPDF to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void
  }
}

export interface ExportColumn {
  key: string
  title: string
  width?: number
  format?: (value: any) => string
}

export interface ExportOptions {
  filename?: string
  title?: string
  columns: ExportColumn[]
  data: any[]
  filters?: Record<string, any>
  metadata?: Record<string, any>
}

class ExportService {
  // Export to CSV
  exportToCSV(options: ExportOptions): void {
    const { filename = 'export', columns, data } = options
    
    // Create CSV content
    const headers = columns.map(col => col.title).join(',')
    const rows = data.map(item => 
      columns.map(col => {
        const value = this.getNestedValue(item, col.key)
        const formatted = col.format ? col.format(value) : value
        return this.escapeCsvValue(formatted)
      }).join(',')
    )
    
    const csvContent = [headers, ...rows].join('\n')
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, `${filename}.csv`)
  }

  // Export to Excel
  exportToExcel(options: ExportOptions): void {
    const { filename = 'export', title, columns, data, metadata } = options
    
    // Create workbook
    const wb = XLSX.utils.book_new()
    
    // Prepare data
    const headers = columns.map(col => col.title)
    const rows = data.map(item => 
      columns.map(col => {
        const value = this.getNestedValue(item, col.key)
        return col.format ? col.format(value) : value
      })
    )
    
    const wsData = [headers, ...rows]
    
    // Add title row if provided
    if (title) {
      wsData.unshift([title])
      wsData.unshift([]) // Empty row for spacing
    }
    
    // Add metadata if provided
    if (metadata) {
      wsData.push([]) // Empty row
      Object.entries(metadata).forEach(([key, value]) => {
        wsData.push([key, value])
      })
    }
    
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    
    // Set column widths
    const colWidths = columns.map(col => ({ wch: col.width || 15 }))
    ws['!cols'] = colWidths
    
    // Style the header row
    const headerRow = title ? 2 : 0
    for (let i = 0; i < columns.length; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: headerRow, c: i })
      if (ws[cellRef]) {
        ws[cellRef].s = {
          fill: { fgColor: { rgb: '4F46E5' } },
          font: { color: { rgb: 'FFFFFF' }, bold: true }
        }
      }
    }
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Data')
    
    // Save file
    XLSX.writeFile(wb, `${filename}.xlsx`)
  }

  // Export to PDF
  exportToPDF(options: ExportOptions): void {
    const { filename = 'export', title, columns, data, metadata } = options
    
    // Create PDF document
    const doc = new jsPDF()
    
    // Add title
    if (title) {
      doc.setFontSize(16)
      doc.text(title, 14, 15)
    }
    
    // Add metadata
    if (metadata) {
      let yPos = title ? 25 : 15
      doc.setFontSize(10)
      Object.entries(metadata).forEach(([key, value]) => {
        doc.text(`${key}: ${value}`, 14, yPos)
        yPos += 5
      })
    }
    
    // Prepare table data
    const headers = columns.map(col => col.title)
    const rows = data.map(item => 
      columns.map(col => {
        const value = this.getNestedValue(item, col.key)
        const formatted = col.format ? col.format(value) : value
        return formatted?.toString() || ''
      })
    )
    
    // Add table
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: metadata ? 50 : (title ? 25 : 15),
      styles: {
        fontSize: 8,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: columns.reduce((acc, col, index) => {
        if (col.width) {
          acc[index] = { cellWidth: col.width }
        }
        return acc
      }, {} as any)
    })
    
    // Save PDF
    doc.save(`${filename}.pdf`)
  }

  // Parse CSV file
  parseCSV(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string
          const lines = csv.split('\n')
          const headers = lines[0].split(',').map(h => h.trim())
          
          const data = lines.slice(1)
            .filter(line => line.trim())
            .map(line => {
              const values = this.parseCSVLine(line)
              const row: any = {}
              headers.forEach((header, index) => {
                row[header] = values[index]?.trim() || ''
              })
              return row
            })
          
          resolve(data)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  // Parse Excel file
  parseExcel(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: 'binary' })
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(firstSheet)
          
          resolve(jsonData)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsBinaryString(file)
    })
  }

  // Generate import template
  generateImportTemplate(columns: ExportColumn[], format: 'csv' | 'xlsx' = 'csv'): void {
    const templateData = [
      columns.reduce((acc, col) => {
        acc[col.title] = this.getExampleValue(col.key)
        return acc
      }, {} as any)
    ]
    
    const options: ExportOptions = {
      filename: 'import_template',
      title: 'Import Template',
      columns,
      data: templateData,
      metadata: {
        'Generated': format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        'Instructions': 'Fill in the data and upload this file'
      }
    }
    
    if (format === 'csv') {
      this.exportToCSV(options)
    } else {
      this.exportToExcel(options)
    }
  }

  // Validate import data
  validateImportData(data: any[], requiredFields: string[]): {
    valid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []
    
    // Check if data is empty
    if (!data || data.length === 0) {
      errors.push('No data found in the file')
      return { valid: false, errors, warnings }
    }
    
    // Check required fields
    const headers = Object.keys(data[0])
    const missingFields = requiredFields.filter(field => !headers.includes(field))
    
    if (missingFields.length > 0) {
      errors.push(`Missing required fields: ${missingFields.join(', ')}`)
    }
    
    // Validate each row
    data.forEach((row, index) => {
      requiredFields.forEach(field => {
        if (!row[field] || row[field].toString().trim() === '') {
          errors.push(`Row ${index + 1}: Missing required field "${field}"`)
        }
      })
      
      // Check for suspicious data patterns
      if (Object.values(row).every(val => !val || val.toString().trim() === '')) {
        warnings.push(`Row ${index + 1}: All fields are empty`)
      }
    })
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }

  // Helper methods
  private getNestedValue(obj: any, key: string): any {
    return key.split('.').reduce((o, k) => o && o[k], obj)
  }

  private escapeCsvValue(value: any): string {
    if (value === null || value === undefined) return ''
    
    const stringValue = value.toString()
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }
    return stringValue
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++ // Skip next quote
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current)
    return result
  }

  private getExampleValue(key: string): string {
    const examples: Record<string, string> = {
      'company_name': 'Example Corp Ltd',
      'entity_type': 'corporation',
      'jurisdiction_of_incorporation': 'Delaware',
      'incorporation_date': '2020-01-15',
      'registered_address': '123 Main St, City, State 12345',
      'industry_sector': 'Technology',
      'company_number': '12345678',
      'tax_id': 'TAX123456789',
      'website': 'https://www.example.com',
      'phone': '+1 (555) 123-4567',
      'email': 'contact@example.com',
      'name': 'John Doe',
      'title': 'CEO',
      'percentage': '100',
      'status': 'active'
    }
    
    return examples[key] || 'Example Value'
  }
}

export const exportService = new ExportService()