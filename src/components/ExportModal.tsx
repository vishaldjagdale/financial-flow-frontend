
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  status: string;
  user: string;
  description: string;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

const ExportModal = ({ isOpen, onClose, transactions }: ExportModalProps) => {
  const [selectedColumns, setSelectedColumns] = useState({
    date: true,
    amount: true,
    category: true,
    status: true,
    user: true,
    description: true,
  });
  const [isExporting, setIsExporting] = useState(false);

  const columns = [
    { key: 'date' as keyof typeof selectedColumns, label: 'Date', description: 'Transaction date' },
    { key: 'amount' as keyof typeof selectedColumns, label: 'Amount', description: 'Transaction amount' },
    { key: 'category' as keyof typeof selectedColumns, label: 'Category', description: 'Transaction category' },
    { key: 'status' as keyof typeof selectedColumns, label: 'Status', description: 'Transaction status' },
    { key: 'user' as keyof typeof selectedColumns, label: 'User', description: 'User responsible' },
    { key: 'description' as keyof typeof selectedColumns, label: 'Description', description: 'Transaction description' },
  ];

  const handleColumnToggle = (column: keyof typeof selectedColumns) => {
    setSelectedColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(selectedColumns).every(Boolean);
    const newState = Object.keys(selectedColumns).reduce((acc, key) => {
      acc[key as keyof typeof selectedColumns] = !allSelected;
      return acc;
    }, {} as typeof selectedColumns);
    setSelectedColumns(newState);
  };

  const generateCSV = () => {
    const selectedKeys = Object.entries(selectedColumns)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => key);

    const headers = selectedKeys.map(key => 
      columns.find(col => col.key === key)?.label || key
    );

    const rows = transactions.map(transaction => 
      selectedKeys.map(key => {
        const value = transaction[key as keyof Transaction];
        // Handle special formatting
        if (key === 'amount') {
          return typeof value === 'number' ? value.toFixed(2) : value;
        }
        if (key === 'date') {
          return new Date(value as string).toLocaleDateString();
        }
        return value;
      })
    );

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  };

  const handleExport = async () => {
    const selectedCount = Object.values(selectedColumns).filter(Boolean).length;
    
    if (selectedCount === 0) {
      toast({
        title: "No columns selected",
        description: "Please select at least one column to export.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const csvContent = generateCSV();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast({
        title: "Export successful!",
        description: `Exported ${transactions.length} transactions with ${selectedCount} columns.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const selectedCount = Object.values(selectedColumns).filter(Boolean).length;
  const allSelected = Object.values(selectedColumns).every(Boolean);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Export Transactions
          </DialogTitle>
          <DialogDescription>
            Select the columns you want to include in your CSV export.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span>Transactions to export:</span>
              <Badge variant="secondary">{transactions.length}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span>Selected columns:</span>
              <Badge variant="secondary">{selectedCount}/6</Badge>
            </div>
          </div>

          {/* Column Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Select Columns</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs"
              >
                {allSelected ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {columns.map((column) => (
                <div
                  key={column.key}
                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={column.key}
                    checked={selectedColumns[column.key]}
                    onCheckedChange={() => handleColumnToggle(column.key)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={column.key}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {column.label}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {column.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          {selectedCount > 0 && (
            <div className="bg-accent/50 p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                Preview
              </h4>
              <div className="text-xs text-muted-foreground">
                Your CSV will include: {Object.entries(selectedColumns)
                  .filter(([_, selected]) => selected)
                  .map(([key, _]) => columns.find(col => col.key === key)?.label)
                  .join(', ')}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={selectedCount === 0 || isExporting}
              className="flex-1"
            >
              {isExporting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </div>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
