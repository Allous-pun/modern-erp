import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, FileText, CheckCircle, Clock, Vote, Users, Gavel } from 'lucide-react';

const meetings = [
  { id: '1', date: 'Mar 28, 2026', title: 'Q1 Board Review', type: 'Regular', status: 'upcoming', attendees: 12, quorum: true },
  { id: '2', date: 'Apr 15, 2026', title: 'Strategy Session', type: 'Special', status: 'scheduled', attendees: 8, quorum: true },
  { id: '3', date: 'Feb 20, 2026', title: 'Annual Budget', type: 'Regular', status: 'completed', attendees: 11, quorum: true },
  { id: '4', date: 'Jan 15, 2026', title: 'Year-End Review', type: 'Regular', status: 'completed', attendees: 10, quorum: true },
];

const resolutions = [
  { id: '1', title: 'Approve FY2026 Budget', meeting: 'Feb 20, 2026', votes: { for: 9, against: 1, abstain: 1 }, status: 'passed' },
  { id: '2', title: 'Appoint External Auditor', meeting: 'Feb 20, 2026', votes: { for: 11, against: 0, abstain: 0 }, status: 'passed' },
  { id: '3', title: 'Expansion into APAC Market', meeting: 'Jan 15, 2026', votes: { for: 7, against: 2, abstain: 1 }, status: 'passed' },
  { id: '4', title: 'Executive Compensation Review', meeting: 'Pending', votes: { for: 0, against: 0, abstain: 0 }, status: 'pending' },
];

const minutes = [
  { id: '1', meeting: 'Annual Budget Meeting', date: 'Feb 20, 2026', pages: 12, status: 'approved' },
  { id: '2', meeting: 'Year-End Review', date: 'Jan 15, 2026', pages: 15, status: 'approved' },
  { id: '3', meeting: 'Emergency Session', date: 'Dec 5, 2025', pages: 6, status: 'draft' },
];

const statusStyle: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  scheduled: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  passed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  draft: 'bg-muted text-muted-foreground',
};

export function GovernancePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Governance" description="Board meetings, resolutions, and corporate governance" />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardContent className="flex items-center gap-3 p-4">
          <Calendar className="h-8 w-8 text-primary" />
          <div><p className="text-2xl font-bold">2</p><p className="text-sm text-muted-foreground">Upcoming Meetings</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4">
          <Gavel className="h-8 w-8 text-primary" />
          <div><p className="text-2xl font-bold">3</p><p className="text-sm text-muted-foreground">Resolutions Passed</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4">
          <Vote className="h-8 w-8 text-primary" />
          <div><p className="text-2xl font-bold">1</p><p className="text-sm text-muted-foreground">Pending Votes</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4">
          <Users className="h-8 w-8 text-primary" />
          <div><p className="text-2xl font-bold">12</p><p className="text-sm text-muted-foreground">Board Members</p></div>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="meetings">
        <TabsList>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="resolutions">Resolutions</TabsTrigger>
          <TabsTrigger value="minutes">Minutes</TabsTrigger>
        </TabsList>

        <TabsContent value="meetings">
          <Card>
            <CardHeader><CardTitle className="text-base">Board Meetings</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Date</TableHead><TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Attendees</TableHead><TableHead>Status</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {meetings.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.date}</TableCell>
                      <TableCell>{m.title}</TableCell>
                      <TableCell><Badge variant="outline">{m.type}</Badge></TableCell>
                      <TableCell>{m.attendees}</TableCell>
                      <TableCell><Badge className={statusStyle[m.status]}>{m.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolutions">
          <Card>
            <CardHeader><CardTitle className="text-base">Resolution Tracker</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Resolution</TableHead><TableHead>Meeting</TableHead><TableHead>For</TableHead><TableHead>Against</TableHead><TableHead>Abstain</TableHead><TableHead>Status</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {resolutions.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.title}</TableCell>
                      <TableCell>{r.meeting}</TableCell>
                      <TableCell className="text-emerald-600 font-medium">{r.votes.for}</TableCell>
                      <TableCell className="text-destructive font-medium">{r.votes.against}</TableCell>
                      <TableCell className="text-muted-foreground">{r.votes.abstain}</TableCell>
                      <TableCell><Badge className={statusStyle[r.status]}>{r.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="minutes">
          <Card>
            <CardHeader><CardTitle className="text-base">Meeting Minutes</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Meeting</TableHead><TableHead>Date</TableHead><TableHead>Pages</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {minutes.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.meeting}</TableCell>
                      <TableCell>{m.date}</TableCell>
                      <TableCell>{m.pages}</TableCell>
                      <TableCell><Badge className={statusStyle[m.status]}>{m.status}</Badge></TableCell>
                      <TableCell><Button variant="ghost" size="sm"><FileText className="mr-1 h-4 w-4" /> View</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
