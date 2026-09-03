const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const tracks={opening:'opening.wav',sir:'sir.wav',funny:'funny.wav',letters:'letters.wav',final:'final.wav'};
let audio=new Audio(tracks.opening); audio.loop=true; audio.volume=.42; let soundOn=true; let currentTrack='opening';
function playTrack(name){if(!soundOn)return; if(currentTrack===name&&!audio.paused)return; currentTrack=name; const pos=audio.currentTime; audio.pause(); audio=new Audio(tracks[name]); audio.loop=true; audio.volume=.42; audio.currentTime=Math.min(pos,audio.duration||0); audio.play().catch(()=>{});}
function beep(freq=520,d=0.08){if(!soundOn)return; const C=window.AudioContext||window.webkitAudioContext;if(!C)return; const c=new C(),o=c.createOscillator(),g=c.createGain();o.frequency.value=freq;o.type='sine';g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(.06,c.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+d+.02)}
function go(id,track){const target=$('#'+id);if(!target){console.error('Missing scene:',id);return;}$$('.scene').forEach(x=>x.classList.remove('active'));target.classList.add('active');if(track)playTrack(track);window.scrollTo(0,0)}
const lines=['> booting Teachers_Day.exe','> searching for memories...','> students found: 05','> subject found: DATA STRUCTURES & ALGORITHMS','> teacher found: PRANAM SIR','> loading laughter... done','> loading questions... ∞','> loading memories... ∞','> WARNING: this experience contains emotional damage.','> press ENTER to continue...'];
let li=0;function typeLine(){if(li>=lines.length){setTimeout(()=>{$('#glitchTitle').classList.add('show');setTimeout(()=>{$('#glitchTitle').classList.add('glitch')},400)},300);return}const pre=$('#terminalText');let t=lines[li],i=0;function c(){pre.textContent+=t[i++]||'';if(i<t.length){setTimeout(c,22)}else{pre.textContent+='\n';li++;setTimeout(typeLine,120)}}c()}typeLine();
$('#enter').onclick=()=>{beep(760,.1);$('#glitchTitle').classList.add('glitch');setTimeout(()=>go('sir','sir'),450)};
$$('[data-next]').forEach(b=>b.onclick=()=>{beep();go(b.dataset.next,b.dataset.next==='dialogues'?'funny':'sir')});
// funny classroom recreation
const classMoments=[
  {speaker:'ANIK',bubble:'Sir… ekta question chilo. Actually… two questions. Wait… three.',reaction:'“Akta Akta Kore Question Koro Anik.”',caption:'The hand goes up. Again. And again. And again.',focus:'anik'},
  {speaker:'THE CLASS',bubble:'Someone is talking. Someone is laughing. Someone is doing something they were definitely not supposed to do.',reaction:'“Ey Ota Rakho.”',caption:'One sentence. Instant silence. Everyone suddenly becomes very innocent. 😂',focus:'rupsha'},
  {speaker:'UPANJAN',bubble:'Sir says something completely normal…',reaction:'“Tumi Vaba Bondho Koro Age.”',caption:'Upanjan has already found the double meaning. Rupsha is trying not to laugh. Akash is pretending nothing happened. 😂',focus:'upanjan'}
];
let cm=0;
let classroomMoved=false;
function resetClassScene(){
  classroomMoved=false; cm=0;
  clearInterval(window._bubbleTimer); clearInterval(window._reactionTimer);
  const handoff=$('#continueStudents'); if(handoff) handoff.classList.remove('show');
  $('#classNext').textContent='NEXT MOMENT →';
  $('#classDialogue').classList.remove('show');
  $('#classSceneText').style.display='block';
  $('#classGuide').innerHTML='Sir, please press <b>START THE CLASS</b>. We promise this is not another DSA question. 😭';
  $$('[data-role]').forEach(x=>x.classList.remove('spotlight','laugh','freeze'));
}
function showClassMoment(i){
  const m=classMoments[i];
  $$('[data-role]').forEach(x=>x.classList.remove('spotlight','laugh','freeze'));
  const focus=$(`[data-role="${m.focus}"]`);
  if(focus) focus.classList.add('spotlight');
  $('#sceneSpeaker').textContent=m.speaker;
  $('#sceneBubble').textContent='';
  $('#sirReaction').textContent='';
  $('#classNext').textContent=i===classMoments.length-1?'MEET THE FIVE STUDENTS →':'NEXT MOMENT →';
  $('#classDialogue').classList.add('show');
  typeClassBubble(m.bubble,()=>setTimeout(()=>typeClassReaction(m.reaction),350));
}
function typeClassBubble(t,done){
  let i=0; const el=$('#sceneBubble');
  clearInterval(window._bubbleTimer);
  window._bubbleTimer=setInterval(()=>{
    el.textContent=t.slice(0,++i);
    if(i>=t.length){clearInterval(window._bubbleTimer);done();}
  },24);
}
function typeClassReaction(t){
  let i=0; const el=$('#sirReaction');
  clearInterval(window._reactionTimer);
  window._reactionTimer=setInterval(()=>{
    el.textContent=t.slice(0,++i);
    if(i>=t.length){
      clearInterval(window._reactionTimer); beep(560,.12);
      if(cm===0) $$('[data-role]').forEach(x=>x.classList.add('freeze'));
      if(cm===1 && $('[data-role="rupsha"]')) $('[data-role="rupsha"]').classList.add('laugh');
      if(cm===2 && $('[data-role="upanjan"]')) $('[data-role="upanjan"]').classList.add('laugh');
      $('#classGuide').innerHTML=`<b>${classMoments[cm].caption}</b>`;
      if(cm===classMoments.length-1){
        const handoff=$('#continueStudents');
        if(handoff) handoff.classList.add('show');
        // Also advance automatically after a short pause, so the experience never gets stuck.
        clearTimeout(window._handoffTimer);
        window._handoffTimer=setTimeout(()=>moveToStudents(),4500);
      }
    }
  },34);
}
function moveToStudents(){
  if(classroomMoved) return;
  classroomMoved=true;
  clearInterval(window._bubbleTimer); clearInterval(window._reactionTimer);
  const handoff=$('#continueStudents'); if(handoff) handoff.classList.remove('show');
  $('#classDialogue').classList.remove('show');
  $('#classGuide').innerHTML='Opening the five student memories… ❤️';
  go('classroom','funny');
}
$('#continueStudents').onclick=()=>moveToStudents();
$('#startClassScene').onclick=()=>{
  beep(720,.1);
  $('#classSceneText').style.display='none';
  showClassMoment(0);
};
$('#classNext').onclick=()=>{
  if(cm < classMoments.length-1){ cm++; showClassMoment(cm); }
  else moveToStudents();
};

