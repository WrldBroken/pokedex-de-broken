const TYPE_COLORS = {'Planta':'#62be4f','Veneno':'#ac42b1','Fuego':'#f77724','Volador':'#9b7bdb','Agua':'#568fea','Bicho':'#94b81d','Normal':'#c2bc91','Eléctrico':'#eebd24','Tierra':'#cba945','Psíquico':'#e55386','Lucha':'#cf4038','Roca':'#b69a35','Hielo':'#77d3d7','Fantasma':'#7560aa','Dragón':'#6545c9','Siniestro':'#725849','Acero':'#9ba6bf'};
const TYPE_EN = {'grass':'Planta','poison':'Veneno','fire':'Fuego','flying':'Volador','water':'Agua','bug':'Bicho','normal':'Normal','electric':'Eléctrico','ground':'Tierra','psychic':'Psíquico','fighting':'Lucha','rock':'Roca','ice':'Hielo','ghost':'Fantasma','dragon':'Dragón','dark':'Siniestro','steel':'Acero','fairy':'Hada'};
const grid = document.querySelector('#grid'), search = document.querySelector('#search'), region = document.querySelector('#region'), typeFilter = document.querySelector('#type'), results = document.querySelector('#results'), backdrop = document.querySelector('#backdrop'), body = document.querySelector('#detail-body');
const apiCache = new Map();
const idText = id => '#'+String(id).padStart(3,'0');
const spriteUrl = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
const escapeHTML = (s) => String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const pill = type => `<span class="type-pill ${type==='Normal'?'normal':''}" style="background:${TYPE_COLORS[type]||'#7a91b0'}">${escapeHTML(type)}</span>`;
const typePills = arr => `<div class="types">${arr.map(pill).join('')}</div>`;
const nameNorm = s => s.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function renderGrid(){
  const term=nameNorm(search.value.trim().replace(/^#/,'')).replace(/^0+(?=\d)/,'');
  const list=POKEMON.filter(p=>{
    if(region.value==='kanto'&&p.id>151)return false;
    if(region.value==='johto'&&(p.id<152||p.id>251))return false;
    if(region.value==='hoenn'&&p.id<252)return false;
    if(typeFilter.value!=='all'&&!p.types.includes(typeFilter.value))return false;
    return !term||nameNorm(p.name).includes(term)||String(p.id).includes(term);
  });
  results.textContent=`Mostrando ${list.length} de ${POKEMON.length} Pokémon`;
  grid.innerHTML=list.map(p=>`<button class="poke-card" data-id="${p.id}" style="--tint:${TYPE_COLORS[p.types[0]]}" aria-label="Ver ficha de ${escapeHTML(p.name)}"><img class="sprite" src="${spriteUrl(p.id)}" loading="lazy" alt="" onerror="this.style.opacity='.15'"><div class="card-content"><span class="dex-number">${idText(p.id)}</span><div class="pokemon-name">${escapeHTML(p.name)}</div>${typePills(p.types)}</div></button>`).join('');
}
for(const t of Object.keys(TYPE_COLORS)){let opt=document.createElement('option');opt.value=t;opt.textContent=t;typeFilter.append(opt)}
[search,region,typeFilter].forEach(el=>el.addEventListener(el===search?'input':'change',renderGrid));
grid.addEventListener('click',e=>{const card=e.target.closest('[data-id]');if(card)openPokemon(Number(card.dataset.id))});
function info(label,value){return `<div class="info-box"><span>${label}</span><strong>${value??'—'}</strong></div>`}
function statsBlock(data){
 if(!data)return `<p class="placeholder">Las estadísticas detalladas se cargarán desde PokéAPI al abrir esta ficha con conexión a Internet.</p>`;
 const labels=['PS','Ataque','Defensa','At. Esp.','Def. Esp.','Velocidad'];
 return `${data.map((n,i)=>`<div class="stat-line"><span>${labels[i]}</span><b>${n}</b><div class="stat-bar"><i style="width:${Math.min(n/255*100,100)}%"></i></div></div>`).join('')}<p class="note">Total: <b>${data.reduce((a,b)=>a+b,0)}</b> · Estadísticas base Pokémon.</p>`;
}
function radar(stats){
 if(!stats)return '';
 const cx=96,cy=88,r=66,point=(idx,value)=>{const a=-Math.PI/2+idx*2*Math.PI/6;return `${(cx+Math.cos(a)*r*value).toFixed(1)},${(cy+Math.sin(a)*r*value).toFixed(1)}`};
 const rings=[.33,.66,1].map(v=>`<polygon points="${Array.from({length:6},(_,i)=>point(i,v)).join(' ')}" fill="none" stroke="#ffffff4b" stroke-width="1"/>`).join('');
 return `<svg class="radar" viewBox="0 0 196 174" aria-label="Gráfico de estadísticas">${rings}<polygon points="${stats.map((v,i)=>point(i,Math.max(.06,Math.min(v/170,1)))).join(' ')}" fill="#afff8a8f" stroke="#d5ff9e" stroke-width="2"/></svg>`;
}
const bulbMoves = [
[1,'Tackle','Normal','Físico',35,'95%'],[4,'Growl','Normal','Estado','—','100%'],[7,'Leech Seed','Planta','Estado','—','90%'],[10,'Vine Whip','Planta','Físico',45,'100%'],[15,'Poisonpowder','Veneno','Estado','—','75%'],[15,'Sleep Powder','Planta','Estado','—','75%'],[20,'Razor Leaf','Planta','Físico',55,'95%'],[25,'Sweet Scent','Normal','Estado','—','100%'],[32,'Growth','Normal','Estado','—','—'],[39,'Synthesis','Planta','Estado','—','—'],[46,'Solarbeam','Planta','Especial',120,'100%']
];
function tableMoves(rows){return `<div class="table-wrap"><table><thead><tr><th>Nivel</th><th>Movimiento</th><th>Tipo</th><th>Categoría</th><th>Potencia</th><th>Precisión</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td><b>${escapeHTML(r[1])}</b></td><td>${pill(r[2])}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td></tr>`).join('')}</tbody></table></div>`}
function evoBlock(ids, current){return `<div class="evo-row">${ids.map((id,i)=>`${i?'<span class="evo-arrow">➜</span>':''}<button class="evo-card" data-switch="${id}" style="color:#fff;cursor:pointer;${id===current?'border-color:#cfe582':''}"><img src="${spriteUrl(id)}" alt=""><strong>${escapeHTML(POKEMON[id-1].name)}</strong>${id===2?'<small>Nivel 16</small>':id===3?'<small>Nivel 32</small>':''}</button>`).join('')}</div>`}
const knownBulb={stats:[45,49,49,65,65,45],height:'0,7 m',weight:'6,9 kg',species:'Semilla',gender:'12,1% hembra',base_exp:'64',training:'20.000',reference:'₽ 43.000 en nivel 50',growth:'Medio lento',breeding:'Puede criar'};
let selectedId=1,selectedTab='Resumen',lastFocus=null,currentData=null;
const tabs=['Resumen','Movimientos','Evolución','Dónde cazar','Objetos'];
function showTab(tab){selectedTab=tab;renderDetailContent()}
function renderDetailContent(){
 const p=POKEMON[selectedId-1],isBulb=selectedId===1,d=currentData;
 const basic=d?{
 stats:d.stats.map(x=>x.base_stat),height:(d.height/10).toLocaleString('es-CO')+' m',weight:(d.weight/10).toLocaleString('es-CO')+' kg',base_exp:String(d.base_experience??'—')
 }:null;
 const known=isBulb?knownBulb:basic;
 const relevantStats=known?.stats||null;
 let inner='';
 if(selectedTab==='Resumen'){
 inner=`<div class="section-grid"><section class="panel"><h3>◆ Información general</h3><div class="info-grid">${info('N.º nacional',idText(p.id))}${info('Especie',known?.species||'Sin verificar')}${info('Altura',known?.height||'Por consultar')}${info('Peso',known?.weight||'Por consultar')}${info('Género',known?.gender||'Sin verificar')}${info('EXP base al derrotarlo',known?.base_exp||'Por consultar')}${info('1.ª captura (EXP de entrenador)',known?.training||'Sin verificar')}${info('Valor de referencia',known?.reference||'Sin verificar')}${info('Crecimiento',known?.growth||'Sin verificar')}${info('Crianza',known?.breeding||'Sin verificar')}</div></section><section class="panel"><h3>◆ Estadísticas base</h3>${statsBlock(relevantStats)}<p class="note">Las cifras del juego pueden variar según sus reglas, nivel, IVs y naturaleza.</p></section><section class="panel"><h3>◆ Debilidades y resistencias</h3><p class="muted">Tipos del Pokémon:</p>${typePills(p.types)}<p class="note">La tabla de efectividades se añadirá en la siguiente etapa.</p></section><section class="panel"><h3>◆ Evolución</h3>${isBulb?evoBlock([1,2,3],p.id):'<p class="placeholder">Cadena evolutiva pendiente de completar para este Pokémon.</p>'}</section></div>`;
 }else if(selectedTab==='Movimientos'){
 const rows=isBulb?bulbMoves:d?d.moves.filter(x=>x.version_group_details.some(v=>v.move_learn_method.name==='level-up'&&v.version_group.name==='emerald')).map(x=>{const m=x.version_group_details.find(v=>v.move_learn_method.name==='level-up'&&v.version_group.name==='emerald');return [m.level_learned_at,x.move.name.replaceAll('-',' '),'—','—','—','—']}).sort((a,b)=>a[0]-b[0]):[];
 inner=`<section class="panel"><h3>◆ Movimientos por nivel</h3>${rows.length?tableMoves(rows):'<p class="placeholder">Sin movimientos verificados todavía. Con conexión a Internet se intentan consultar los movimientos por nivel de Pokémon Esmeralda.</p>'}<p class="note">Para Bulbasaur se copiaron los movimientos mostrados en tus capturas. Para otros Pokémon, los datos de PokéAPI (si cargan) son de referencia y pueden diferir de PokéAFK.</p></section>`;
 }else if(selectedTab==='Evolución'){
 inner=`<section class="panel"><h3>◆ Evolución</h3>${isBulb?evoBlock([1,2,3],p.id):'<p class="placeholder">La línea evolutiva exacta y los niveles de PokéAFK para este Pokémon se añadirán conforme recopilemos más fichas.</p>'}</section>`;
 }else if(selectedTab==='Dónde cazar'){
 inner=`<section class="panel"><h3>◆ Dónde cazar</h3>${isBulb?'<div class="info-box"><span>Ubicación confirmada en tus capturas</span><strong>Bulbasaur · Ruta 9 · Kanto · Hierba · Niveles 25–30</strong></div>':'<p class="placeholder">Todavía no tenemos capturas que confirmen las rutas de este Pokémon en PokéAFK.</p>'}<p class="note">Las ubicaciones de otros juegos Pokémon no se usarán como si fueran rutas de PokéAFK.</p></section>`;
 }else{
 inner=`<section class="panel"><h3>◆ Objetos al derrotarlo</h3>${isBulb?`<div class="info-grid">${[['Ramillete de Hojas','15,3%'],['Semilla Milagro','12,5%'],['Baya Pinia','10%'],['Parte Verde','0,6%'],['Polvoestelar','2,9%'],['Piedra Hoja','0,3%']].map(([item,percent])=>info(item,percent)).join('')}</div>`:'<p class="placeholder">Todavía no tenemos capturas que confirmen los objetos y probabilidades de este Pokémon en PokéAFK.</p>'}<p class="note">Los porcentajes se muestran únicamente cuando aparecen en las capturas.</p></section>`;
 }
 const hero=`<div class="detail-hero"><div class="hero-img-wrap"><img class="hero-img" src="${spriteUrl(p.id)}" alt="Sprite de ${escapeHTML(p.name)}"></div><div class="hero-copy"><span class="species">${idText(p.id)} · ${known?.species||'Pokémon'}</span><h2 id="detail-name">${escapeHTML(p.name)}</h2>${typePills(p.types)}<p>${isBulb?'Primera etapa de su línea evolutiva':'Pokédex de Kanto, Johto y Hoenn'}</p><div class="hero-buttons"><button id="previous" ${p.id===1?'disabled':''}>← Anterior</button><button id="next" ${p.id===386?'disabled':''}>Siguiente →</button></div></div>${radar(relevantStats)}</div>`;
 body.innerHTML=hero+`<nav class="tabs" aria-label="Secciones de la ficha">${tabs.map(t=>`<button class="tab ${selectedTab===t?'active':''}" data-tab="${t}">${t}</button>`).join('')}</nav><div id="tabcontent">${inner}</div>`;
}
async function getApiData(id){
 if(apiCache.has(id))return apiCache.get(id);
 try{const response=await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`,{signal:AbortSignal.timeout(9000)});if(!response.ok)throw Error('No disponible');const data=await response.json();apiCache.set(id,data);return data}catch{return null}
}
async function openPokemon(id,keepFocus=false){
 if(!keepFocus)lastFocus=document.activeElement;
 selectedId=id;selectedTab='Resumen';currentData=null;
 backdrop.hidden=false;document.body.style.overflow='hidden';renderDetailContent();
 if(!keepFocus)document.querySelector('#close').focus();
 const requestedId=id;
 const data=await getApiData(id);
 if(!backdrop.hidden&&selectedId===requestedId){currentData=data;renderDetailContent()}
}
function closeModal(){backdrop.hidden=true;document.body.style.overflow='';if(lastFocus?.isConnected)lastFocus.focus()}
backdrop.addEventListener('click',e=>{if(e.target===backdrop||e.target.closest('#close'))closeModal();const tab=e.target.closest('[data-tab]');if(tab)showTab(tab.dataset.tab);const swap=e.target.closest('[data-switch]');if(swap)openPokemon(Number(swap.dataset.switch),true);if(e.target.closest('#previous')&&selectedId>1)openPokemon(selectedId-1,true);if(e.target.closest('#next')&&selectedId<386)openPokemon(selectedId+1,true)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!backdrop.hidden)closeModal()});
renderGrid();
