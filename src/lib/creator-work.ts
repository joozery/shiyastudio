export const workStatuses={accepted:'รับงานแล้ว',in_progress:'กำลังทำงาน',delivered:'ส่งงานแล้ว',missed:'ไม่ส่งงาน',cancelled:'ยกเลิก'};
export type CreatorWork={id:string;campaign:string;brand:string;acceptedDate:string;dueDate:string;productReceived:boolean;receivedDate:string;status:keyof typeof workStatuses;notes:string;evidenceUrl:string;createdAt:string;createdBy:string;updatedAt:string;updatedBy:string};
export type CreatorWorkStats={total:number;delivered:number;missed:number;productOutstanding:number};
export type CreatorBlacklist={active:boolean;reason:string;updatedAt:string;updatedBy:string};
export type CreatorWorkDetail={creatorId:string;author:string;profileStatus:string;records:CreatorWork[];stats:CreatorWorkStats;blacklist:CreatorBlacklist|null};
export const emptyWorkStats:CreatorWorkStats={total:0,delivered:0,missed:0,productOutstanding:0};
export function isWorkOverdue(record:CreatorWork,today:string){return !!record.dueDate&&record.dueDate<today&&['accepted','in_progress'].includes(record.status)}
