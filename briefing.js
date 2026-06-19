const form=document.querySelector('#briefingForm');
const steps=[...document.querySelectorAll('.step')];
const indicators=[...document.querySelectorAll('#stepList li')];
const next=document.querySelector('#next'),back=document.querySelector('#back'),error=document.querySelector('#error');
const storageKey='lesites_briefing_v1';let current=0;

const labels={nome:'Nome',empresa:'Empresa / marca',whatsapp:'WhatsApp',email:'E-mail',negocio:'Sobre o negócio',tempo:'Tempo de empresa',tipo:'Tipo de projeto',objetivos:'Objetivos',publico:'Público ideal',concorrentes:'Concorrentes / referências',paginas:'Páginas',funcoes:'Funcionalidades',funcao_extra:'Função adicional',atualizacao:'Atualização',estilo:'Estilo visual',cores:'Cores',identidade:'Identidade visual',materiais:'Materiais',referencias_visuais:'Referências visuais',prazo:'Prazo',investimento:'Investimento',dominio:'Domínio',hospedagem:'Hospedagem',sucesso:'Critério de sucesso',observacoes:'Observações'};
const groups=[['Seus dados',['nome','empresa','whatsapp','email','negocio','tempo']],['Objetivo do projeto',['tipo','objetivos','publico','concorrentes']],['Estrutura e recursos',['paginas','funcoes','funcao_extra','atualizacao']],['Identidade e conteúdo',['estilo','cores','identidade','materiais','referencias_visuais']],['Prazo e investimento',['prazo','investimento','dominio','hospedagem','sucesso','observacoes']]];

function data(){const out={};new FormData(form).forEach((v,k)=>out[k]=out[k]?`${out[k]}, ${v}`:v);return out}
function save(){localStorage.setItem(storageKey,JSON.stringify(data()));const s=document.querySelector('#saved');s.textContent='Salvo agora';setTimeout(()=>s.textContent='Respostas salvas automaticamente',1000)}
function restore(){const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');Object.entries(saved).forEach(([name,value])=>form.querySelectorAll(`[name="${name}"]`).forEach(el=>{if(['radio','checkbox'].includes(el.type))el.checked=value.split(', ').includes(el.value);else el.value=value}))}
function validate(){let ok=true;const active=steps[current];active.querySelectorAll('[required]').forEach(el=>{const bad=!el.checkValidity();el.classList.toggle('invalid',bad);if(bad)ok=false});active.querySelectorAll('.required-choice').forEach(group=>{if(!group.querySelector('input:checked'))ok=false});error.textContent=ok?'':'Preencha os campos obrigatórios antes de continuar.';error.classList.toggle('show',!ok);active.querySelector('.invalid')?.focus();return ok}
function show(index){current=Math.max(0,Math.min(index,steps.length-1));steps.forEach((s,i)=>s.classList.toggle('active',i===current));indicators.forEach((s,i)=>{s.classList.toggle('active',i===current);s.classList.toggle('done',i<current)});back.style.visibility=current===0?'hidden':'visible';next.style.display=current===steps.length-1?'none':'block';next.textContent=current===steps.length-2?'Gerar meu resumo →':'Continuar →';document.querySelector('#stepCounter').textContent=`ETAPA ${current+1} DE ${steps.length}`;document.querySelector('#progress').style.width=`${(current+1)/steps.length*100}%`;error.classList.remove('show');if(current===steps.length-1)render();window.scrollTo({top:0,behavior:'smooth'})}
function escape(value=''){return value.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function render(){const d=data();document.querySelector('#summary').innerHTML=groups.map(([title,keys])=>{const rows=keys.filter(k=>d[k]).map(k=>`<div class="summary-row"><span>${labels[k]}</span><b>${escape(d[k])}</b></div>`).join('');return rows?`<section class="summary-group"><h3>${title}</h3>${rows}</section>`:''}).join('')}
function text(){const d=data();let t=`BRIEFING DE PROJETO — LE SITES\nGerado em ${new Date().toLocaleDateString('pt-BR')}\n`;groups.forEach(([title,keys])=>{t+=`\n${title.toUpperCase()}\n${'-'.repeat(title.length)}\n`;keys.forEach(k=>{if(d[k])t+=`${labels[k]}: ${d[k]}\n`})});return t}
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2400)}

next.addEventListener('click',()=>{if(validate()){save();show(current+1)}});back.addEventListener('click',()=>show(current-1));form.addEventListener('input',save);form.addEventListener('change',save);
document.querySelectorAll('.limit input').forEach(el=>el.addEventListener('change',()=>{if(document.querySelectorAll('.limit input:checked').length>3){el.checked=false;toast('Escolha no máximo 3 estilos.')}}));
document.querySelector('#copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text());toast('Resumo copiado.')}catch{toast('Seu navegador bloqueou a cópia automática.')}});
document.querySelector('#download').addEventListener('click',()=>{const blob=new Blob([text()],{type:'text/plain;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`briefing-${(data().empresa||'projeto').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-')}.txt`;a.click();URL.revokeObjectURL(a.href)});
document.querySelector('#send').addEventListener('click',()=>{
  if(!document.querySelector('#consent').checked){toast('Autorize o contato antes de enviar.');return}
  document.querySelector('#emailSummary').value=text();
  document.querySelector('#replyTo').value=data().email||'';
  const redirect=document.querySelector('#redirectTo');
  if(location.protocol!=='file:')redirect.value=new URL('Obrigado.html',location.href).href;
  else redirect.remove();
  toast('Enviando seu pedido de orçamento…');
  setTimeout(()=>form.submit(),350);
});
restore();show(0);