const students={akash:{tag:'THE HEALTH UPDATE',title:'AKASH',fun:`<div class="funny"><strong>“Sir ajke shorir kharap, aste parbo na.”</strong><br>Somehow, this sentence became part of the batch vocabulary. 😷</div>`,msg:'Pranam Sir, you have given us so many good memories that I will always remember.\n\nThank you for always supporting me and making me believe that I can do better.'},anik:{tag:'THE QUESTION GENERATOR',title:'ANIK',fun:`<div class="funny"><strong>Question #1… #2… #3… #∞</strong><br>Sir’s patience meter: ███████████████░ 98% 😂</div>`,msg:'Pranam Sir, sometimes we may not say it, but your words really mean a lot to us.\n\nI’m really grateful that I got the chance to learn from a teacher like you.'},rupsha:{tag:'SERIOUS MODE',title:'RUPSHA',fun:`<div class="funny"><strong>SERIOUS MODE: FAILED 😂</strong><br>Trying to stay serious. Laughing anyway.</div>`,msg:'Pranam Sir, your classes and the little things you taught us will always stay with me.\n\nI will miss those moments and always remember you with a lot of respect.'},upanjan:{tag:'THE DOUBLE-MEANING PROCESSOR',title:'UPANJAN',fun:`<div class="funny"><strong>DOUBLE MEANING DETECTED 😂</strong><br>Input: one completely normal sentence.<br>Output: Upanjan laughing.</div>`,msg:'Pranam Sir, you have corrected us when we were wrong and encouraged us when we felt low.\n\nThank you for being such an important part of our student life.'},sneha:{tag:'THE MISSING NODE',title:'SNEHA',fun:`<div class="funny"><strong>ATTENDANCE REPORT: MYSTERIOUS 👻</strong><br>Present in class? Sometimes.<br>Present in our memories? Always.</div>`,msg:"Pranam Sir, it feels strange to think that one day we won't be sitting in your class anymore.\n\nThank you for all your patience, care and for making us feel that we could always do better."}};
const order=['akash','anik','rupsha','upanjan','sneha'];let si=0;
function openStudent(k){if(k!==order[si]){toast(`Not yet — Sir, please open ${order[si].toUpperCase()} first.`);return;}const s=students[k];$('#studentBg').src=`images/${k}.jpg`;$('#studentPhoto').src=`images/${k}.jpg`;$('#studentTag').textContent=s.tag;$('#studentTitle').textContent=s.title;$('#studentFun').innerHTML=s.fun;$('#studentMessage').textContent=s.msg;$('#studentModal').classList.add('open');beep(580,.1)}
$$('.seat').forEach(b=>b.onclick=()=>openStudent(b.dataset.student));
$('#studentX').onclick=()=>$('#studentModal').classList.remove('open');
$('#studentNext').onclick=()=>{ $('#studentModal').classList.remove('open'); if(si<4){si++;const next=$(`[data-student="${order[si]}"]`);next.classList.remove('locked');$('#seatGuide').innerHTML=`✓ Previous memory complete. <b>Now click ${order[si].toUpperCase()}.</b>`;beep(800,.08)}else{go('letters','letters');setTimeout(()=>toast("Sir, please open Akash's letter first."),500)}};
const letters={akash:['AKASH','Thank You, Sir','Pranam Sir, you have given us so many good memories that I will always remember.\n\nThank you for always supporting me and making me believe that I can do better.'],anik:['ANIK','A little thank-you','Pranam Sir, sometimes we may not say it, but your words really mean a lot to us.\n\nI’m really grateful that I got the chance to learn from a teacher like you.'],rupsha:['RUPSHA','For the little things','Pranam Sir, your classes and the little things you taught us will always stay with me.\n\nI will miss those moments and always remember you with a lot of respect.'],upanjan:['UPANJAN','For always guiding us','Pranam Sir, you have corrected us when we were wrong and encouraged us when we felt low.\n\nThank you for being such an important part of our student life.'],sneha:['SNEHA','Until we meet beyond the classroom','Pranam Sir, it feels strange to think that one day we won’t be sitting in your class anymore.\n\nThank you for all your patience, care and for making us feel that we could always do better.']};let ei=0;
$$('.env').forEach(e=>e.onclick=()=>{if(e.dataset.letter!==order[ei]){toast(`Not yet — please open ${order[ei].toUpperCase()}'s envelope first.`);return;}const l=letters[e.dataset.letter];$('#letterImg').src=`images/${e.dataset.letter}.jpg`;$('#letterFrom').textContent=l[0];$('#letterHeading').textContent=l[1];$('#letterBody').textContent=l[2];$('#letterModal').classList.add('open');beep(620,.12)});
$('#letterX').onclick=()=>$('#letterModal').classList.remove('open');$('#letterNext').onclick=()=>{$('#letterModal').classList.remove('open');if(ei<4){ei++;const n=$$('.env')[ei];n.classList.remove('locked');n.classList.add('active-card');$('#letterGuide').innerHTML=`✓ Letter opened. <b>Now open ${order[ei]}'s envelope.</b>`;beep(820,.08)}else{setTimeout(()=>go('memorywall','letters'),350)}};
$('#finalBtn').onclick=()=>go('final','final');$('#replay').onclick=()=>location.reload();
$('#sound').onclick=()=>{soundOn=!soundOn;$('#sound').textContent=soundOn?'🔊 SOUND ON':'🔇 SOUND OFF';if(soundOn){audio.play().catch(()=>{})}else audio.pause()};
function toast(t){const x=$('#toast');x.textContent=t;x.style.cssText='position:fixed;z-index:120;left:50%;bottom:30px;transform:translateX(-50%);padding:13px 18px;border-radius:99px;background:#191a20ee;border:1px solid #fff2;color:#ddd;font-size:12px;letter-spacing:.5px';setTimeout(()=>x.textContent='',3200)}
// transition audio if section becomes active through direct navigation
window.addEventListener('keydown',e=>{if(e.key==='Enter'&&$('#opening').classList.contains('active'))$('#enter').click()});
