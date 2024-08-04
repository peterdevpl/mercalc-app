import { Col, Form, Row } from 'react-bootstrap';
import { CompanyData } from '@/lib/invoice/companyData';
import React from 'react';

type CompanyDataChangeHandler = {
  (field: string, value: string): void;
};

export default function CompanyDataForm({ data, onChange }: { data: CompanyData, onChange: CompanyDataChangeHandler }) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.currentTarget.id, event.currentTarget.value);

  return (
    <Form>
      <Row className="mb-3">
        <p>Podaj dane Twojej firmy, które mają znaleźć się na fakturach.</p>
      </Row>

      <Form.Group as={Row} controlId="vatId">
        <Form.Label column sm={1}>NIP:</Form.Label>
        <Col sm={11}>
          <Form.Control type="text" size="sm" autoComplete="off" value={data.vatId} onChange={handleChange} />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="name">
        <Form.Label column sm={1}>Nazwa firmy:</Form.Label>
        <Col sm={11}>
          <Form.Control type="text" size="sm" autoComplete="off" value={data.name} onChange={handleChange} />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="street">
        <Form.Label column sm={1}>Ulica i numer:</Form.Label>
        <Col sm={11}>
          <Form.Control type="text" size="sm" autoComplete="off" value={data.street} onChange={handleChange} />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="zipCode">
        <Form.Label column sm={1}>Kod pocztowy:</Form.Label>
        <Col sm={11}>
          <Form.Control type="text" size="sm" autoComplete="off" value={data.zipCode} onChange={handleChange} />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="city">
        <Form.Label column sm={1}>Miasto:</Form.Label>
        <Col sm={11}>
          <Form.Control type="text" size="sm" autoComplete="off" value={data.city} onChange={handleChange} />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="bankName">
        <Form.Label column sm={1}>Nazwa banku:</Form.Label>
        <Col sm={11}>
          <Form.Control type="text" size="sm" autoComplete="off" value={data.bankName} onChange={handleChange} />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="bankAccount">
        <Form.Label column sm={1}>Numer konta:</Form.Label>
        <Col sm={11}>
          <Form.Control type="text" size="sm" autoComplete="off" value={data.bankAccount} onChange={handleChange} />
        </Col>
      </Form.Group>
    </Form>
  );
}
