import { generateMetadata as projectsMeta } from './metadata';

export { projectsMeta as generateMetadata };

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
