'use client';

import { CompanyData } from '@/lib/invoice/companyData';
import React from 'react';

type CompanyDataChangeHandler = {
  (field: string, value: string): void;
};

export default function CompanyDataForm({ data, onChange }: { data: CompanyData, onChange: CompanyDataChangeHandler }) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.currentTarget.id, event.currentTarget.value);

  return (
    <div>
      <p>Podaj dane Twojej firmy, które mają znaleźć się na fakturach.</p>
      <form>
        <div className="form-row">
          <label htmlFor="vatId">NIP:</label>
          <input type="text" autoComplete="off" id="vatId" value={data.vatId} onChange={handleChange} />
        </div>
        <div className="form-row">
          <label htmlFor="name">Nazwa firmy:</label>
          <input type="text" autoComplete="off" id="name" value={data.name} onChange={handleChange} />
        </div>
        <div className="form-row">
          <label htmlFor="street">Ulica i numer:</label>
          <input type="text" autoComplete="off" id="street" value={data.street} onChange={handleChange} />
        </div>
        <div className="form-row">
          <label htmlFor="zipCode">Kod pocztowy:</label>
          <input type="text" autoComplete="off" id="zipCode" value={data.zipCode} onChange={handleChange} />
          <label htmlFor="city">Miasto:</label>
          <input type="text" autoComplete="off" id="city" value={data.city} onChange={handleChange} />
        </div>
        <div className="form-row">
          <label htmlFor="bankName">Nazwa banku:</label>
          <input type="text" autoComplete="off" id="bankName" value={data.bankName} onChange={handleChange} />
        </div>
        <div className="form-row">
          <label htmlFor="bankAccount">Numer konta:</label>
          <input type="text" autoComplete="off" id="bankAccount" value={data.bankAccount} onChange={handleChange} />
        </div>
      </form>
    </div>
  );
}
