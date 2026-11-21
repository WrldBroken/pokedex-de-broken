/* Pokédex de Broken: los 386 nombres y tipos básicos viven en pokemon-data.js.
   Datos oficiales ampliados: https://pokeapi.co/ (consultados al abrir cada ficha).
   No se usan rutas, objetos, precios ni estadísticas particulares de PokéAFK. */
'use strict';

const TYPE_COLORS = {
  Normal:'#b8b5a1', Fuego:'#ef8130', Agua:'#6198e9', Eléctrico:'#ebc432', Planta:'#63bf52',
  Hielo:'#78cbd5', Lucha:'#d34f4b', Veneno:'#a75ec5', Tierra:'#c6a35d', Volador:'#9e8be3',
  Psíquico:'#e76c98', Bicho:'#9cb92b', Roca:'#b6a36b', Fantasma:'#7b69b1', Dragón:'#7863d6',
  Siniestro:'#736476', Acero:'#92a7ba', Hada:'#ef9dd2'
};
const TYPE_EN = {
  normal:'Normal',fire:'Fuego',water:'Agua',electric:'Eléctrico',grass:'Planta',ice:'Hielo',
  fighting:'Lucha',poison:'Veneno',ground:'Tierra',flying:'Volador',psychic:'Psíquico',
  bug:'Bicho',rock:'Roca',ghost:'Fantasma',dragon:'Dragón',dark:'Siniestro',steel:'Acero',fairy:'Hada'
};
const ATTACK = {
  Normal:[[],['Roca','Acero'],['Fantasma']],
  Fuego:[['Planta','Hielo','Bicho','Acero'],['Fuego','Agua','Roca','Dragón'],[]],
  Agua:[['Fuego','Tierra','Roca'],['Agua','Planta','Dragón'],[]],
  Eléctrico:[['Agua','Volador'],['Eléctrico','Planta','Dragón'],['Tierra']],
  Planta:[['Agua','Tierra','Roca'],['Fuego','Planta','Veneno','Volador','Bicho','Dragón','Acero'],[]],
  Hielo:[['Planta','Tierra','Volador','Dragón'],['Fuego','Agua','Hielo','Acero'],[]],
  Lucha:[['Normal','Hielo','Roca','Siniestro','Acero'],['Veneno','Volador','Psíquico','Bicho','Hada'],['Fantasma']],
  Veneno:[['Planta','Hada'],['Veneno','Tierra','Roca','Fantasma'],['Acero']],
  Tierra:[['Fuego','Eléctrico','Veneno','Roca','Acero'],['Planta','Bicho'],['Volador']],
  Volador:[['Planta','Lucha','Bicho'],['Eléctrico','Roca','Acero'],[]],
  Psíquico:[['Lucha','Veneno'],['Psíquico','Acero'],['Siniestro']],
  Bicho:[['Planta','Psíquico','Siniestro'],['Fuego','Lucha','Veneno','Volador','Fantasma','Acero','Hada'],[]],
  Roca:[['Fuego','Hielo','Volador','Bicho'],['Lucha','Tierra','Acero'],[]],
  Fantasma:[['Psíquico','Fantasma'],['Siniestro'],['Normal']],
  Dragón:[['Dragón'],['Acero'],['Hada']],
  Siniestro:[['Psíquico','Fantasma'],['Lucha','Siniestro','Hada'],[]],
  Acero:[['Hielo','Roca','Hada'],['Fuego','Agua','Eléctrico','Acero'],[]],
  Hada:[['Lucha','Dragón','Siniestro'],['Fuego','Veneno','Acero'],[]]
};
const STATS = [
  ['hp','PS'],['attack','Ataque'],['defense','Defensa'],
  ['special-attack','At. especial'],['special-defense','Def. especial'],['speed','Velocidad']
];
const VERSION_LABELS = {
  'red-blue':'Rojo / Azul','yellow':'Amarillo','gold-silver':'Oro / Plata','crystal':'Cristal',
  'ruby-sapphire':'Rubí / Zafiro', 'emerald':'Esmeralda','firered-leafgreen':'Rojo Fuego / Verde Hoja',
  'diamond-pearl':'Diamante / Perla','platinum':'Platino','heartgold-soulsilver':'Oro HeartGold / Plata SoulSilver',
  'black-white':'Negro / Blanco','black-2-white-2':'Negro 2 / Blanco 2','x-y':'X / Y',
  'omega-ruby-alpha-sapphire':'Rubí Omega / Zafiro Alfa','sun-moon':'Sol / Luna',
  'ultra-sun-ultra-moon':'Ultrasol / Ultraluna','sword-shield':'Espada / Escudo',
  'brilliant-diamond-and-shining-pearl':'Diamante Brillante / Perla Reluciente',
  'scarlet-violet':'Escarlata / Púrpura', "lets-go-pikachu-lets-go-eevee":"Let's Go"
};
const METHODS = {'level-up':'Por nivel','machine':'Máquina (MT/MO)','tutor':'Tutor','egg':'Movimiento huevo'};
const GROWTH = {'slow':'Lento','medium':'Medio','fast':'Rápido','medium-slow':'Medio lento',
  'slow-then-very-fast':'Errático','fast-then-very-slow':'Fluctuante'};
