// src/game.js - Versión final con Nivel 3 (Encounter/Fake News)

(() => {
  // 📐 Variables de Configuración
  const WORLD_WIDTH = 1280; 
  const VIEWPORT_WIDTH = 900; 

  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');

  // UI elems (Generales y Nivel 1/3)
  const menu = document.getElementById('menu');
  const startBtn = document.getElementById('start-game');
  const howtoBtn = document.getElementById('how-to');
  const howtoScreen = document.getElementById('howto-screen');
  const closeHowto = document.getElementById('close-howto'); 
  const gameScreen = document.getElementById('game-screen');
  const scoreEl = document.getElementById('score');
  const levelLabel = document.getElementById('level-label');
  const pauseBtn = document.getElementById('pause-btn');
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalQuestion = document.getElementById('modal-question');
  const modalChoices = document.getElementById('modal-choices');
  const modalTimer = document.getElementById('modal-timer');
  const modalFeedback = document.getElementById('modal-feedback');
  const submitAnswerBtn = document.getElementById('submit-answer');
  const skipAnswerBtn = document.getElementById('skip-answer');
  const finalModal = document.getElementById('final-modal');
  const finalPost = document.getElementById('final-post');
  const submitPostBtn = document.getElementById('submit-post');
  const endScreen = document.getElementById('end-screen');
  const finalScoreEl = document.getElementById('final-score');
  const badgesEl = document.getElementById('badges');
  const replayBtn = document.getElementById('replay');
  const leftBtn = document.getElementById('left-btn');
  const rightBtn = document.getElementById('right-btn');
  const jumpBtn = document.getElementById('jump-btn');

  // 🛑 ELEMENTOS DE UI PARA EL MATCH-MODAL (Nivel 2)
  const matchModal = document.getElementById('match-modal');
  const matchTitle = document.getElementById('match-title');
  const matchPrompt = document.getElementById('match-prompt');
  const dilemmaCardsContainer = document.getElementById('dilemma-cards');
  const matchResultsBox = document.getElementById('match-results-box');
  const matchFeedbackMessage = document.getElementById('match-feedback-message');
  const matchCorrectPhrase = document.getElementById('match-correct-phrase');
  const closeMatchModalBtn = document.getElementById('close-match-modal');


  // --- AUDIO Y RECURSOS (Mantenido)
  const ASSETS = {
    // IMAGENES
    fondo_n1: 'src/Imagenes_L9/libro_9_fondos-01.png',
    fondo_n2: 'src/Imagenes_L9/libro_9_fondos-02.png',
    fondo_n3: 'src/Imagenes_L9/libro_9_fondos-03.png',
    player_front: 'src/Imagenes_L9/Elias_frente.png',
    player_front_hand: 'src/Imagenes_L9/Elias_frente_mano_levantada.png',
    player_right: 'src/Imagenes_L9/Elias_perfil_derecho.png',
    player_left: 'src/Imagenes_L9/Elias_perfll_izquierdo.png', 
    spirit: 'src/Imagenes_L9/Espiritu_fuego.png',

    don_S: 'src/Imagenes_L9/S.png', // Sabiduría
    don_I: 'src/Imagenes_L9/I.png', // Inteligencia
    don_CI: 'src/Imagenes_L9/CI.png', // Ciencia
    don_F: 'src/Imagenes_L9/F.png', // Fortaleza
    don_P: 'src/Imagenes_L9/P.png', // Piedad
    don_T: 'src/Imagenes_L9/T.png', // Temor de Dios
    don_C: 'src/Imagenes_L9/C.png', // Consejo (C2 para evitar conflicto con Ciencia)
    
    // AUDIO (ASUMIMOS RUTAS MP3)
    audio_jump: 'src/Audio/jump.mp3', 
    audio_correct: 'src/Audio/correct.mp3',
    audio_wrong: 'src/Audio/wrong.mp3',
    audio_level_complete: 'src/Audio/level_complete.mp3',
  };
  
  // 🛑 Array de iniciales de los Dones
  const DONES_INICIALES = [
    { initial: 'S', don: 'Sabiduría' },
    { initial: 'I', don: 'Inteligencia' },
    { initial: 'CI', don: 'Ciencia' },
    { initial: 'F', don: 'Fortaleza' },
    { initial: 'P', don: 'Piedad' },
    { initial: 'T', don: 'Temor de Dios' },
    { initial: 'C', don: 'Consejo' }, 
  ];


  const IMAGES = {};
  const AUDIO = {};
  let resourcesToLoad = Object.keys(ASSETS).length;
  let resourcesLoaded = 0;

  function loadResource(key, path, type, onComplete) {
    if (type === 'image') {
      const img = new Image();
      img.src = path;
      img.onload = () => { IMAGES[key] = img; onComplete(); };
      img.onerror = () => { console.warn(`Error cargando imagen ${path}`); onComplete(); };
    } else if (type === 'audio') {
      const audio = new Audio();
      audio.src = path;
      audio.addEventListener('canplaythrough', () => { AUDIO[key] = audio; onComplete(); }, { once: true });
      audio.onerror = () => { console.warn(`Error cargando audio ${path}`); onComplete(); };
      audio.load();
    }
  }

  function preloadResources(onComplete) {
    resourcesLoaded = 0;
    Object.entries(ASSETS).forEach(([key, path]) => {
      const type = path.includes('.mp3') ? 'audio' : 'image';
      loadResource(key, path, type, () => {
        resourcesLoaded++;
        if (resourcesLoaded === resourcesToLoad) onComplete();
      });
    });
  }
  
  function playAudio(key) {
      if (AUDIO[key]) {
          const clone = AUDIO[key].cloneNode();
          clone.play().catch(e => console.warn("Audio play error:", e));
      }
  }

  // game state
  let state = {
    running: false,
    paused: false,
    currentLevel: 0,
    score: 0,
    badges: new Set(),
    currentQuestionIndex: 0, 
  };
  
  // Variables globales
  let player; 
  let lastTime = 0;
  let keys = {};
  let mobileLeft = false;
  let mobileRight = false;
  let mobileJump = false;
  let cameraX = 0; 
  let feedback = {
      message: null,
      timer: 0,
      type: null // 'correct', 'wrong', o 'level'
  };
  
  // 🛑 Variables del Modal (Trivia/Encounter)
  let currentQuestion = null;
  let currentSelection = null;

  // Función de Detección de Colisión (Axis-Aligned Bounding Box)
  function aabb(box1, box2) {
    return box1.x < box2.x + box2.w &&
           box1.x + box1.w > box2.x &&
           box1.y < box2.y + box2.h &&
           box1.y + box2.h > box2.y;
  }

  // Player Class (Mantenido)
  class Player {
      constructor(x, y) {
          this.x = x; this.y = y;
          this.w = 52; this.h = 64;
          this.vx = 0; this.vy = 0;
          this.speed = 300; 
          this.jumpSpeed = -600; 
          this.onGround = false;
          this.facing = 'front';
      }
      draw(ctx) {
          let img = null;
          if (this.facing === 'left' && IMAGES.player_left) img = IMAGES.player_left;
          else if (this.facing === 'right' && IMAGES.player_right) img = IMAGES.player_right;
          else if (this.facing === 'hand' && IMAGES.player_front_hand) img = IMAGES.player_front_hand;
          else if (IMAGES.player_front) img = IMAGES.player_front;
    
          if (img) {
            ctx.drawImage(img, this.x, this.y, this.w, this.h);
          } else {
            ctx.fillStyle = '#ffd166';
            ctx.fillRect(this.x, this.y, this.w, this.h);
          }
      }
  }

  // NIVELES (Mantenido)
  const levels = [
    {
      name: "Stories",
      bgKey: 'fondo_n1', 
      platforms: [
        {x:0,y:540,w:WORLD_WIDTH,h:60}, 
        {x:100,y:440,w:140,h:20},
        {x:300,y:380,w:140,h:20},
        {x:500,y:320,w:140,h:20},
        {x:700,y:440,w:140,h:20}, 
        {x:900,y:380,w:140,h:20},
        {x:1100,y:320,w:140,h:20},
      ],
      spirits: [
        {x:130,y:380,w:36,h:36, type: 'trivia', index: 0},
        {x:340,y:320,w:36,h:36, type: 'trivia', index: 1},
        {x:530,y:260,w:36,h:36, type: 'trivia', index: 2}, 
        {x:730,y:380,w:36,h:36, type: 'trivia', index: 3}, 
        {x:940,y:320,w:36,h:36, type: 'trivia', index: 4}, 
      ],
      flag: {x:1200,y:468,w:48,h:72} 
    },
    {
      name: "Reels",
      bgKey: 'fondo_n2', 
      platforms: [
        {x:0,y:540,w:WORLD_WIDTH,h:60},
        {x:100,y:460,w:140,h:20}, // Sabiduría
        {x:280,y:400,w:140,h:20}, // Inteligencia
        {x:460,y:340,w:140,h:20}, // Ciencia
        {x:640,y:480,w:140,h:20}, // Fortaleza
        {x:820,y:420,w:140,h:20}, // Piedad
        {x:1000,y:360,w:140,h:20},// Temor de Dios
        {x:1150,y:500,w:100,h:20}, // Consejo (Cercano a la meta)
      ],
      spirits: [
        {x:120,y:420,w:36,h:36, type: 'match_dilemma', index: 0}, // Sabiduría
        {x:320,y:360,w:36,h:36, type: 'match_dilemma', index: 1}, // Inteligencia
        {x:500,y:300,w:36,h:36, type: 'match_dilemma', index: 2}, // Ciencia
        {x:680,y:440,w:36,h:36, type: 'match_dilemma', index: 3}, // Fortaleza
        {x:850,y:380,w:36,h:36, type: 'match_dilemma', index: 4}, // Piedad
        {x:1050,y:320,w:36,h:36, type: 'match_dilemma', index: 5}, // Temor de Dios
        {x:1200,y:460,w:36,h:36, type: 'match_dilemma', index: 6}, // Consejo
      ],
      flag: {x:1200,y:468,w:48,h:72}
    },
    {
      name: "Post del Día",
      bgKey: 'fondo_n3', 
      platforms: [
        {x:0,y:540,w:WORLD_WIDTH,h:60},
        {x:100,y:460,w:120,h:20},
        {x:300,y:420,w:120,h:20},
        {x:520,y:360,w:120,h:20},
        {x:740,y:300,w:120,h:20},
        {x:960,y:240,w:120,h:20},
        {x:1100,y:300,w:120,h:20},
      ],
      spirits: [
        {x:120,y:420,w:36,h:36, type: 'encounter', index: 0}, 
        {x:320,y:380,w:36,h:36, type: 'encounter', index: 1}, 
        {x:540,y:320,w:36,h:36, type: 'encounter', index: 2}, 
        {x:760,y:260,w:36,h:36, type: 'encounter', index: 3}, 
      ],
      flag: {x:1200,y:468,w:48,h:72}
    }
  ];

  // --- Modal logic
  let modalTimerInterval = null;
  let questionsData = [window.GAME_QUESTIONS.level1, window.GAME_QUESTIONS.level2, window.GAME_QUESTIONS.level3];
  let spiritToRemoveIndex = -1; 

  function displayFeedback(message, type) {
      feedback.message = message;
      feedback.type = type; 
      feedback.timer = (type === 'level') ? 3 : 1.5; 
  }
  
  // Función para cerrar el Modal de Trivia/Encounter (Nivel 1 y 3)
  function closeModal(resultType, pointsAwarded = 0) { 
    if (modalTimerInterval) { clearInterval(modalTimerInterval); modalTimerInterval = null; }
    modal.classList.add('hidden');
    state.paused = false;
    
    // ⬅️ CORRECCIÓN: Limpiar el mensaje de feedback del modal al cerrar
    modalFeedback.textContent = ''; 

    if (resultType === 'correct' || resultType === 'partial') {
        state.score += pointsAwarded; 
        const message = resultType === 'correct' 
            ? `¡Genial! ¡El Espíritu Santo está contigo! (+${pointsAwarded} Puntos) 🎉`
            : `¡Bien hecho! (+${pointsAwarded} Puntos) 🎉`;
        playAudio('audio_correct');
        displayFeedback(message, 'correct');
    } else if (resultType === 'wrong') {
        playAudio('audio_wrong');
        displayFeedback("¡No te rindas! Escucha a tu corazón. ❤️", 'wrong'); 
    }
    
    // Elimina el spirit
    if (spiritToRemoveIndex !== -1) {
        levels[state.currentLevel].spirits.splice(spiritToRemoveIndex, 1);
        spiritToRemoveIndex = -1;
    }
    
    updateHUD();
  }
  
  // Función para cerrar el Modal de Emparejamiento (Nivel 2) (Mantenida)
  function closeMatchModal(resultType, pointsAwarded = 0) {
      matchModal.classList.add('hidden');
      matchResultsBox.classList.add('hidden'); 
      matchResultsBox.classList.remove('active'); // Remover bloqueo de clics
      state.paused = false;

      if (resultType === 'correct') {
          state.score += pointsAwarded;
          playAudio('audio_correct');
          displayFeedback(`¡Don viralizado! (+${pointsAwarded} Puntos) 🎉`, 'correct');
      } else if (resultType === 'wrong') {
          playAudio('audio_wrong');
          displayFeedback("Esa no era la app correcta. ¡A estudiar los Dones! ❤️", 'wrong');
      }

      // Elimina el spirit
      if (spiritToRemoveIndex !== -1) {
          levels[state.currentLevel].spirits.splice(spiritToRemoveIndex, 1);
          spiritToRemoveIndex = -1;
      }
      
      // Limpia el estado 'flipped' y 'wrong' de todas las tarjetas para el próximo dilema
      dilemmaCardsContainer.querySelectorAll('.don-card').forEach(card => {
          card.classList.remove('flipped', 'wrong');
      });

      updateHUD();
  }


  function openTrivia(questionObj, levelIndex, spiritIndex) {
    currentQuestion = questionObj; // Asignar la pregunta actual
    currentSelection = null; // Reiniciar la selección
    state.paused = true;
    spiritToRemoveIndex = spiritIndex; 
    
    const qType = questionObj.type || 'trivia';
    const isMatchDilemma = qType === 'match_dilemma'; 
    
    //  LÓGICA PARA NIVEL 2: DILEMA DE EMPAREJAMIENTO (Mantenida)
    if (isMatchDilemma) {
        modal.classList.add('hidden'); 
        matchModal.classList.remove('hidden');

        matchTitle.textContent = `Dilema - ¿Qué Don te ayuda?`;
        matchPrompt.textContent = questionObj.prompt;
        dilemmaCardsContainer.innerHTML = '';
        
        // 1. Dibuja las 7 Tarjetas (Dones)
        DONES_INICIALES.forEach(donInfo => {
            const card = document.createElement('div');
            card.className = 'don-card';
            card.setAttribute('data-initial', donInfo.initial);
            card.setAttribute('data-don', donInfo.don);
            
            const donInitialKey = donInfo.initial;
            const imagePath = ASSETS[`don_${donInitialKey}`];
            
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-face card-front">
                        <img src="${imagePath}" alt="Don ${donInfo.don}" style="max-width: 90%; max-height: 90%; object-fit: contain;">
                    </div>
                    <div class="card-face card-back">${donInfo.don}: ${questionObj.correct_phrase}</div>
                </div>
            `;
            
            card.onclick = (e) => {
                if (matchResultsBox.classList.contains('active')) return;
                
                const selectedInitial = card.getAttribute('data-initial');

                if (selectedInitial === questionObj.initial) {
                    // CORRECTO
                    card.classList.add('flipped');
                    matchFeedbackMessage.textContent = `¡Correcto! Don: ${questionObj.don} 🎉`;
                    matchCorrectPhrase.textContent = `Acción de Valor Alto: ${questionObj.correct_phrase}`;
                    matchFeedbackMessage.style.color = '#6ee7b7';
                    
                    matchResultsBox.classList.remove('hidden');
                    matchResultsBox.classList.add('active'); // Bloquear más clics
                    closeMatchModalBtn.onclick = () => closeMatchModal('correct', questionObj.points || 20);

                } else {
                    // INCORRECTO
                    card.classList.add('wrong');
                    matchFeedbackMessage.textContent = `Incorrecto. Este dilema pertenece al Don ${questionObj.don}.`;
                    matchCorrectPhrase.textContent = `Acción de Valor Alto: ${questionObj.correct_phrase}`;
                    matchFeedbackMessage.style.color = '#ff6b6b';
                    
                    matchResultsBox.classList.remove('hidden');
                    matchResultsBox.classList.add('active');
                    
                    const correctCard = dilemmaCardsContainer.querySelector(`[data-initial="${questionObj.initial}"]`);
                    if(correctCard) correctCard.classList.add('flipped');
                    
                    closeMatchModalBtn.onclick = () => closeMatchModal('wrong', 0);
                }
            };
            dilemmaCardsContainer.appendChild(card);
        });
        
        return; // Sale de openTrivia
    } 
    
    // Lógica para TRIVIA (Nivel 1) y ENCOUNTER (Nivel 3)
    
    modal.classList.remove('hidden');
    matchModal.classList.add('hidden'); 
    
    // Resetear elementos
    modalChoices.innerHTML = '';
    modalTimer.classList.remove('hidden');
    skipAnswerBtn.classList.remove('hidden');
    modalFeedback.textContent = ''; // Limpiar feedback anterior
    submitAnswerBtn.textContent = "Enviar";
    
    // ⬅️ CORRECCIÓN 1: Deshabilitar el botón de envío al abrir (excepto para Nivel 1 si usa solo choices)
    submitAnswerBtn.disabled = true;


    const isDilemma = qType === 'dilemma' || qType === 'trivia'; 
    
    modalTitle.textContent = `Desafío - ${questionObj.title || levels[levelIndex].name}`;
    modalQuestion.textContent = questionObj.question || questionObj.prompt || "Desafío Pendiente";
    
    // 🛑 LÓGICA ESPECÍFICA PARA ENCOUNTER (Nivel 3)
    if (qType === 'encounter') {
        modalTimer.classList.add('hidden'); // Ocultar timer
        skipAnswerBtn.classList.add('hidden'); // Ocultar skip
        submitAnswerBtn.textContent = "Confirmar";
        submitAnswerBtn.disabled = true; // ⬅️ CORRECCIÓN: Asegurar deshabilitado para Nivel 3


        // Botón 'Verdad (Conexión Divina)'
        const btnTrue = document.createElement('button');
        btnTrue.textContent = 'Verdad (Conexión Divina)';
        // ⬅️ CORRECCIÓN: Usar 'choice' y 'button' para Nivel 3 para facilitar el estilo y la deshabilitación
        btnTrue.className = 'choice encounter-choice';
        btnTrue.dataset.answer = 'true'; 
        modalChoices.appendChild(btnTrue);

        // Botón 'Falso (Fake News)'
        const btnFalse = document.createElement('button');
        btnFalse.textContent = 'Falso (Fake News)';
        btnFalse.className = 'choice encounter-choice';
        btnFalse.dataset.answer = 'false';
        modalChoices.appendChild(btnFalse);

    } else { 
        // 🛑 LÓGICA PARA TRIVIA (Nivel 1)
        
        questionObj.choices.forEach((c, idx) => {
            const btn = document.createElement('div');
            btn.className = 'choice';
            btn.textContent = c.text || c; 
            
            // Guardamos el índice para la verificación de respuesta
            btn.dataset.index = idx; 
            modalChoices.appendChild(btn);
        });
        
        // Nivel 1 (Trivia) requiere un clic en una opción para habilitar el botón "Enviar"
        submitAnswerBtn.disabled = true; 

        // Configurar el timer para Nivel 1
        let timeLeft = (levelIndex === 0) ? 30 : 9999;
        modalTimer.textContent = timeLeft;
        modalTimer.classList.toggle('hidden', levelIndex !== 0);
    
        if (modalTimerInterval) clearInterval(modalTimerInterval);
        if (levelIndex === 0) {
          modalTimerInterval = setInterval(()=> {
            if (timeLeft > 0) {
              timeLeft--;
              modalTimer.textContent = timeLeft;
            } else {
              clearInterval(modalTimerInterval);
              closeModal('wrong', 0); 
            }
          }, 1000);
        }
    }


    // Listener de selección unificado para Trivia y Encounter
    modalChoices.querySelectorAll('.choice').forEach(choice => {
        choice.addEventListener('click', ()=> {
            [...modalChoices.children].forEach(ch => ch.classList.remove('selected'));
            choice.classList.add('selected');
            
            // ⬅️ CORRECCIÓN 2: Habilitar el botón de envío al hacer clic en cualquier opción
            submitAnswerBtn.disabled = false; 

            if (currentQuestion.type === 'encounter') {
                currentSelection = choice.dataset.answer; 
            } else {
                // Trivia / Dilemma
                currentSelection = parseInt(choice.dataset.index);
            }
        });
    });
    
    // La validación se mueve al listener externo `submitAnswerBtn`
    skipAnswerBtn.onclick = () => { 
      closeModal('wrong', 0); 
    };
  }
  
  // ----------------------------------------------------------------------
  // 🛑 FUNCIÓN: Lógica de envío de respuesta (Unificado)
  // ----------------------------------------------------------------------
  function submitModalAnswer() {
      if (currentSelection === null) {
          modalFeedback.textContent = '¡Selecciona una opción antes de confirmar!';
          return;
      }

      submitAnswerBtn.disabled = true;
      let isCorrect = false;
      let points = 0;
      let resultType = 'wrong';

      if (currentQuestion.type === 'trivia') {
          // Lógica de validación para Trivia (Nivel 1)
          isCorrect = currentSelection === currentQuestion.correctIndex;
          points = isCorrect ? 10 : 0;
          resultType = isCorrect ? 'correct' : 'wrong';

      } else if (currentQuestion.type === 'encounter') {
          // Lógica de validación para Encounter (Nivel 3)
          const correctAnswerStr = String(currentQuestion.correctAnswer);
          isCorrect = currentSelection === correctAnswerStr;
          points = isCorrect ? currentQuestion.points : 0;
          resultType = isCorrect ? 'correct' : 'wrong';
          
      } // Se omite 'dilemma' ya que tu lógica de Nivel 2 lo maneja en el onclick de la tarjeta.

      // Mostrar el resultado en el modal
      if (isCorrect) {
          // ⬅️ CORRECCIÓN: El updateScore y el mensaje final deben ocurrir solo después de confirmar
          state.score += points;
          modalFeedback.textContent = 
              currentQuestion.type === 'encounter' ? 
              `¡Validado! +${points} pts. Es una Conexión Divina.` : 
              `¡Correcto! ¡Sigue así! (+${points} pts)`;
      } else {
          modalFeedback.textContent = 
              currentQuestion.type === 'encounter' ? 
              '¡Fake News! Esa conexión no es del Evangelio.' : 
              'Respuesta incorrecta. Sigue evangelizando.';
      }

      // Deshabilitar botones de opción para que no puedan cambiarla
      document.querySelectorAll('#modal-choices .choice').forEach(btn => btn.disabled = true);

      // Cierra el modal después de 2 segundos
      setTimeout(() => {
          closeModal(resultType, points);
          // Re-habilitar botones para el próximo uso (aunque closeModal lo limpia, lo dejamos para la próxima apertura)
          document.querySelectorAll('#modal-choices .choice').forEach(btn => btn.disabled = false);
      }, 2000); 
  }

  // ----------------------------------------------------------------------
  // Listener Global para el botón 'Enviar/Confirmar' del Modal
  // ----------------------------------------------------------------------
  submitAnswerBtn.addEventListener('click', submitModalAnswer);


  function updateHUD(){ 
      scoreEl.textContent = `Puntos: ${state.score}`; 
      levelLabel.textContent = `Nivel ${state.currentLevel+1}: ${levels[state.currentLevel].name}`; 
  }

  function startLevel(index) {
      state.currentLevel = index;
      state.currentQuestionIndex = 0; 
      player = new Player(40, 460); 
      lastTime = performance.now();
      state.paused = false;
      updateHUD();
  }

  function onLevelComplete() {
    state.score += 50; 
    
    const badgeMap = ['🟢 “Follower Confirmado”','🔵 “Espíritu ON”','🟣 “Influencer del Evangelio”'];
    state.badges.add(badgeMap[state.currentLevel]);
    
    const nextLevelIndex = state.currentLevel + 1;

    state.paused = true; 
    playAudio('audio_level_complete');
    displayFeedback(`¡Wow, has viralizado un mensaje de amor! NIVEL ${state.currentLevel + 1} COMPLETO! (+50 pts) 🏆`, 'level'); 
    
    setTimeout(() => {
        if (nextLevelIndex < levels.length) {
          startLevel(nextLevelIndex);
          state.paused = false; 
        } else {
          openFinalChallenge();
        }
        updateHUD();
    }, 3000); 
  }

  function openFinalChallenge() {
    finalModal.classList.remove('hidden');
    state.paused = true;
    submitPostBtn.onclick = () => {
      const text = finalPost.value.trim();
      if (text.length === 0) {
        alert('Escribe tu post para completar el reto final.');
        return;
      }
      state.score += 30; // +30 pts por "Reto creativo"
      finalModal.classList.add('hidden');
      state.paused = false;
      showEndScreen();
    };
  }

  function showEndScreen() {
    endScreen.classList.remove('hidden');
    state.score += 100; // +100 pts por "Finaliza todo el juego"
    finalScoreEl.textContent = `Puntos totales: ${state.score}`;
    
    badgesEl.innerHTML = '';
    state.badges.forEach(b => {
      const span = document.createElement('span');
      span.className = 'badge';
      span.textContent = b;
      badgesEl.appendChild(span);
    });
  }
  
  function updateScore(points) {
    state.score += points;
  }

  // ----------------------------------------------------------------------------------
  // BUCLE PRINCIPAL DEL JUEGO (Game Loop) (Mantenido)
  // ----------------------------------------------------------------------------------
  function loop(ts) { 
      const dt = Math.min(0.05, (ts - lastTime) / 1000);
      lastTime = ts;
      
      if (!state.paused && state.running) { 
          update(dt);
      }
      
      render();
      
      if (state.running) requestAnimationFrame(loop); 
  }
  
  // ----------------------------------------------------------------------------------
  // LÓGICA DE ACTUALIZACIÓN (Update) (Mantenido)
  // ----------------------------------------------------------------------------------
  function update(dt) {
    // Manejo del Feedback (Pausa visual)
    if (feedback.timer > 0) {
        feedback.timer -= dt;
        if (feedback.timer <= 0 && feedback.type !== 'level') {
            state.paused = false; 
        }
        if (feedback.type === 'level') return; 
    }
    
    // Lógica de movimiento
    let moveLeft = keys['arrowleft'] || keys['a'] || mobileLeft;
    let moveRight = keys['arrowright'] || keys['d'] || mobileRight;
    let jump = keys['arrowup'] || keys['w'] || keys[' ' ] || mobileJump;

    if (moveLeft) { player.vx = -player.speed; player.facing = 'left'; }
    else if (moveRight) { player.vx = player.speed; player.facing = 'right'; }
    else { player.vx = 0; player.facing = 'front'; }

    if (jump && player.onGround) {
      player.vy = player.jumpSpeed;
      player.onGround = false;
      player.facing = 'hand';
      playAudio('audio_jump'); 
    }

    player.vy += 1500 * dt; // Gravedad
    player.x += player.vx * dt;
    player.y += player.vy * dt;

    // Clamp player position
    if (player.x < 0) player.x = 0;
    if (player.x + player.w > WORLD_WIDTH) player.x = WORLD_WIDTH - player.w;
    if (player.y > canvas.height) {
      player.x = 40; player.y = 460; player.vy = 0; 
    }

    const level = levels[state.currentLevel];
    player.onGround = false;
    
    // Colisión con plataformas 
    const previousY = player.y - player.vy * dt;
    for (const p of level.platforms) {
      const plat = {x:p.x,y:p.y,w:p.w,h:p.h};
      
      if (player.x + player.w > plat.x && player.x < plat.x + plat.w) {
        if (player.y + player.h > plat.y && previousY + player.h <= plat.y) {
          player.y = plat.y - player.h;
          player.vy = 0;
          player.onGround = true;
        } else if (player.y < plat.y + plat.h && previousY >= plat.y + plat.h) {
          player.y = plat.y + plat.h;
          player.vy = 0;
        }
      }
    }

    // Colisión con spirits (Activa el modal)
    spiritToRemoveIndex = -1;
    for (let i = 0; i < level.spirits.length; i++) {
      const s = level.spirits[i];
      const spiritBox = {x:s.x, y:s.y, w:s.w, h:s.h};
      const playerBox = {x:player.x, y:player.y, w:player.w, h:player.h};

      if (aabb(playerBox, spiritBox)) {
        if (window.GAME_QUESTIONS) {
          const currentQuestions = questionsData[state.currentLevel];
          let questionObj = currentQuestions ? currentQuestions[s.index] : null;

          if (questionObj) {
              openTrivia(questionObj, state.currentLevel, i); 
              break; 
          }
        }
      }
    }

    // flag check (Fin de nivel)
    const flag = level.flag;
    if (player.x + player.w > flag.x && player.y < flag.y + flag.h && player.x < flag.x + flag.w) {
      onLevelComplete();
    }
    
    // Lógica de la Cámara (Scroll)
    cameraX = player.x - VIEWPORT_WIDTH / 2;
    if (cameraX < 0) cameraX = 0;
    if (WORLD_WIDTH > VIEWPORT_WIDTH) {
        if (cameraX > WORLD_WIDTH - VIEWPORT_WIDTH) cameraX = WORLD_WIDTH - VIEWPORT_WIDTH;
    } else {
        cameraX = 0; 
    }
  }

  // ----------------------------------------------------------------------------------
  // LÓGICA DE DIBUJO (Render) (Mantenido)
  // ----------------------------------------------------------------------------------
  function render() {
    ctx.clearRect(0,0,VIEWPORT_WIDTH,canvas.height);

    const level = levels[state.currentLevel];
    const bgKey = level.bgKey; 
    const bgImg = IMAGES[bgKey];
    
    if (bgImg) {
      ctx.drawImage(bgImg, cameraX, 0, VIEWPORT_WIDTH, canvas.height, 
                    0, 0, VIEWPORT_WIDTH, canvas.height);
    } else {
      const gradient = ctx.createLinearGradient(0,0,0,canvas.height);
      gradient.addColorStop(0,'#6dd3ff22'); gradient.addColorStop(1,'#ffd16611');
      ctx.fillStyle = gradient;
      ctx.fillRect(0,0,VIEWPORT_WIDTH,canvas.height);
    }
    
    ctx.save();
    ctx.translate(-cameraX, 0); 
    
    // Platforms
    ctx.fillStyle = '#07263b';
    for (const p of level.platforms) ctx.fillRect(p.x, p.y, p.w, p.h);

    // Spirits (destellos)
    for (const s of level.spirits) {
      const t = Date.now() / 200;
      ctx.save();
      ctx.globalAlpha = 0.9 + Math.sin(t) * 0.1;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x + s.w/2, s.y + s.h/2, Math.max(s.w,s.h), 0, Math.PI*2);
      ctx.fill();
      ctx.restore();

      if (IMAGES.spirit) {
        ctx.drawImage(IMAGES.spirit, s.x - 6, s.y - 6, s.w + 12, s.h + 12);
      } else {
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(s.x, s.y, s.w, s.h);
      }
    }

    // Flag (bandera)
    ctx.fillStyle = '#2ecc71';
    const f = level.flag;
    ctx.fillRect(f.x, f.y, f.w, f.h);

    // Player
    player.draw(ctx);
    
    ctx.restore(); 
    
    
    // Dibujar el feedback (si está activo)
    if (feedback.timer > 0) {
      ctx.save();
      ctx.font = '24px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 10;
      
      let color = '#ffffff';
      if (feedback.type === 'correct') color = '#6ee7b7'; 
      else if (feedback.type === 'wrong') color = '#ff6b6b'; 
      else if (feedback.type === 'level') color = '#ffd166'; 
      
      ctx.fillStyle = color;
      
      const totalDuration = (feedback.type === 'level') ? 3 : 1.5;
      const elapsed = totalDuration - feedback.timer;
      const scale = 1 + 0.1 * Math.sin(elapsed * 10); 
      
      ctx.translate(VIEWPORT_WIDTH / 2, canvas.height / 2);
      ctx.scale(scale, scale);
      
      ctx.fillText(feedback.message, 0, 0); 

      ctx.restore();
    }
    
  }
  

  // ----------------------------------------------------------------------------------
  // MANEJO DE EVENTOS (Input Handling) (Mantenido)
  // ----------------------------------------------------------------------------------
  
  // Teclado
window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  
  // ⬅️ CORRECCIÓN: NO prevenir acciones de teclado si el foco está en un campo de texto (como el textarea del reto final).
  const focusedElement = document.activeElement;
  if (focusedElement === finalPost) {
      // Permitir la entrada de texto normal si el usuario está escribiendo el post.
      return; 
  }

  if (['arrowleft', 'arrowright', 'arrowup', 'a', 'd', 'w', ' '].includes(key)) {
    keys[key] = true; 
    e.preventDefault(); 
  }
});
  window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (['arrowleft', 'arrowright', 'arrowup', 'a', 'd', 'w', ' '].includes(key)) {
      keys[key] = false;
    }
  });

  // Controles Móviles (Touch) 
  const setMobileControl = (btn, state) => {
      if (btn === leftBtn) mobileLeft = state;
      else if (btn === rightBtn) mobileRight = state;
      else if (btn === jumpBtn) mobileJump = state;
  };

  [leftBtn, rightBtn, jumpBtn].forEach(btn => {
      btn.addEventListener('pointerdown', (e) => { 
          e.preventDefault(); 
          setMobileControl(btn, true); 
      });
      
      const release = (e) => { 
          setMobileControl(btn, false); 
      };
      
      btn.addEventListener('pointerup', release);
      btn.addEventListener('pointercancel', release);
      btn.addEventListener('pointerleave', release); 
  });
  
  // ----------------------------------------------------------------------------------
  // CONTROLES: START, HOWTO, CLOSE, PAUSE, REPLAY (Mantenido)
  // ----------------------------------------------------------------------------------

  function startGame() {
      menu.classList.add('hidden');
      gameScreen.classList.remove('hidden');
      state.running = true;
      state.score = 0;
      state.badges = new Set();
      startLevel(0);
      lastTime = performance.now();
      requestAnimationFrame(loop);
  }

  startBtn.addEventListener('click', startGame);

  howtoBtn.addEventListener('click', () => {
    menu.classList.add('hidden');
    howtoScreen.classList.remove('hidden');
  });
  
  closeHowto.addEventListener('click', () => {
    howtoScreen.classList.add('hidden');
    menu.classList.remove('hidden');
  });

  replayBtn.addEventListener('click', () => {
    endScreen.classList.add('hidden');
    menu.classList.remove('hidden');
    state.score = 0;
    state.badges.clear();
    startLevel(0); // Reinicia el nivel 0
    // state.running permanece true
  });
  
  pauseBtn.addEventListener('click', () => {
    state.paused = !state.paused;
    pauseBtn.textContent = state.paused ? '▶' : '||';
    if(state.paused) {
        displayFeedback('Juego Pausado', 'pause');
        if(modalTimerInterval) clearInterval(modalTimerInterval);
    } else {
        feedback.timer = 0; // Quita el mensaje de pausa
        // Si el modal de trivia está abierto (solo en Nivel 1), reactivar timer
        if(!modal.classList.contains('hidden') && state.currentLevel === 0) {
            // No reactivamos el timer para simplificar, el jugador puede reintentar si se le acaba
        }
    }
  });
  
  // Inicialización
  function init() {
    preloadResources(() => {
        // Recursos cargados, iniciar UI.
        menu.classList.remove('hidden');
    });
  }

  window.addEventListener('load', init);
})();