import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface PayoutMethodFieldsProps {
  payoutType: 'atmCard' | 'certifiedCheck' | 'bankTransfer';
  value: any;
  onChange: (value: any) => void;
}

export default function PayoutMethodFields({ payoutType, value, onChange }: PayoutMethodFieldsProps) {
  const handleChange = (field: string, val: string) => {
    onChange({ ...value, [field]: val });
  };

  if (payoutType === 'bankTransfer') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accountName">
            Account Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="accountName"
            value={value.accountName || ''}
            onChange={(e) => handleChange('accountName', e.target.value)}
            placeholder="Full name on account"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="accountNumber">
            Account Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="accountNumber"
            value={value.accountNumber || ''}
            onChange={(e) => handleChange('accountNumber', e.target.value)}
            placeholder="Your account number"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bank">
            Bank Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="bank"
            value={value.bank || ''}
            onChange={(e) => handleChange('bank', e.target.value)}
            placeholder="Name of your bank"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="routingNumber">
            Routing Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="routingNumber"
            value={value.routingNumber || ''}
            onChange={(e) => handleChange('routingNumber', e.target.value)}
            placeholder="Bank routing number"
            required
          />
        </div>
      </div>
    );
  }

  if (payoutType === 'certifiedCheck') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="payeeName">
            Payee Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="payeeName"
            value={value.payeeName || ''}
            onChange={(e) => handleChange('payeeName', e.target.value)}
            placeholder="Name to appear on check"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="checkBank">
            Bank Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="checkBank"
            value={value.bank || ''}
            onChange={(e) => handleChange('bank', e.target.value)}
            placeholder="Bank where check will be deposited"
            required
          />
        </div>
      </div>
    );
  }

  // ATM Card
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardBank">
          Bank Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="cardBank"
          value={value.bank || ''}
          onChange={(e) => handleChange('bank', e.target.value)}
          placeholder="Your bank name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cardType">
          Card Type <span className="text-destructive">*</span>
        </Label>
        <Input
          id="cardType"
          value={value.cardType || ''}
          onChange={(e) => handleChange('cardType', e.target.value)}
          placeholder="e.g., Visa, Mastercard"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cardNumber">
          Card Number (last 4 digits) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="cardNumber"
          value={value.cardNumber || ''}
          onChange={(e) => handleChange('cardNumber', e.target.value)}
          placeholder="Last 4 digits only"
          maxLength={4}
          required
        />
      </div>
    </div>
  );
}