const EGG_GROUPS = {'monster':'Monstruo','water1':'Agua 1','water2':'Agua 2','water3':'Agua 3',
  'bug':'Bicho','flying':'Volador','field':'Campo','fairy':'Hada','grass':'Planta',
  'human-like':'Humanoide','mineral':'Mineral','amorphous':'Amorfo','dragon':'Dragón',
  'ditto':'Ditto','no-eggs':'Sin crianza'};
const ITEM_TRANSLATIONS = {
  'water-stone':'Piedra Agua','fire-stone':'Piedra Fuego','thunder-stone':'Piedra Trueno',
  'leaf-stone':'Piedra Hoja','moon-stone':'Piedra Lunar','sun-stone':'Piedra Solar',
  'shiny-stone':'Piedra Día','dusk-stone':'Piedra Noche','dawn-stone':'Piedra Alba',
  'ice-stone':'Piedra Hielo','oval-stone':'Piedra Oval','kings-rock':'Roca del Rey',
  'metal-coat':'Revestimiento Metálico','dragon-scale':'Escama Dragón','upgrade':'Mejora',
  'deep-sea-tooth':'Diente Marino','deep-sea-scale':'Escama Marina','prism-scale':'Escama Bella',
  'protector':'Protector','electirizer':'Electrizador','magmarizer':'Magmatizador','razor-claw':'Garra Afilada',
  'razor-fang':'Colmillo Agudo','reaper-cloth':'Tela Terrible','dubious-disc':'Disco Extraño'
};

const $ = selector => document.querySelector(selector);
const grid = $('#grid'), search = $('#search'), region = $('#region'), typeFilter = $('#type');
const results = $('#results'), backdrop = $('#backdrop'), detailBody = $('#detail-body');
const idText = id => `#${String(id).padStart(3,'0')}`;
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm = s => String(s).toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const capitalize = s => s ? s[0].toUpperCase()+s.slice(1) : '';
const pretty = slug => capitalize(String(slug||'').replaceAll('-',' '));
const localPokemon = id => POKEMON[id-1];
const imgUrl = (id, shiny=false) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shiny?'shiny/':''}${id}.png`;
const typePill = name => `<span class="type-pill" style="background:${TYPE_COLORS[name]||'#8799af'};${name==='Normal'?'color:#1c2932':''}">${escapeHTML(name)}</span>`;
const typePills = names => `<div class="types">${(names||[]).map(typePill).join('')}</div>`;
const numberFormat = number => Number(number).toLocaleString('es-CO');
const genderText = rate => rate < 0 ? 'Sin género' : `${(100*(8-rate)/8).toLocaleString('es-CO')}% macho · ${(100*rate/8).toLocaleString('es-CO')}% hembra`;
function info(label,value){return `<div class="info-box"><span>${escapeHTML(label)}</span><strong>${value==null?'—':escapeHTML(value)}</strong></div>`}

/* Cache persistente de datos públicos consultados en PokéAPI. No guarda información personal. */
let dbPromise;
function db(){
  if(dbPromise)return dbPromise;
  if(!('indexedDB' in window))return Promise.resolve(null);
  dbPromise=new Promise(resolve=>{
    try {
      const req=indexedDB.open('broken-pokedex-api-v2',1);
      req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('responses'))req.result.createObjectStore('responses')};
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>resolve(null);
      req.onblocked=()=>resolve(null);
    }catch{resolve(null)}
  });
  return dbPromise;
}
async function readCache(key){
  const database=await db();if(!database)return null;
  return new Promise(resolve=>{
    try{const req=database.transaction('responses','readonly').objectStore('responses').get(key);
      req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>resolve(null)
    }catch{resolve(null)}
  });
}
async function writeCache(key,data){
  const database=await db();if(!database)return;
  try{database.transaction('responses','readwrite').objectStore('responses').put(data,key)}catch{}
}
const apiPromises=new Map();
async function apiGet(endpoint){
  const url=endpoint.startsWith('https://')?endpoint:`https://pokeapi.co/api/v2/${endpoint.replace(/^\//,'')}`;
  if(!url.startsWith('https://pokeapi.co/api/v2/'))throw Error('Origen de datos no admitido');
  if(apiPromises.has(url))return apiPromises.get(url);
  const task=(async()=>{
    const cached=await readCache(url);
    if(cached)return cached;
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),15000);
    try{
      const response=await fetch(url,{signal:controller.signal});
      if(!response.ok)throw Error(`Error HTTP ${response.status}`);
      const json=await response.json();
      await writeCache(url,json);
      return json;
    }finally{clearTimeout(timeout)}
  })();
  apiPromises.set(url,task);
  try{return await task}catch(e){apiPromises.delete(url);throw e}
}

