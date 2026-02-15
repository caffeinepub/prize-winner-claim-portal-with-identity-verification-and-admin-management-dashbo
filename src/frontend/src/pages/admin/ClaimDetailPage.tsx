import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetAllClaims } from '../../hooks/useClaims';
import { useUpdateClaimStatus, useAdminResponse } from '../../hooks/useAdminClaims';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import type { ClaimStatus } from '../../backend';

export default function ClaimDetailPage() {
  const { claimId } = useParams({ from: '/admin/claims/$claimId' });
  const navigate = useNavigate();
  const { data: claims, isLoading } = useGetAllClaims(null, 0, 1000);
  const updateStatus = useUpdateClaimStatus();
  const sendResponse = useAdminResponse();

  const [newStatus, setNewStatus] = useState<ClaimStatus | ''>('');
  const [responseText, setResponseText] = useState('');

  const claim = claims?.find((c) => c.id === claimId);

  const handleUpdateStatus = async () => {
    if (!newStatus || !claim) return;
    try {
      await updateStatus.mutateAsync({ claimId: claim.id, status: newStatus as ClaimStatus });
      setNewStatus('');
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleSendResponse = async () => {
    if (!responseText.trim() || !claim) return;
    try {
      await sendResponse.mutateAsync({ claimId: claim.id, response: responseText.trim() });
      setResponseText('');
    } catch (error) {
      console.error('Failed to send response:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertDescription>Claim not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate({ to: '/admin/claims' })} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Claims
      </Button>

      <div>
        <h1 className="text-3xl font-bold mb-2">Claim Details</h1>
        <p className="text-muted-foreground">Review and manage this prize claim</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Claim #{claim.id.slice(-8)}</CardTitle>
              <CardDescription>Winner ID: {claim.winnerId}</CardDescription>
            </div>
            <Badge>{claim.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">Claimant Principal:</p>
              <p className="text-sm text-muted-foreground font-mono break-all">{claim.claimant.toString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Submitted:</p>
              <p className="text-sm text-muted-foreground">
                {new Date(Number(claim.submissionTimestamp) / 1000000).toLocaleString()}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium mb-2">Payout Method:</p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-semibold capitalize mb-2">{claim.payoutMethod.__kind__.replace(/([A-Z])/g, ' $1').trim()}</p>
              <pre className="text-xs text-muted-foreground overflow-auto">
                {JSON.stringify(
                  claim.payoutMethod.__kind__ === 'atmCard'
                    ? claim.payoutMethod.atmCard
                    : claim.payoutMethod.__kind__ === 'certifiedCheck'
                      ? claim.payoutMethod.certifiedCheck
                      : claim.payoutMethod.bankTransfer,
                  null,
                  2
                )}
              </pre>
            </div>
          </div>

          {claim.adminResponse && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Previous Admin Response:</p>
                <Alert>
                  <AlertDescription>{claim.adminResponse}</AlertDescription>
                </Alert>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
          <CardDescription>Update claim status or send a response to the winner</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Update Status</Label>
            <div className="flex gap-2">
              <Select value={newStatus} onValueChange={(val) => setNewStatus(val as ClaimStatus)}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="awaitingInfo">Awaiting Info</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleUpdateStatus} disabled={!newStatus || updateStatus.isPending}>
                {updateStatus.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update'}
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="response">Send Response to Winner</Label>
            <Textarea
              id="response"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Enter your message to the winner..."
              rows={4}
            />
            <Button onClick={handleSendResponse} disabled={!responseText.trim() || sendResponse.isPending} className="gap-2">
              {sendResponse.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Send Response
                </>
              )}
            </Button>
          </div>

          {(updateStatus.isSuccess || sendResponse.isSuccess) && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700 dark:text-green-300">Action completed successfully</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
