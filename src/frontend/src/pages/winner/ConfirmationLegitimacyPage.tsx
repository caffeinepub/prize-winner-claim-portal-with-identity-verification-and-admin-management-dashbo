import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { CheckCircle, Shield, AlertTriangle, Info } from 'lucide-react';
import { Separator } from '../../components/ui/separator';

export default function ConfirmationLegitimacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Claim Confirmation & Information</h1>
        <p className="text-muted-foreground">Your claim has been received and important safety information</p>
      </div>

      <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-800 dark:text-green-200">Claim Submitted Successfully</AlertTitle>
        <AlertDescription className="text-green-700 dark:text-green-300">
          Your prize claim has been received and is being reviewed by our team. You will be notified of any updates to your claim status.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
            Is This Real? Legitimacy Information
          </CardTitle>
          <CardDescription>Important information about our prize claim process</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              About Our Process
            </h3>
            <p className="text-sm text-muted-foreground">
              This is an official prize claim portal designed to help legitimate contest winners verify their prizes and submit claims
              securely. All submissions are reviewed by our team to ensure authenticity and prevent fraud.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Important Safety Disclaimers
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-yellow-600">•</span>
                <span>
                  <strong>No Government Endorsement:</strong> This service is not endorsed by, affiliated with, or sponsored by any
                  government entity or public official.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-600">•</span>
                <span>
                  <strong>Verify Independently:</strong> Always verify the legitimacy of any prize notification through official channels
                  before submitting personal information.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-600">•</span>
                <span>
                  <strong>No Upfront Fees:</strong> Legitimate prizes never require upfront payment. Be cautious of any requests for fees,
                  taxes, or processing charges before receiving your prize.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-600">•</span>
                <span>
                  <strong>Protect Your Information:</strong> Only provide personal information through secure, verified channels. Never
                  share sensitive data via email or unsecured websites.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-600">•</span>
                <span>
                  <strong>Report Suspicious Activity:</strong> If you suspect fraud or receive suspicious communications claiming to be
                  from this service, report it to appropriate authorities.
                </span>
              </li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">What Happens Next?</h3>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Our team will review your claim and verify your identity documents</li>
              <li>You may be contacted if additional information is needed</li>
              <li>Once approved, your prize will be processed according to your chosen payout method</li>
              <li>You can check your claim status at any time from the Claim Status page</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
