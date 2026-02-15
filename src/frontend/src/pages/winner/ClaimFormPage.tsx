import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useSubmitWinnerClaim } from '../../hooks/useClaims';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Alert, AlertDescription } from '../../components/ui/alert';
import PayoutMethodFields from '../../components/winner/PayoutMethodFields';
import { Loader2, CheckCircle } from 'lucide-react';
import type { PayoutMethod, ClaimStatus } from '../../backend';

export default function ClaimFormPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const submitClaim = useSubmitWinnerClaim();

  const [winnerId, setWinnerId] = useState('');
  const [payoutType, setPayoutType] = useState<'atmCard' | 'certifiedCheck' | 'bankTransfer'>('bankTransfer');
  const [payoutDetails, setPayoutDetails] = useState<any>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;

    let payoutMethod: PayoutMethod;
    if (payoutType === 'atmCard') {
      payoutMethod = {
        __kind__: 'atmCard',
        atmCard: payoutDetails,
      };
    } else if (payoutType === 'certifiedCheck') {
      payoutMethod = {
        __kind__: 'certifiedCheck',
        certifiedCheck: payoutDetails,
      };
    } else {
      payoutMethod = {
        __kind__: 'bankTransfer',
        bankTransfer: payoutDetails,
      };
    }

    const claimId = `claim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const claim = {
      id: claimId,
      winnerId: winnerId.trim(),
      claimant: identity.getPrincipal(),
      payoutMethod,
      status: 'pending' as ClaimStatus,
      submissionTimestamp: BigInt(Date.now() * 1000000),
    };

    try {
      await submitClaim.mutateAsync(claim);
      navigate({ to: '/confirmation' });
    } catch (error) {
      console.error('Failed to submit claim:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Submit Prize Claim</h1>
        <p className="text-muted-foreground">Complete the form below to claim your prize</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Winner Information</CardTitle>
            <CardDescription>Provide your winning entry details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="winnerId">
                Winner ID / Prize Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="winnerId"
                value={winnerId}
                onChange={(e) => setWinnerId(e.target.value)}
                placeholder="Enter your winner ID or prize number"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payout Method</CardTitle>
            <CardDescription>Choose how you would like to receive your prize</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={payoutType} onValueChange={(value: any) => setPayoutType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bankTransfer" id="bankTransfer" />
                <Label htmlFor="bankTransfer" className="cursor-pointer">
                  Bank Transfer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="certifiedCheck" id="certifiedCheck" />
                <Label htmlFor="certifiedCheck" className="cursor-pointer">
                  Certified Check
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="atmCard" id="atmCard" />
                <Label htmlFor="atmCard" className="cursor-pointer">
                  ATM Card
                </Label>
              </div>
            </RadioGroup>

            <div className="pt-4 border-t">
              <PayoutMethodFields payoutType={payoutType} value={payoutDetails} onChange={setPayoutDetails} />
            </div>
          </CardContent>
        </Card>

        {submitClaim.isError && (
          <Alert variant="destructive">
            <AlertDescription>Failed to submit claim. Please try again.</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={submitClaim.isPending}>
          {submitClaim.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting Claim...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Submit Claim
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
