import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Flag, TrendingUp, Lightbulb, AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const okrs = [
  { objective: 'Grow Revenue by 20% YoY', progress: 72, keyResults: [
    { kr: 'Close $12M in new business', progress: 68 },
    { kr: 'Expand to 3 new markets', progress: 66 },
    { kr: 'Increase ARPU by 15%', progress: 82 },
  ]},
  { objective: 'Achieve Product-Market Fit in APAC', progress: 45, keyResults: [
    { kr: 'Launch in 2 APAC markets', progress: 50 },
    { kr: 'Acquire 200 customers', progress: 35 },
    { kr: 'Reach $1M ARR in region', progress: 42 },
  ]},
  { objective: 'Build World-Class Engineering Team', progress: 88, keyResults: [
    { kr: 'Hire 15 senior engineers', progress: 93 },
    { kr: 'Reduce MTTR to <30 min', progress: 80 },
    { kr: 'Achieve 80% test coverage', progress: 92 },
  ]},
];

const initiatives = {
  'To Do': [
    { title: 'Launch loyalty program', priority: 'high' },
    { title: 'Partner with Industry Assoc.', priority: 'medium' },
  ],
  'In Progress': [
    { title: 'APAC market entry', priority: 'high' },
    { title: 'AI analytics platform', priority: 'high' },
    { title: 'Brand refresh', priority: 'medium' },
  ],
  'Done': [
    { title: 'SOC 2 certification', priority: 'high' },
    { title: 'New pricing model', priority: 'medium' },
  ],
};

const swotItems = {
  Strengths: ['Strong brand recognition', 'Talented engineering team', 'High customer retention (94%)', 'Solid financial position'],
  Weaknesses: ['Limited APAC presence', 'Legacy tech debt', 'High customer acquisition cost'],
  Opportunities: ['AI/ML integration', 'APAC expansion', 'Strategic partnerships', 'Adjacent market entry'],
  Threats: ['Increasing competition', 'Regulatory changes', 'Economic uncertainty', 'Talent war'],
};

const swotColors: Record<string, string> = {
  Strengths: 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20',
  Weaknesses: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20',
  Opportunities: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20',
  Threats: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20',
};

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

export function PlanningPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Strategic Planning" description="OKRs, strategic initiatives, and market intelligence" />

      <Tabs defaultValue="okrs">
        <TabsList>
          <TabsTrigger value="okrs">OKRs</TabsTrigger>
          <TabsTrigger value="initiatives">Initiatives</TabsTrigger>
          <TabsTrigger value="swot">SWOT Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="okrs" className="space-y-4 mt-4">
          {okrs.map((okr) => (
            <Card key={okr.objective}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    {okr.objective}
                  </CardTitle>
                  <span className="text-sm font-bold">{okr.progress}%</span>
                </div>
                <Progress value={okr.progress} className="h-2" />
              </CardHeader>
              <CardContent className="space-y-3">
                {okr.keyResults.map((kr) => (
                  <div key={kr.kr} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{kr.kr}</span>
                      <span className="font-medium">{kr.progress}%</span>
                    </div>
                    <Progress value={kr.progress} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="initiatives" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(initiatives).map(([col, items]) => (
              <Card key={col}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {col === 'To Do' && <Clock className="h-4 w-4" />}
                    {col === 'In Progress' && <ArrowRight className="h-4 w-4 text-primary" />}
                    {col === 'Done' && <CheckCircle className="h-4 w-4 text-emerald-600" />}
                    {col} <Badge variant="secondary">{items.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {items.map((item) => (
                    <div key={item.title} className="rounded-lg border p-3 text-sm">
                      <p className="font-medium">{item.title}</p>
                      <Badge className={`mt-1 ${priorityColors[item.priority]}`} variant="secondary">{item.priority}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="swot" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(swotItems).map(([category, items]) => (
              <Card key={category} className={swotColors[category]}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
