import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card from "../components/ui/Card";
import { generateMonthGrid } from "../utils/calendarUtils";
const names = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function Calendar() {
  const { assessments, calendarEvents, addCalendarEvent, updateCalendarEvent, removeCalendarEvent } = useOutletContext();
  const now = new Date(), [year,setYear]=useState(now.getFullYear()), [month,setMonth]=useState(now.getMonth());
  const [form,setForm]=useState({title:"",date:new Date().toISOString().slice(0,10),kind:"note",notes:""}); const [error,setError]=useState("");
  const entries=[...assessments.map(a=>({...a,date:a.dueDate,source:"assessment",title:`${a.type} #${a.number}`,kind:a.type})),...calendarEvents.map(e=>({...e,source:"event"}))];
  const monthEntries=entries.filter(e=>{const d=new Date(`${e.date}T00:00:00`);return d.getFullYear()===year&&d.getMonth()===month;}).sort((a,b)=>a.date.localeCompare(b.date));
  const dueDays=new Set(monthEntries.map(e=>new Date(`${e.date}T00:00:00`).getDate()));
  async function submit(e){e.preventDefault();setError("");try{await addCalendarEvent(form);setForm({...form,title:"",notes:""});}catch(err){setError(err.message);}}
  function step(n){const d=new Date(year,month+n,1);setYear(d.getFullYear());setMonth(d.getMonth());}
  return <section><h1 className="text-2xl font-display text-ink mb-6">Calendar</h1>
    <Card title="Add a note or study reminder" accentColor="border-moss"><form onSubmit={submit} className="grid md:grid-cols-4 gap-3"><input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" className="input"/><input type="date" required value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className="input"/><select value={form.kind} onChange={e=>setForm({...form,kind:e.target.value})} className="input"><option value="note">Note</option><option value="study">Study session</option><option value="reminder">Reminder</option></select><button className="bg-moss text-paper rounded font-mono text-sm">Save to calendar</button><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Notes (optional)" className="input md:col-span-4"/></form>{error&&<p className="text-stamp text-sm mt-2">{error}</p>}</Card>
    <div className="flex items-center gap-4 my-4"><button onClick={()=>step(-1)} className="button">← Prev</button><span className="font-display text-lg min-w-[180px] text-center">{names[month]} {year}</span><button onClick={()=>step(1)} className="button">Next →</button></div>
    <Card accentColor="border-ink"><table className="w-full text-center font-mono text-sm"><thead><tr>{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=><th key={d} className="pb-3 font-normal text-slate">{d}</th>)}</tr></thead><tbody>{generateMonthGrid(year,month).map((week,i)=><tr key={i}>{week.map((day,j)=><td key={j} className="py-1.5">{day&&<span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${dueDays.has(day)?"bg-stamp/15 text-stamp font-semibold":"text-ink/70"}`}>{day}</span>}</td>)}</tr>)}</tbody></table></Card>
    <Card title={`Schedule · ${names[month]} ${year}`} accentColor="border-stamp" className="mt-6">{monthEntries.length? <ul className="space-y-3">{monthEntries.map(item=><li key={`${item.source}-${item.id}`} className="border-b border-slate/10 pb-3 last:border-0"><div className="flex gap-3"><span className="font-mono text-xs text-slate">{item.date}</span><span className="stamp-badge">{item.source==="assessment"?item.module:item.kind}</span><span className="text-sm">{item.title}</span>{item.source==="event"&&<button onClick={()=>removeCalendarEvent(item.id)} className="ml-auto text-xs text-stamp">Remove</button>}</div>{item.source==="event"&&<textarea aria-label={`Notes for ${item.title}`} value={item.notes} onChange={e=>updateCalendarEvent(item.id,{...item,notes:e.target.value})} className="input w-full mt-2 text-sm" />}</li>)}</ul>:<p className="text-slate text-sm">Nothing scheduled this month.</p>}</Card>
  </section>;
}
