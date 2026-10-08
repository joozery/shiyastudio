export default function AdminLoading({label='กำลังโหลดข้อมูล…'}:{label?:string}){
 return <div className="admin-loading" role="status"><p>{label}</p><div className="admin-loading-heading"/><div className="admin-loading-grid">{[0,1,2].map(index=><div key={index}/>)}</div></div>;
}
