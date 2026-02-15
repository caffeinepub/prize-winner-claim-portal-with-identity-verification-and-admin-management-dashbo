import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllClaims } from '../../hooks/useClaims';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Loader2, Eye } from 'lucide-react';
import type { ClaimStatus } from '../../backend';

export default function ClaimsListPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | null>(null);
  const { data: claims, isLoading } = useGetAllClaims(statusFilter, 0, 50);

  const getStatusBadge = (status: ClaimStatus) => {
    const variants: Record<ClaimStatus, any> = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
      awaitingInfo: 'outline',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage Claims</h1>
        <p className="text-muted-foreground">Review and manage all prize claims</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Claims</CardTitle>
              <CardDescription>Filter and view claim details</CardDescription>
            </div>
            <Select value={statusFilter || 'all'} onValueChange={(val) => setStatusFilter(val === 'all' ? null : (val as ClaimStatus))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="awaitingInfo">Awaiting Info</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : claims && claims.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Winner ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-mono text-sm">#{claim.id.slice(-8)}</TableCell>
                    <TableCell>{claim.winnerId}</TableCell>
                    <TableCell>{getStatusBadge(claim.status)}</TableCell>
                    <TableCell>{new Date(Number(claim.submissionTimestamp) / 1000000).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => navigate({ to: `/admin/claims/${claim.id}` })}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">No claims found</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
