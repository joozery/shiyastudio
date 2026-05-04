import type { Metadata } from 'next';
import { generateMetadata as contactMeta } from './metadata';

// Re-export generateMetadata for this segment
export { contactMeta as generateMetadata };

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
