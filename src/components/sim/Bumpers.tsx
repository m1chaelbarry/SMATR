import {useState} from 'react';
import {bumperGeometry} from '../../models/bumpers';
export default function Bumpers(){
  const [lengths,change]=useState([100,120,100]),[direction,setDirection]=useState<-1|1>(-1),[index,setIndex]=useState(0);
  let geometry;let error='';try{geometry=bumperGeometry(lengths,direction);}catch(e){error=(e as Error).message;}
  const g=geometry;const current=g?.table[index]??0;
  const positions=g?[...g.bumpers.map(z=>z+current),0,55,110,165]:[0,165];
  const min=Math.min(...positions)-40,max=Math.max(...positions)+40;
  const px=(value:number)=>45+(value-min)/(max-min)*505;
  return <section className="simulator" aria-label="Kalkulator zderzaków"><h2>2. Zderzaki i współrzędne</h2><p>Łączniki stoją w a=0,55,110,165 mm. Zderzaki mają współrzędne z na poruszającym się stole. Warunek kontaktu: x+z=a.</p>
    <div className="controls">{lengths.map((v,i)=><label key={i}>Odcinek {i+1} [mm]<input type="number" min="1" max="1000" step="1" value={Number.isNaN(v)?'':v} onChange={e=>{const next=[...lengths];next[i]=e.target.valueAsNumber;change(next);}}/></label>)}</div>
    <div className="controls"><label>Kierunek pierwszych odcinków<select value={direction} onChange={e=>setDirection(Number(e.target.value) as -1|1)}><option value={-1}>← w lewo, x maleje</option><option value={1}>→ w prawo, x rośnie</option></select></label><button onClick={()=>{change([100,120,100]);setDirection(-1);}}>100–120–100</button><button onClick={()=>{change([80,140,60]);setDirection(-1);}}>80–140–60</button></div>
    {error?<p role="alert" className="note error">{error}</p>:g&&<>
      <div className="controls"><label>Moment kontaktu<select value={index} onChange={e=>setIndex(Number(e.target.value))}>{g.table.map((x,i)=><option key={i} value={i}>{i+1}ŁD · x={x} mm</option>)}</select></label></div>
      <svg viewBox="0 0 600 250" role="img" aria-label={`Rozmieszczenie przy kontakcie ${index+1}ŁD`}>
        {g.bumpers.map((z,i)=><g key={i}><path d={`M45 ${50+i*48}H555`} stroke="#dbe1eb"/><rect x={px(i*55)-5} y={30+i*48} width="10" height="40" fill="#172033"/><text x={px(i*55)+10} y={30+i*48} fontSize="12">{i+1}ŁD</text><circle cx={px(z+current)} cy={50+i*48} r="8" fill={i===index?'#047857':'#1d4ed8'}/><text x={px(z+current)-10} y={66+i*48} textAnchor="end" fontSize="12">z{i+1}+x</text></g>)}
      </svg><p className="limits">Każdy wiersz pokazuje osobną parę zderzak–łącznik; położenie czarnego łącznika jest stałe. Zielony kontakt oznacza równość współrzędnych.</p>
      <div className="table-scroll"><table><thead><tr><th>Kontakt</th><th>a [mm]</th><th>x [mm]</th><th>z=a−x [mm]</th></tr></thead><tbody>{g.table.map((x,i)=><tr key={i} className={i===index?'active-row':''}><td>{i+1}ŁD</td><td>{i*55}</td><td>{x}</td><td>{g.bumpers[i]}</td></tr>)}</tbody></table></div>
      <p className="explain" aria-live="polite">Odstępy kolejnych zderzaków: <strong>{g.spacing.join(' · ')} mm</strong>. Kontakt {index+1}: z={index*55}−({current})={g.bumpers[index]} mm. {direction===1?'W tym układzie osi część współrzędnych i różnic jest ujemna; długość odległości jest wartością bezwzględną.':''}</p>
    </>}<p className="limits">Rysunek instrukcji 1, s. 8. Nie dodawaj automatycznie 55 mm bez ustalenia znaku ruchu. Kalkulator rozwiązuje geometrię punktów, nie dobiera szerokości zderzaków.</p>
  </section>;
}