function drawGrid(){
  const term=norm(search.value.trim().replace(/^#/,'')).replace(/^0+(?=\d)/,'');
  const shown=POKEMON.filter(p=>{
    if(region.value==='kanto'&&p.id>151)return false;
    if(region.value==='johto'&&(p.id<152||p.id>251))return false;
    if(region.value==='hoenn'&&p.id<252)return false;
    if(typeFilter.value!=='all'&&!p.types.includes(typeFilter.value))return false;
    return !term||norm(p.name).includes(term)||String(p.id).includes(term);
  });
  results.textContent=`Mostrando ${shown.length} de 386 Pokémon`;
  grid.innerHTML=shown.map(p=>`<button type="button" class="poke-card" data-id="${p.id}" style="--tint:${TYPE_COLORS[p.types[0]]}" aria-label="Ver ficha de ${escapeHTML(p.name)}"><img class="sprite" src="${imgUrl(p.id)}" alt="" loading="lazy" onerror="this.style.opacity='.17'"><div class="card-content"><span class="dex-number">${idText(p.id)}</span><span class="pokemon-name">${escapeHTML(p.name)}</span>${typePills(p.types)}</div></button>`).join('')||'<p class="empty-grid">No se encontraron Pokémon con esos filtros.</p>';
}
for(const type of Object.keys(TYPE_COLORS))typeFilter.add(new Option(type,type));
[search,region,typeFilter].forEach(el=>el.addEventListener(el===search?'input':'change',drawGrid));
grid.addEventListener('click',e=>{const card=e.target.closest('[data-id]');if(card)openPokemon(Number(card.dataset.id))});

let active=null,activeTab='Resumen',lastFocus=null,openSequence=0;
const TABS=['Resumen','Estadísticas','Tipos','Evolución','Movimientos'];
function getStats(pokemon){
  if(!pokemon)return null;
  return STATS.map(([name])=>pokemon.stats.find(s=>s.stat.name===name)?.base_stat??0);
}
function radar(stats){
  if(!stats)return '';
  const point=(i,mult)=>{const a=(-Math.PI/2)+(i*Math.PI/3);return `${(90+Math.cos(a)*67*mult).toFixed(1)},${(90+Math.sin(a)*67*mult).toFixed(1)}`};
  const rings=[.33,.66,1].map(v=>`<polygon points="${Array.from({length:6},(_,i)=>point(i,v)).join(' ')}" fill="none" stroke="#ffffff60" stroke-width="1"/>`).join('');
  const axes=Array.from({length:6},(_,i)=>`<line x1="90" y1="90" x2="${point(i,1).split(',')[0]}" y2="${point(i,1).split(',')[1]}" stroke="#ffffff35" />`).join('');
  return `<svg class="radar" viewBox="0 0 180 180" role="img" aria-label="Gráfico radial de estadísticas base">${rings}${axes}<polygon points="${stats.map((s,i)=>point(i,Math.min(s/175,1))).join(' ')}" fill="#9df5a95c" stroke="#9df5a9" stroke-width="2"/></svg>`;
}
function apiTypes(){
  if(active?.pokemon?.types)return active.pokemon.types.map(t=>TYPE_EN[t.type.name]||pretty(t.type.name));
  return localPokemon(active.id).types;
}
function languageText(items, field='name'){
  return items?.find(x=>x.language?.name==='es')?.[field]||null;
}
function currentDescription(){
  const entries=active.species?.flavor_text_entries?.filter(x=>x.language.name==='es')||[];
  const entry=entries.at(-1)||null;
  return entry ? entry.flavor_text.replace(/[\n\f\r]+/g,' ').replace(/\s+/g,' ').trim() : '';
}
function loading(text='Consultando datos oficiales de PokéAPI...'){
  return `<div class="load-state"><span class="loader" aria-hidden="true"></span>${escapeHTML(text)}</div>`;
}
function apiAlert(){
  return `<div class="api-alert">No pudimos cargar todos los datos de PokéAPI. Comprueba tu conexión y pulsa <button type="button" data-retry="true">Reintentar</button>. Los nombres y tipos del catálogo siguen disponibles.</div>`;
}
function statsSummary(){
  const stats=getStats(active.pokemon);
  if(!stats)return active.error?apiAlert():loading('Cargando estadísticas...');
  return `<div class="stat-summary">${STATS.map(([,label],i)=>`<div class="stat-line"><span>${label}</span><b>${stats[i]}</b><div class="stat-bar"><i style="width:${Math.min(stats[i]/180*100,100)}%"></i></div></div>`).join('')}<div class="stat-total">Total base <strong>${numberFormat(stats.reduce((a,b)=>a+b,0))}</strong></div></div>`;
}
function abilitySection(){
  if(!active.pokemon)return active.error?'No disponible':'Consultando...';
  const abilities=active.pokemon.abilities||[];
  return abilities.length?`<div class="ability-list">${abilities.map(a=>`<div class="ability-item"><strong>${escapeHTML(active.abilityNames.get(a.ability.name)||pretty(a.ability.name))}</strong>${a.is_hidden?'<span class="ability-hidden">Oculta</span>':'<span class="ability-regular">Normal</span>'}</div>`).join('')}</div>`:'Sin habilidades registradas';
}
function summaryTab(){
  const p=active.pokemon,s=active.species,hasData=Boolean(p&&s);
  return `<div class="section-grid">
   <section class="panel"><h3>◆ Información general</h3><div class="info-grid">
     ${info('N.º Nacional',idText(active.id))}
     ${info('Especie',s?languageText(s.genera,'genus')||'Pokémon':'Consultando...')}
     ${info('Altura',p?`${(p.height/10).toLocaleString('es-CO')} m`:'Consultando...')}
     ${info('Peso',p?`${(p.weight/10).toLocaleString('es-CO')} kg`:'Consultando...')}
     ${info('Género',s?genderText(s.gender_rate):'Consultando...')}
     ${info('Experiencia base',p?p.base_experience:'Consultando...')}
     ${info('Crecimiento',s?GROWTH[s.growth_rate?.name]||pretty(s.growth_rate?.name):'Consultando...')}
     ${info('Tasa de captura',s?`${s.capture_rate} / 255`:'Consultando...')}
     ${info('Grupos huevo',s?s.egg_groups.map(g=>EGG_GROUPS[g.name]||pretty(g.name)).join(', '):'Consultando...')}
     ${info('Clasificación',s?(s.is_mythical?'Singular':s.is_legendary?'Legendario':'Ordinario'):'Consultando...')}
   </div>${active.error?apiAlert():!hasData?'<p class="note">Algunos datos todavía se están cargando.</p>':''}</section>
   <section class="panel"><h3>◆ Estadísticas base</h3>${statsSummary()}<button type="button" class="text-action" data-tab="Estadísticas">Ver detalles de las estadísticas →</button></section>
   <section class="panel"><h3>◆ Habilidades</h3>${abilitySection()}<p class="note">La habilidad oculta se indica cuando PokéAPI la identifica.</p></section>
   <section class="panel"><h3>◆ Descripción Pokédex</h3><p class="flavor">${escapeHTML(currentDescription()||(active.species?'No hay descripción disponible en español.':'Consultando descripción...'))}</p><p class="note">Texto de una edición oficial disponible en PokéAPI.</p></section>
 </div>`;
}
function statsTab(){
  const yields=(active.pokemon?.stats||[]).filter(x=>x.effort>0).map(x=>`${STATS.find(s=>s[0]===x.stat.name)?.[1]||x.stat.name}: +${x.effort}`);
  return `<div class="section-grid"><section class="panel panel-wide"><h3>◆ Estadísticas base</h3>${statsSummary()}<p class="note">Estos valores son estadísticas base. Los valores de combate dependen además del nivel, IV, EV y naturaleza; no son estadísticas exclusivas de PokéAFK.</p></section>
    <section class="panel panel-wide"><h3>◆ Entrenamiento y valores individuales</h3><div class="info-grid">${info('Puntos de esfuerzo (EV) otorgados',active.pokemon?(yields.length?yields.join(' · '):'Ninguno'):'Consultando...')}${info('Valores individuales (IV)', 'De 0 a 31 por estadística')}${info('Naturaleza','Modifica algunas estadísticas según el ejemplar')}</div><p class="note">Los IV y la naturaleza dependen de cada ejemplar. Esta ficha muestra la especie, no un Pokémon capturado concreto.</p></section></div>`;
}
function attackingMultiplier(attackType, defendingTypes){
  const data=ATTACK[attackType];
  return defendingTypes.reduce((acc,t)=>acc*(data[2].includes(t)?0:data[0].includes(t)?2:data[1].includes(t)?0.5:1),1);
}
function matchups(){
  const defending=apiTypes();
  const buckets={4:[],2:[],1:[],0.5:[],0.25:[],0:[]};
  for(const type of Object.keys(TYPE_COLORS)){
    const damage=attackingMultiplier(type,defending);
    if(!buckets[damage])buckets[damage]=[];
    buckets[damage].push(type);
  }
  return buckets;
}
function typesTab(){
  const groups=matchups();
  const display=[[4,'Muy débil · ×4'],[2,'Débil · ×2'],[1,'Daño normal · ×1'],[0.5,'Resistente · ×½'],[0.25,'Muy resistente · ×¼'],[0,'Inmune · ×0']];
  return `<section class="panel"><h3>◆ Debilidades y resistencias</h3><p class="muted">Tipos defensivos:</p>${typePills(apiTypes())}<div class="effect-grid">${display.map(([power,label])=>`<div class="effect-box"><strong>${label}</strong><div class="types">${groups[power].length?groups[power].map(t=>`${typePill(t)}<small>${power===0?'×0':'×'+power}</small>`).join(''):'<span class="muted">Ninguno</span>'}</div></div>`).join('')}</div><p class="note">Efectividad de los tipos actuales de Pokémon, sin considerar habilidades, clima ni movimientos especiales.</p></section>`;
}
function itemName(item){return item?ITEM_TRANSLATIONS[item.name]||pretty(item.name):null}
function evolutionCondition(details){
  if(!details?.length)return 'Evolución';
  const d=details[0],terms=[];
  if(d.trigger?.name==='trade')terms.push('Intercambio');
  else if(d.trigger?.name==='shed')terms.push('Condición especial');
  else if(d.trigger?.name==='use-item')terms.push('Usar objeto');
  else if(d.trigger?.name==='level-up')terms.push(d.min_level?`Nivel ${d.min_level}`:'Subir de nivel');
  else if(d.trigger?.name)terms.push(pretty(d.trigger.name));
  if(d.item)terms.push(itemName(d.item));
  if(d.held_item)terms.push(`Con ${itemName(d.held_item)}`);
  if(d.min_happiness)terms.push('Alta amistad');
  if(d.min_beauty)terms.push('Belleza');
  if(d.min_affection)terms.push('Afecto');
  if(d.time_of_day==='day')terms.push('De día');
  if(d.time_of_day==='night')terms.push('De noche');
  if(d.known_move)terms.push(`Con movimiento ${pretty(d.known_move.name)}`);
  if(d.known_move_type)terms.push(`Movimiento ${TYPE_EN[d.known_move_type.name]||pretty(d.known_move_type.name)}`);
  if(d.location)terms.push(`Lugar: ${pretty(d.location.name)}`);
  if(d.needs_overworld_rain)terms.push('Con lluvia');
  if(d.party_species)terms.push(`En equipo con ${pretty(d.party_species.name)}`);
  if(d.party_type)terms.push(`Con tipo ${TYPE_EN[d.party_type.name]||pretty(d.party_type.name)} en el equipo`);
  if(d.relative_physical_stats!==null&&d.relative_physical_stats!==undefined)terms.push('Según estadísticas');
  if(d.turn_upside_down)terms.push('Consola invertida');
  if(d.gender===1)terms.push('Hembra');
  if(d.gender===2)terms.push('Macho');
  if(!terms.length)terms.push('Condición especial');
  return terms.join(' · ');
}
function flattenEvolution(root){
  const stages=[];let extra=0;
  function visit(node,depth){
    const id=Number(node.species.url.match(/\/(\d+)\/$/)?.[1]);
    if(Number.isInteger(id)&&id>386){extra++;return}
    if(!Number.isInteger(id)||id<1)return;
    stages.push({id,depth,condition:evolutionCondition(node.evolution_details)});
    (node.evolves_to||[]).forEach(child=>visit(child,depth+1));
  }
  visit(root,0);
  return {stages,extra};
}
function evolutionTab(){
  if(active.evolutionError)return `<section class="panel">${apiAlert()}</section>`;
  if(!active.evolution)return `<section class="panel"><h3>◆ Cadena evolutiva</h3>${loading('Cargando cadena evolutiva...')}</section>`;
  const {stages,extra}=flattenEvolution(active.evolution.chain);
  const maxDepth=Math.max(0,...stages.map(x=>x.depth));
  let blocks='';
  for(let depth=0;depth<=maxDepth;depth++){
    if(depth)blocks+='<span class="evo-arrow" aria-hidden="true">➜</span>';
    blocks+=`<div class="evo-stage">${stages.filter(x=>x.depth===depth).map(x=>{
      const p=localPokemon(x.id);
      return `<button type="button" class="evo-card ${x.id===active.id?'selected':''}" data-switch="${x.id}"><img src="${imgUrl(x.id)}" alt="" loading="lazy"><strong>${escapeHTML(p?.name||idText(x.id))}</strong><span>${idText(x.id)}</span>${depth?`<small>${escapeHTML(x.condition)}</small>`:''}</button>`
    }).join('')}</div>`;
  }
  if(stages.length<2)blocks='<p class="placeholder">Este Pokémon no tiene otras etapas evolutivas dentro de las primeras tres generaciones.</p>';
  return `<section class="panel"><h3>◆ Cadena evolutiva</h3><div class="evo-row">${blocks}</div>${extra?'<p class="note">Algunas evoluciones posteriores al #386 no se muestran, porque esta Pokédex abarca únicamente tres generaciones.</p>':''}<p class="note">Condiciones de evolución de referencia de PokéAPI. Las ramas representan opciones, no evoluciones simultáneas.</p></section>`;
}
function versionOptions(){
  const used=new Set();
  for(const m of active.pokemon?.moves||[])for(const v of m.version_group_details)used.add(v.version_group.name);
  const names=[...used].sort((a,b)=>{
    const keys=Object.keys(VERSION_LABELS);
    return (keys.indexOf(a)===-1?999:keys.indexOf(a))-(keys.indexOf(b)===-1?999:keys.indexOf(b))||a.localeCompare(b);
  });
  return names;
}
function moveEntries(){
  return (active.pokemon?.moves||[]).flatMap(entry=>{
    const matching=entry.version_group_details.filter(v=>v.version_group.name===active.version&&v.move_learn_method.name===active.method);
    if(!matching.length)return [];
    const level=Math.min(...matching.map(x=>x.level_learned_at));
    return [{url:entry.move.url,name:entry.move.name,level}];
  }).sort((a,b)=>a.level-b.level||a.name.localeCompare(b.name));
}
function movesTab(){
  if(!active.pokemon)return `<section class="panel"><h3>◆ Movimientos</h3>${active.error?apiAlert():loading('Cargando lista de movimientos...')}</section>`;
  const versions=versionOptions();
  const moves=moveEntries();
  let content='';
  if(!moves.length)content='<p class="placeholder">No hay movimientos registrados con este método para esta edición. Prueba otra edición o método.</p>';
  else {
    const enriched=moves.every(m=>active.moveDetails.has(m.url));
    content=`${!enriched?loading(`Cargando nombres en español, potencias y precisiones (${active.movesProgress}/${moves.length})...`):''}
      <div class="table-wrap"><table><thead><tr><th>Nivel</th><th>Movimiento</th><th>Tipo</th><th>Categoría</th><th>Potencia</th><th>Precisión</th><th>PP</th></tr></thead>
      <tbody>${moves.map(m=>{
        const d=active.moveDetails.get(m.url),typename=d?TYPE_EN[d.type.name]:'—';
        const name=d?languageText(d.names)||pretty(m.name):pretty(m.name);
        const category=d?({'physical':'Físico','special':'Especial','status':'Estado'}[d.damage_class?.name]||'—'):'—';
        return `<tr><td>${active.method==='level-up'?m.level||'—':'—'}</td><td><b>${escapeHTML(name)}</b></td><td>${typename==='—'?'—':typePill(typename)}</td><td>${category}</td><td>${d?(d.power??'—'):'—'}</td><td>${d?(d.accuracy==null?'—':`${d.accuracy}%`):'—'}</td><td>${d?(d.pp??'—'):'—'}</td></tr>`;
      }).join('')}</tbody></table></div>`;
  }
  return `<section class="panel"><h3>◆ Movimientos que aprende</h3>
    <div class="move-toolbar"><label>Edición<select id="move-version">${versions.map(v=>`<option value="${escapeHTML(v)}" ${v===active.version?'selected':''}>${escapeHTML(VERSION_LABELS[v]||pretty(v))}</option>`).join('')}</select></label>
    <label>Método<select id="move-method">${Object.entries(METHODS).map(([v,label])=>`<option value="${v}" ${v===active.method?'selected':''}>${label}</option>`).join('')}</select></label>
    <span class="moves-count">${moves.length} movimientos</span></div>
    ${content}<p class="note">El aprendizaje depende de la edición seleccionada. Potencia, categoría y precisión se consultan en PokéAPI y pueden corresponder a datos actuales, no necesariamente a los valores históricos de esa edición.</p>
  </section>`;
}
function hero(){
  const local=localPokemon(active.id),s=active.species;
  const types=apiTypes();
  const genus=languageText(s?.genera,'genus')||'Pokémon';
  const stats=getStats(active.pokemon);
  return `<div class="detail-hero" style="--hero-tint:${TYPE_COLORS[types[0]]||'#4e7ace'}">
    <div class="hero-img-wrap"><img id="hero-image" class="hero-img" src="${imgUrl(active.id,active.shiny)}" alt="Sprite ${active.shiny?'shiny':''} de ${escapeHTML(local.name)}"></div>
    <div class="hero-copy"><span class="species">${idText(active.id)} · ${escapeHTML(genus)}</span><h2 id="detail-name">${escapeHTML(local.name)}</h2>${typePills(types)}
      <div class="hero-buttons"><button type="button" data-shiny="true" aria-pressed="${active.shiny}">${active.shiny?'✦ Ver normal':'✦ Ver shiny'}</button><button type="button" id="previous" ${active.id===1?'disabled':''}>← Anterior</button><button type="button" id="next" ${active.id===386?'disabled':''}>Siguiente →</button></div></div>
      ${radar(stats)}
  </div>`;
}
function renderDetail(){
  if(!active||backdrop.hidden)return;
  const content=activeTab==='Resumen'?summaryTab():activeTab==='Estadísticas'?statsTab():activeTab==='Tipos'?typesTab():activeTab==='Evolución'?evolutionTab():movesTab();
  const priorScroll=detailBody.scrollTop;
  detailBody.innerHTML=hero()+`<nav class="tabs" aria-label="Secciones de la ficha">${TABS.map(t=>`<button type="button" class="tab ${t===activeTab?'active':''}" data-tab="${t}" aria-current="${t===activeTab?'page':'false'}">${t}</button>`).join('')}</nav><div id="tabcontent">${content}</div>`;
  detailBody.scrollTop=priorScroll;
}
async function fetchAbilities(ref){
  if(!ref.pokemon)return;
  await Promise.all((ref.pokemon.abilities||[]).map(async a=>{
    try{const details=await apiGet(a.ability.url);if(!active||active!==ref)return;
      ref.abilityNames.set(a.ability.name,languageText(details.names)||pretty(a.ability.name));
      if(activeTab==='Resumen')renderDetail();
    }catch{}
  }));
}
async function fetchBasic(ref,seq){
  const jobs=[apiGet(`pokemon/${ref.id}/`),apiGet(`pokemon-species/${ref.id}/`)];
  const [p,s]=await Promise.allSettled(jobs);
  if(!active||active!==ref||seq!==openSequence)return;
  if(p.status==='fulfilled')ref.pokemon=p.value;
  if(s.status==='fulfilled')ref.species=s.value;
  ref.error=p.status==='rejected'||s.status==='rejected';
  if(ref.pokemon){const options=versionOptions();ref.version=options.includes('emerald')?'emerald':options.at(-1)||'emerald'}
  renderDetail();
  if(ref.pokemon)fetchAbilities(ref);
  if(activeTab==='Evolución')loadEvolution(ref);
  if(activeTab==='Movimientos')loadMoves(ref);
}
function safeHash(){const match=location.hash.match(/^#pokemon-(\d{1,3})$/i);const id=match?Number(match[1]):null;return id>=1&&id<=386?id:null}
function openPokemon(id,keepFocus=false){
  if(!Number.isInteger(id)||id<1||id>386)return;
  if(!keepFocus)lastFocus=document.activeElement;
  const sequence=++openSequence;
  active={id,pokemon:null,species:null,evolution:null,evolutionError:false,loadingEvolution:false,abilityNames:new Map(),
    moveDetails:new Map(),version:'emerald',method:'level-up',shiny:false,movesProgress:0,moveLoadingKey:'',error:false};
  activeTab='Resumen';backdrop.hidden=false;document.body.classList.add('dialog-open');detailBody.scrollTop=0;
  history.replaceState(null,'',location.pathname+location.search+`#pokemon-${id}`);
  renderDetail();
  if(!keepFocus)$('#close').focus();
  fetchBasic(active,sequence);
}
function closeModal(){
  ++openSequence;active=null;backdrop.hidden=true;document.body.classList.remove('dialog-open');
  if(safeHash())history.replaceState(null,'',location.pathname+location.search);
  if(lastFocus?.isConnected)lastFocus.focus();
}
function selectTab(tab){
  if(!active||!TABS.includes(tab))return;
  activeTab=tab;renderDetail();
  if(tab==='Evolución')loadEvolution(active);
  if(tab==='Movimientos')loadMoves(active);
}
async function loadEvolution(ref){
  if(ref!==active||ref.evolution||ref.loadingEvolution)return;
  if(!ref.species)return;
  ref.loadingEvolution=true;
  try{
    const ev=await apiGet(ref.species.evolution_chain.url);
    if(active===ref){ref.evolution=ev;if(activeTab==='Evolución')renderDetail()}
  }catch{if(active===ref){ref.evolutionError=true;if(activeTab==='Evolución')renderDetail()}}
  finally{ref.loadingEvolution=false}
}
async function parallelMap(items,limit,worker){
  let cursor=0;
  const workers=Array.from({length:Math.min(limit,items.length)},async()=>{
    while(cursor<items.length){const i=cursor++;await worker(items[i],i)}
  });
  await Promise.all(workers);
}
async function loadMoves(ref){
  if(ref!==active||!ref.pokemon)return;
  const entries=moveEntries();
  const key=ref.id+'|'+ref.version+'|'+ref.method;
  if(ref.moveLoadingKey===key)return;
  const missing=entries.filter(e=>!ref.moveDetails.has(e.url));
  if(!missing.length)return;
  ref.moveLoadingKey=key;
  ref.movesProgress=entries.length-missing.length;
  if(activeTab==='Movimientos')renderDetail();
  await parallelMap(missing,5,async entry=>{
    try{const m=await apiGet(entry.url);ref.moveDetails.set(entry.url,m)}catch{ref.moveDetails.set(entry.url,null)}
    ref.movesProgress++;
    if(active===ref&&activeTab==='Movimientos'&&ref.moveLoadingKey===key){
      const indicator=detailBody.querySelector('.load-state');
      if(indicator)indicator.lastChild.textContent=`Cargando movimientos (${ref.movesProgress}/${entries.length})...`;
    }
  });
  if(ref.moveLoadingKey===key)ref.moveLoadingKey='';
  if(active===ref&&activeTab==='Movimientos')renderDetail();
}
function retryData(){if(!active)return;const id=active.id;openPokemon(id,true);selectTab('Resumen')}
backdrop.addEventListener('click',e=>{
  if(e.target===backdrop){closeModal();return}
  const button=e.target.closest('button');if(!button)return;
  if(button.id==='close')return closeModal();
  if(button.dataset.tab)return selectTab(button.dataset.tab);
  if(button.dataset.switch)return openPokemon(Number(button.dataset.switch),true);
  if(button.dataset.shiny){active.shiny=!active.shiny;renderDetail();return}
  if(button.id==='previous'&&active?.id>1)return openPokemon(active.id-1,true);
  if(button.id==='next'&&active?.id<386)return openPokemon(active.id+1,true);
  if(button.dataset.retry)return retryData();
});
backdrop.addEventListener('change',e=>{
  if(!active)return;
  if(e.target.id==='move-version'){active.version=e.target.value;active.movesProgress=0;active.moveLoadingKey='';renderDetail();loadMoves(active)}
  if(e.target.id==='move-method'){active.method=e.target.value;active.movesProgress=0;active.moveLoadingKey='';renderDetail();loadMoves(active)}
});
document.addEventListener('keydown',e=>{
  if(backdrop.hidden)return;
  if(e.key==='Escape')closeModal();
  if(e.key==='Tab'){
    const controls=[...backdrop.querySelectorAll('button:not([disabled]),select')].filter(el=>el.getClientRects().length);
    if(!controls.length)return;
    if(e.shiftKey&&document.activeElement===controls[0]){e.preventDefault();controls.at(-1).focus()}
    else if(!e.shiftKey&&document.activeElement===controls.at(-1)){e.preventDefault();controls[0].focus()}
  }
});
window.addEventListener('hashchange',()=>{
  const id=safeHash();if(id&&(!active||active.id!==id))openPokemon(id,true);
  else if(!id&&active)closeModal();
});
drawGrid();
const initialId=safeHash();if(initialId)openPokemon(initialId,true);
