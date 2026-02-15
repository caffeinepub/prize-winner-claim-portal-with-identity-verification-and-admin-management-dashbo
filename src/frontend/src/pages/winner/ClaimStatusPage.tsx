import { useGetAllClaims } from '../../hooks/useClaims';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Loader2, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { ClaimStatus } from '../../backend';

function getStatusBadge(status: ClaimStatus) {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          Pending Review
        </Badge>
      );
    case 'approved':
      return (
        <Badge className="gap-1 bg-green-600">
          <CheckCircle className="h-3 w-3" />
          Approved
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Rejected
        </Badge>
      );
    case 'awaitingInfo':
      return (
        <Badge variant="outline" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Awaiting Info
        </Badge>
      );
  }
}

export default function ClaimStatusPage() {
  const { identity } = useInternetIdentity();
  const { data: allClaims, isLoading } = useGetAllClaims(null, 0, 100);

  const myClaims = allClaims?.filter((claim) => claim.claimant.toString() === identity?.getPrincipal().toString()) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Claim Status</h1>
        <p className="text-muted-foreground">View the status of your prize claims</p>
      </div>

      {myClaims.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Claims Found</AlertTitle>
          <AlertDescription>You haven't submitted any prize claims yet. Start by verifying your prize and submitting a claim.</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {myClaims.map((claim) => (
            <Card key={claim.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Claim #{claim.id.slice(-8)}</CardTitle>
                    <CardDescription>Winner ID: {claim.winnerId}</CardDescription>
                  </div>
                  {getStatusBadge(claim.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Payout Method:</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {claim.payoutMethod.__kind__.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Submitted:</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(Number(claim.submissionTimestamp) / 1000000).toLocaleDateString()}
                  </p>
                </div>
                {claim.adminResponse && (
                  <Alert>
                    <AlertTitle>Admin Response</AlertTitle>
                    <AlertDescription>{claim.adminResponse}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
