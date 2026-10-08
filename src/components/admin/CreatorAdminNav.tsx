'use client';
import {Link,usePathname} from '@/navigation';
import styles from './CreatorPages.module.css';
export default function CreatorAdminNav(){const pathname=usePathname();return <nav className={styles.nav} aria-label="จัดการ Influencer">{[['/admin/creators','ผู้สมัครและโปรไฟล์'],['/admin/creators/selections','รายชื่อที่ลูกค้าเลือก'],['/admin/creators/settings','หมวดหมู่ / ข้อตกลง']].map(([href,label])=><Link key={href} href={href} aria-current={pathname===href?'page':undefined}>{label}</Link>)}</nav>}
