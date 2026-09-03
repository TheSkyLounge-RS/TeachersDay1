/* Teachers Day — stable navigation build */
(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const tracks = {
    opening: 'opening.wav',
    sir: 'sir.wav',
    funny: 'funny.wav',
    letters: 'letters.wav',
    final: 'final.wav'
  };

  const order = ['akash', 'anik', 'rupsha', 'upanjan', 'sneha'];
  let studentIndex = 0;
  let letterIndex = 0;
  let classMoment = 0;
  let soundOn = true;
  let audio = null;
  let bubbleTimer = null;
  let reactionTimer = null;

  const students = {
    akash: {
      tag: 'THE HEALTH UPDATE', title: 'AKASH',
      fun: '<div class="funny"><strong>“Sir ajke shorir kharap, aste parbo na.”</strong><br>Somehow, this sentence became part of the batch vocabulary. 😷</div>',
      msg: 'Pranam Sir, you have given us so many good memories that I will always remember.\n\nThank you for always supporting me and making me believe that I can do better.'
    },
    anik: {
      tag: 'THE QUESTION GENERATOR', title: 'ANIK',
      fun: '<div class="funny"><strong>Question #1… #2… #3… #∞</strong><br>Sir’s patience meter: ███████████████░ 98% 😂</div>',
      msg: 'Pranam Sir, sometimes we may not say it, but your words really mean a lot to us.\n\nI’m really grateful that I got the chance to learn from a teacher like you.'
    },
    rupsha: {
      tag: 'SERIOUS MODE', title: 'RUPSHA',
      fun: '<div class="funny"><strong>SERIOUS MODE: FAILED 😂</strong><br>Trying to stay serious. Laughing anyway.</div>',
      msg: 'Pranam Sir, your classes and the little things you taught us will always stay with me.\n\nI will miss those moments and always remember you with a lot of respect.'
    },
    upanjan: {
      tag: 'THE DOUBLE-MEANING PROCESSOR', title: 'UPANJAN',
      fun: '<div class="funny"><strong>DOUBLE MEANING DETECTED 😂</strong><br>Input: one completely normal sentence.<br>Output: Upanjan laughing.</div>',
      msg: 'Pranam Sir, you have corrected us when we were wrong and encouraged us when we felt low.\n\nThank you for being such an important part of our student life.'
    },
    sneha: {
      tag: 'THE MISSING NODE', title: 'SNEHA',
      fun: '<div class="funny"><strong>ATTENDANCE REPORT: MYSTERIOUS 👻</strong><br>Present in class? Sometimes.<br>Present in our memories? Always.</div>',
      msg: 'Pranam Sir, it feels strange to think that one day we won’t be sitting in your class anymore.\n\nThank you for all your patience, care and for making us feel that we could always do better.'
    }
  };

  const letters = {
    akash: ['AKASH', 'Thank You, Sir', students.akash.msg],
    anik: ['ANIK', 'A little thank-you', students.anik.msg],
    rupsha: ['RUPSHA', 'For the little things', students.rupsha.msg],
    upanjan: ['UPANJAN', 'For always guiding us', students.upanjan.msg],
    sneha: ['SNEHA', 'Until we meet beyond the classroom', students.sneha.msg]
  };

  const classMoments = [
    { speaker: 'ANIK', bubble: 'Sir… ekta question chilo. Actually… two questions. Wait… three.', reaction: '“Akta Akta Kore Question Koro Anik.”', caption: 'The hand goes up. Again. And again. And again.', focus: 'anik' },
    { speaker: 'THE CLASS', bubble: 'Someone is talking. Someone is laughing. Someone is doing something they were definitely not supposed to do.', reaction: '“Ey Ota Rakho.”', caption: 'One sentence. Instant silence. Everyone suddenly becomes very innocent. 😂', focus: 'rupsha' },
    { speaker: 'UPANJAN', bubble: 'Sir says something completely normal…', reaction: '“Tumi Vaba Bondho Koro Age.”', caption: 'Upanjan has already found the double meaning. Rupsha is trying not to laugh. Akash is pretending nothing happened. 😂', focus: 'upanjan' }
  ];

  function toast(message) {
    const x = $('#toast');
    if (!x) return;
    x.textContent = message;
    x.className = 'toast show';
    clearTimeout(x._timer);
    x._timer = setTimeout(() => x.classList.remove('show'), 3000);
  }

  function beep(freq = 520, duration = 0.08) {
    if (!soundOn) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    try {
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + duration + 0.02);
      setTimeout(() => ctx.close && ctx.close(), 500);
    } catch (_) {}
  }

  function playTrack(name) {
    if (!soundOn || !tracks[name]) return;
    if (audio) { audio.pause(); audio.currentTime = 0; }
    audio = new Audio(tracks[name]);
    audio.loop = true;
    audio.volume = 0.42;
    audio.play().catch(() => {});
  }

  function showScene(id, track) {
    const target = document.getElementById(id);
    if (!target) { console.error('Scene missing:', id); return false; }
    $$('.scene').forEach(scene => {
      scene.classList.remove('active');
      scene.style.display = 'none';
    });
    target.classList.add('active');
    target.style.display = target.classList.contains('cinematic') || target.classList.contains('terminal-scene') ? 'flex' : 'block';
    window.scrollTo(0, 0);
    if (track) playTrack(track);
    return true;
  }

  function showClassMoment(index) {
    const moment = classMoments[index];
    if (!moment) return;
    classMoment = index;
    clearInterval(bubbleTimer);
    clearInterval(reactionTimer);
    $$('[data-role]').forEach(el => el.classList.remove('spotlight', 'laugh', 'freeze'));
    const focus = $(`[data-role="${moment.focus}"]`);
    if (focus) focus.classList.add('spotlight');
    $('#sceneSpeaker').textContent = moment.speaker;
    $('#sceneBubble').textContent = '';
    $('#sirReaction').textContent = '';
    $('#classNext').textContent = index === classMoments.length - 1 ? 'MEET THE FIVE STUDENTS →' : 'NEXT MOMENT →';
    $('#classDialogue').classList.add('show');

    let i = 0;
    bubbleTimer = setInterval(() => {
      i++;
      $('#sceneBubble').textContent = moment.bubble.slice(0, i);
      if (i >= moment.bubble.length) {
        clearInterval(bubbleTimer);
        setTimeout(() => typeReaction(moment.reaction), 250);
      }
    }, 22);
  }

  function typeReaction(text) {
    let i = 0;
    clearInterval(reactionTimer);
    reactionTimer = setInterval(() => {
      i++;
      $('#sirReaction').textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(reactionTimer);
        beep(560, 0.12);
        if (classMoment === 0) $$('[data-role]').forEach(el => el.classList.add('freeze'));
        if (classMoment === 1 && $('[data-role="rupsha"]')) $('[data-role="rupsha"]').classList.add('laugh');
        if (classMoment === 2 && $('[data-role="upanjan"]')) $('[data-role="upanjan"]').classList.add('laugh');
        $('#classGuide').innerHTML = `<b>${classMoments[classMoment].caption}</b>`;
      }
    }, 30);
  }

  function moveToStudents() {
    clearInterval(bubbleTimer); clearInterval(reactionTimer);
    $('#classDialogue').classList.remove('show');
    studentIndex = 0;
    $$('.seat').forEach((seat, i) => {
      seat.classList.toggle('locked', i !== 0);
    });
    $('#seatGuide').innerHTML = 'Start with the glowing seat: <b>AKASH</b>.';
    showScene('classroom', 'funny');
  }

  function openStudent(key) {
    if (key !== order[studentIndex]) {
      toast(`Not yet — please open ${order[studentIndex].toUpperCase()} first.`);
      return;
    }
    const s = students[key];
    $('#studentBg').src = `images/${key}.jpg`;
    $('#studentPhoto').src = `images/${key}.jpg`;
    $('#studentTag').textContent = s.tag;
    $('#studentTitle').textContent = s.title;
    $('#studentFun').innerHTML = s.fun;
    $('#studentMessage').textContent = s.msg;
    $('#studentModal').classList.add('open');
    beep(580, 0.1);
  }

  function openLetter(key) {
    if (key !== order[letterIndex]) {
      toast(`Not yet — please open ${order[letterIndex].toUpperCase()}'s envelope first.`);
      return;
    }
    const letter = letters[key];
    $('#letterImg').src = `images/${key}.jpg`;
    $('#letterFrom').textContent = letter[0];
    $('#letterHeading').textContent = letter[1];
    $('#letterBody').textContent = letter[2];
    $('#letterModal').classList.add('open');
    beep(620, 0.12);
  }

  function resetExperience() {
    studentIndex = 0; letterIndex = 0; classMoment = 0;
    $$('.seat').forEach((seat, i) => seat.classList.toggle('locked', i !== 0));
    $$('.env').forEach((env, i) => {
      env.classList.toggle('locked', i !== 0);
      env.classList.toggle('active-card', i === 0);
      const small = $('small', env);
      if (small) small.textContent = i === 0 ? 'OPEN' : 'LOCKED';
    });
    $('#studentModal').classList.remove('open');
    $('#letterModal').classList.remove('open');
    showScene('opening', 'opening');
    toast('Experience restarted. ❤️');
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Opening terminal
    const lines = [
      '> booting Teachers_Day.exe',
      '> searching for memories...',
      '> students found: 05',
      '> subject found: DATA STRUCTURES & ALGORITHMS',
      '> teacher found: PRANAM SIR',
      '> loading laughter... done',
      '> loading questions... ∞',
      '> loading memories... ∞',
      '> WARNING: this experience contains emotional damage.',
      '> press ENTER to continue...'
    ];
    let lineIndex = 0;
    function typeLine() {
      if (lineIndex >= lines.length) {
        setTimeout(() => $('#glitchTitle').classList.add('show'), 300);
        return;
      }
      const pre = $('#terminalText');
      const text = lines[lineIndex++];
      let i = 0;
      const timer = setInterval(() => {
        pre.textContent += text[i++] || '';
        if (i >= text.length) {
          clearInterval(timer); pre.textContent += '\n'; setTimeout(typeLine, 80);
        }
      }, 16);
    }
    typeLine();

    $('#enter').addEventListener('click', () => { beep(760, .1); showScene('sir', 'sir'); });
    $$('[data-next]').forEach(btn => btn.addEventListener('click', () => {
      beep(); showScene(btn.dataset.next, btn.dataset.next === 'dialogues' ? 'funny' : 'sir');
    }));

    $('#startClassScene').addEventListener('click', () => {
      beep(720, .1);
      $('#classSceneText').style.display = 'none';
      showClassMoment(0);
    });

    $('#classNext').addEventListener('click', () => {
      if (classMoment < classMoments.length - 1) showClassMoment(classMoment + 1);
      else moveToStudents();
    });

    $('#continueStudents')?.addEventListener('click', moveToStudents);

    $$('.seat').forEach(btn => btn.addEventListener('click', () => openStudent(btn.dataset.student)));
    $('#studentX').addEventListener('click', () => $('#studentModal').classList.remove('open'));
    $('#studentNext').addEventListener('click', () => {
      $('#studentModal').classList.remove('open');
      if (studentIndex < order.length - 1) {
        studentIndex++;
        const next = $(`[data-student="${order[studentIndex]}"]`);
        if (next) next.classList.remove('locked');
        $('#seatGuide').innerHTML = `✓ Previous memory complete. <b>Now click ${order[studentIndex].toUpperCase()}.</b>`;
        beep(800, .08);
      } else {
        letterIndex = 0;
        showScene('letters', 'letters');
        toast("Sir, please open Akash's letter first.");
      }
    });

    $$('.env').forEach(env => env.addEventListener('click', () => openLetter(env.dataset.letter)));
    $('#letterX').addEventListener('click', () => $('#letterModal').classList.remove('open'));
    $('#letterNext').addEventListener('click', () => {
      $('#letterModal').classList.remove('open');
      if (letterIndex < order.length - 1) {
        letterIndex++;
        const next = $$('.env')[letterIndex];
        if (next) {
          next.classList.remove('locked');
          next.classList.add('active-card');
          const small = $('small', next);
          if (small) small.textContent = 'OPEN';
        }
        $('#letterGuide').innerHTML = `✓ Letter opened. <b>Now open ${order[letterIndex]}'s envelope.</b>`;
        beep(820, .08);
      } else {
        showScene('memorywall', 'letters');
      }
    });

    $('#finalBtn').addEventListener('click', () => showScene('final', 'final'));
    $('#replay').addEventListener('click', resetExperience);
    $('#sound').addEventListener('click', () => {
      soundOn = !soundOn;
      $('#sound').textContent = soundOn ? '🔊 SOUND ON' : '🔇 SOUND OFF';
      if (soundOn) playTrack('opening'); else if (audio) audio.pause();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Enter' && $('#opening').classList.contains('active')) $('#enter').click();
      if (e.key === 'Escape') {
        $('#studentModal').classList.remove('open');
        $('#letterModal').classList.remove('open');
      }
    });
  });
})();
