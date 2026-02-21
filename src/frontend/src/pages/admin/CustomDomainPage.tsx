import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Globe, Copy, CheckCircle2, ExternalLink, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from '../../components/ui/alert';

export default function CustomDomainPage() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const canisterId = 'iwwkn-jyaaa-aaaap-qnc6q-cai';
  const currentUrl = `https://${canisterId}.icp0.io`;

  const copyToClipboard = (text: string, itemName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemName);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Globe className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Custom Domain Setup</h1>
          <p className="text-muted-foreground">Configure a vanity URL for your Meta Lottery Portal</p>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Your app is currently accessible at: <strong>{currentUrl}</strong>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Current Canister Information
          </CardTitle>
          <CardDescription>Your Internet Computer canister details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Canister ID</p>
              <p className="font-mono text-sm mt-1">{canisterId}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(canisterId, 'canisterId')}
            >
              {copiedItem === 'canisterId' ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current URL</p>
              <p className="font-mono text-sm mt-1 break-all">{currentUrl}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(currentUrl, 'currentUrl')}
            >
              {copiedItem === 'currentUrl' ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 1: Register Your Domain</CardTitle>
          <CardDescription>Purchase a custom domain from a domain registrar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            First, you'll need to own a domain name. You can purchase one from popular registrars like:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
            <li>Namecheap</li>
            <li>GoDaddy</li>
            <li>Google Domains</li>
            <li>Cloudflare Registrar</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Example: <span className="font-mono">metalottery.com</span> or <span className="font-mono">myprizeportal.io</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 2: Configure DNS Records</CardTitle>
          <CardDescription>Point your domain to the Internet Computer boundary nodes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            In your domain registrar's DNS settings, add a CNAME record:
          </p>
          
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Type</p>
                <p className="font-mono mt-1">CNAME</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Name</p>
                <p className="font-mono mt-1">@</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Value</p>
                <p className="font-mono mt-1 break-all">{canisterId}.icp0.io</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => copyToClipboard(`${canisterId}.icp0.io`, 'cnameValue')}
            >
              {copiedItem === 'cnameValue' ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy CNAME Value
                </>
              )}
            </Button>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Note:</strong> DNS propagation can take 24-48 hours. Some registrars may require you to use a subdomain (e.g., www) instead of the root domain (@).
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 3: Register Custom Domain with IC</CardTitle>
          <CardDescription>Configure the Internet Computer boundary nodes to recognize your domain</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            After DNS is configured, you need to register your custom domain with the Internet Computer boundary nodes using the <span className="font-mono">dfx</span> command-line tool:
          </p>
          
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-2">Command:</p>
            <code className="text-sm font-mono block break-all">
              dfx canister update-settings {canisterId} --add-controller $(dfx identity get-principal)
            </code>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-2">Then register the domain:</p>
            <code className="text-sm font-mono block break-all">
              dfx canister call {canisterId} http_request '(record &#123; url = "https://yourdomain.com"; method = "GET"; headers = vec &#123;&#125;; body = vec &#123;&#125; &#125;)'
            </code>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              You'll need the <span className="font-mono">dfx</span> CLI tool installed and configured with your Internet Identity. Visit the{' '}
              <a
                href="https://internetcomputer.org/docs/current/developer-docs/setup/install"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                IC documentation
                <ExternalLink className="h-3 w-3" />
              </a>{' '}
              for installation instructions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 4: Configure Internet Identity</CardTitle>
          <CardDescription>Update authorized origins for authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            For Internet Identity authentication to work with your custom domain, you need to add it to the authorized origins list.
          </p>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Important:</strong> Internet Identity automatically allows authentication from <span className="font-mono">.icp0.io</span> domains. For custom domains, you may need to contact the Internet Computer support or use alternative authentication methods.
            </AlertDescription>
          </Alert>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">Authorized Origins:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li className="font-mono">{currentUrl}</li>
              <li className="font-mono">https://yourdomain.com</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 5: Test Your Custom Domain</CardTitle>
          <CardDescription>Verify that everything is working correctly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Once DNS has propagated and the domain is registered, test your custom domain:
          </p>
          
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground ml-4">
            <li>Visit your custom domain in a web browser</li>
            <li>Verify the Meta Lottery Portal loads correctly</li>
            <li>Test Internet Identity login functionality</li>
            <li>Check that all pages and features work as expected</li>
          </ol>

          <Alert>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm">
              <strong>Success!</strong> If you can access your app and log in successfully, your custom domain is configured correctly.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Additional Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <a
            href="https://internetcomputer.org/docs/current/developer-docs/production/custom-domain"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            Internet Computer Custom Domain Documentation
          </a>
          <a
            href="https://internetcomputer.org/docs/current/developer-docs/identity/internet-identity/integrate-internet-identity"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            Internet Identity Integration Guide
          </a>
          <a
            href="https://forum.dfinity.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            DFINITY Developer Forum (for support)
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
