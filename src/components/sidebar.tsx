'use client';

import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <h3>mercalc</h3>
      <Nav className="flex-column" as="nav">
        <NavItem>
          <Link href="/" className={`link ${pathname === '/' ? 'active' : ''}`}>Przegląd</Link>
        </NavItem>
        <NavItem>
          <Link href="/orders" className={`link ${pathname === '/orders' ? 'active' : ''}`}>Zamówienia</Link>
        </NavItem>
        <NavItem>
          <Link href="/stats" className={`link ${pathname === '/stats' ? 'active' : ''}`}>Statystyki VAT UE</Link>
        </NavItem>
        <NavItem>
          <Link href="/invoices" className={`link ${pathname === '/invoices' ? 'active' : ''}`}>Faktury</Link>
        </NavItem>
      </Nav>
    </>
  )
}
