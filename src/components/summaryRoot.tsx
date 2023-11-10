import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Sidebar from '@/components/sidebar';
import OrderListProvider from '@/context/orderListContext';
import { ReactNode } from 'react';

export default function SummaryRoot({ children }: { children: ReactNode }) {
  return (
    <OrderListProvider>
      <Container fluid>
        <Row>
          <Col md={2} id="sidebar">
            <Sidebar />
          </Col>
          <Col md={10} id="main">{children}</Col>
        </Row>
      </Container>
    </OrderListProvider>
  )
}
