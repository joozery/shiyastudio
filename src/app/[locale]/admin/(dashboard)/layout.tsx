import type {ReactNode} from 'react';
import {redirect} from 'next/navigation';
import {getAdminSession} from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';
export default async function AdminLayout({children,params}:{children:ReactNode;params:Promise<{locale:string}>}){
 const {locale}=await params;
 const session=await getAdminSession();
 if(!session)redirect(`/${locale}/admin/login`);
 return <AdminShell locale={locale} user={{email:session.email,role:session.role||'Administrator',avatar:session.avatar||''}}>{children}</AdminShell>;
}
