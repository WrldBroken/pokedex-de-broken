// Prueba de interfaz sin Internet: node tests/smoke-test.cjs
const fs=require('fs');
const vm=require('vm');
const assert=require('assert/strict');
const path=require('path');
const root=path.join(__dirname,'..');
const dom={};
function el(selector){
  if(!dom[selector])dom[selector]={innerHTML:'',textContent:'',value:'all',scrollTop:0,hidden:selector==='#backdrop',classList:{add(){},remove(){}},focus(){},isConnected:true,addEventListener(){},add(){},querySelector(){return null}};
  return dom[selector];
}
const mockPokemon={
  id:1,height:7,weight:69,base_experience:64,
  stats:['hp','attack','defense','special-attack','special-defense','speed'].map((name,i)=>({stat:{name},base_stat:[45,49,49,65,65,45][i]})),
  types:[{type:{name:'grass'}},{type:{name:'poison'}}],
  abilities:[{ability:{name:'overgrow',url:'https://pokeapi.co/api/v2/ability/65/'},is_hidden:false}],
  moves:[{move:{name:'tackle',url:'https://pokeapi.co/api/v2/move/33/'},version_group_details:[{level_learned_at:1,move_learn_method:{name:'level-up'},version_group:{name:'emerald'}}]}]
};
const species={genera:[{language:{name:'es'},genus:'Pokémon Semilla'}],gender_rate:1,growth_rate:{name:'medium-slow'},capture_rate:45,egg_groups:[{name:'monster'},{name:'grass'}],is_mythical:false,is_legendary:false,flavor_text_entries:[{language:{name:'es'},flavor_text:'Pokémon de prueba.'}],evolution_chain:{url:'https://pokeapi.co/api/v2/evolution-chain/1/'}};
const evo={chain:{species:{url:'https://pokeapi.co/api/v2/pokemon-species/1/'},evolution_details:[],evolves_to:[{species:{url:'https://pokeapi.co/api/v2/pokemon-species/2/'},evolution_details:[{trigger:{name:'level-up'},min_level:16,relative_physical_stats:null}],evolves_to:[{species:{url:'https://pokeapi.co/api/v2/pokemon-species/3/'},evolution_details:[{trigger:{name:'level-up'},min_level:32,relative_physical_stats:null}],evolves_to:[]}]}]}};
const fixture={
  '/pokemon/1/':mockPokemon,
  '/pokemon-species/1/':species,
  '/ability/65/':{names:[{language:{name:'es'},name:'Espesura'}]},
  '/evolution-chain/1/':evo,
  '/move/33/':{names:[{language:{name:'es'},name:'Placaje'}],type:{name:'normal'},power:40,accuracy:100,pp:35,damage_class:{name:'physical'}}
};
const sandbox={
  document:{querySelector:el,addEventListener(){},body:{classList:{add(){},remove(){}}}},
  window:{addEventListener(){}},
  history:{replaceState(){}},location:{hash:'',pathname:'/',search:''},
  Option:function(label,value){return {label,value}},
  fetch:async url=>({ok:true,json:async()=>{
    const key=new URL(url).pathname.replace('/api/v2','');
    if(fixture[key])return fixture[key];
    throw Error('No hay fixture para '+key);
  }}),
  AbortController, setTimeout, clearTimeout,console,
  POKEMON:null
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root,'pokemon-data.js'),'utf8')+'\nthis.POKEMON=POKEMON',sandbox);
assert.equal(sandbox.POKEMON.length,386);
assert.equal(sandbox.POKEMON.at(-1).name,'Deoxys');
assert.deepEqual(Array.from(sandbox.POKEMON.find(x=>x.id===35).types),['Hada']);
el('#search').value='';
vm.runInContext(fs.readFileSync(path.join(root,'app.js'),'utf8'),sandbox);
assert.match(el('#results').textContent,/386 de 386/);
assert.equal((el('#grid').innerHTML.match(/class="poke-card"/g)||[]).length,386);
(async()=>{
  vm.runInContext('openPokemon(1)',sandbox);
  await new Promise(r=>setTimeout(r,70));
  assert.match(el('#detail-body').innerHTML,/Pokémon Semilla/);
  assert.match(el('#detail-body').innerHTML,/Espesura/);
  assert.match(el('#detail-body').innerHTML,/Altura/);
  vm.runInContext("selectTab('Tipos')",sandbox);
  assert.match(el('#detail-body').innerHTML,/Muy débil/);
  vm.runInContext("selectTab('Evolución')",sandbox);
  await new Promise(r=>setTimeout(r,40));
  assert.match(el('#detail-body').innerHTML,/Ivysaur/);
  assert.match(el('#detail-body').innerHTML,/Nivel 16/);
  vm.runInContext("selectTab('Movimientos')",sandbox);
  await new Promise(r=>setTimeout(r,50));
  assert.match(el('#detail-body').innerHTML,/Placaje/);
  assert.match(el('#detail-body').innerHTML,/>40</);
  console.log('OK: 386 tarjetas, tipos, ficha, habilidades, evoluciones y movimientos');
})().catch(e=>{console.error(e);process.exitCode=1});
assert.equal(vm.runInContext("attackingMultiplier('Roca',['Fuego','Volador'])",sandbox),4);
assert.equal(vm.runInContext("attackingMultiplier('Eléctrico',['Agua','Tierra'])",sandbox),0);
assert.equal(vm.runInContext("attackingMultiplier('Lucha',['Normal','Fantasma'])",sandbox),0);
assert.equal(sandbox.POKEMON.every((p,i)=>p.id===i+1),true);
