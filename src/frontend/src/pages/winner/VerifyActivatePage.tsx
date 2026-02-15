import { useState } from 'react';
import { useGetEntryByNumber, useClaimWinningEntry } from '../../hooks/useWinningEntry';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { WinningEntry } from '../../backend';

export default function VerifyActivatePage() {
  const [prizeNumber, setPrizeNumber] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [verifiedEntry, setVerifiedEntry] = useState<WinningEntry | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'valid' | 'invalid' | 'claimed'>('idle');

  const getEntry = useGetEntryByNumber();
  const claimEntry = useClaimWinningEntry();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prizeNumber.trim()) return;

    try {
      const entry = await getEntry.mutateAsync(prizeNumber.trim());
      if (entry && entry.ticketNumber === ticketNumber.trim()) {
        setVerifiedEntry(entry);
        if (entry.isClaimed) {
          setVerificationStatus('claimed');
        } else {
          setVerificationStatus('valid');
        }
      } else {
        setVerifiedEntry(null);
        setVerificationStatus('invalid');
      }
    } catch (error) {
      setVerifiedEntry(null);
      setVerificationStatus('invalid');
    }
  };

  const handleActivate = async () => {
    if (!verifiedEntry) return;

    try {
      await claimEntry.mutateAsync(verifiedEntry.id);
      setVerificationStatus('claimed');
      setVerifiedEntry({ ...verifiedEntry, isClaimed: true });
    } catch (error: any) {
      if (error.message?.includes('already claimed')) {
        setVerificationStatus('claimed');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Verify & Activate Prize</h1>
        <p className="text-muted-foreground">Enter your prize number and ticket number to verify your winning status</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prize Verification</CardTitle>
          <CardDescription>Please enter your prize details exactly as they appear on your ticket</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prizeNumber">
                Prize Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="prizeNumber"
                value={prizeNumber}
                onChange={(e) => setPrizeNumber(e.target.value)}
                placeholder="Enter your prize number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticketNumber">
                Ticket Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ticketNumber"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                placeholder="Enter your ticket number"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={getEntry.isPending}>
              {getEntry.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Prize'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {verificationStatus === 'valid' && verifiedEntry && !verifiedEntry.isClaimed && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800 dark:text-green-200">Valid Prize Found!</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            <p className="mb-2">
              Congratulations! Your prize <strong>{verifiedEntry.name}</strong> has been verified.
            </p>
            <Button onClick={handleActivate} disabled={claimEntry.isPending} className="mt-2">
              {claimEntry.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Activating...
                </>
              ) : (
                'Activate Prize'
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {verificationStatus === 'claimed' && (
        <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <AlertTitle className="text-blue-800 dark:text-blue-200">Prize Already Activated</AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            This prize has already been claimed and activated. If you activated it, please proceed to submit your claim form.
          </AlertDescription>
        </Alert>
      )}

      {verificationStatus === 'invalid' && (
        <Alert variant="destructive">
          <XCircle className="h-5 w-5" />
          <AlertTitle>Verification Failed</AlertTitle>
          <AlertDescription>
            The prize number and ticket number combination could not be verified. Please check your details and try again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
