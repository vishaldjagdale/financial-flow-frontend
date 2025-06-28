
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, Filter } from 'lucide-react';

const Reports = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-2">
            Generate and download comprehensive financial reports
          </p>
        </div>
        <Button className="mt-4 sm:mt-0">
          <Download className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Monthly Report',
            description: 'Comprehensive monthly financial summary',
            icon: Calendar,
          },
          {
            title: 'Category Analysis',
            description: 'Detailed breakdown by expense categories',
            icon: Filter,
          },
          {
            title: 'Custom Report',
            description: 'Build custom reports with specific criteria',
            icon: FileText,
          },
        ].map((report, index) => (
          <Card key={report.title} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <report.icon className="w-5 h-5 mr-2" />
                {report.title}
              </CardTitle>
              <CardDescription>
                {report.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Generate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            View and download previously generated reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <p>No reports generated yet. Create your first report above.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
