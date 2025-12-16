// src/game.js - Versión final con Nivel 3 (Encounter/Fake News), correcciones de input, audio intro al clic, PAUSA operativa, y reanudación más rápida.

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
  const modalScenario = document.getElementById('modal-scenario'); 
  const modalQuestion = document.getElementById('modal-question');
  const modalChoices = document.getElementById('modal-choices');
  const modalTimer = document.getElementById('modal-timer');
  const modalFeedback = document.getElementById('modal-feedback');
  const submitAnswerBtn = document.getElementById('submit-answer');
  const skipAnswerBtn = document.getElementById('skip-answer');

  // Modal Final de Entrada de Texto (Twit)
  const finalModal = document.getElementById('final-modal');
  const finalPostInput = document.getElementById('final-post-input'); 
  const userPostText = document.getElementById('user-post-text'); 
  const submitPostBtn = document.getElementById('submit-post-btn'); 

  // Modal de Publicación Final (Confirmación del Post Estilizado)
  const publishConfirmModal = document.getElementById('publish-confirm-modal'); 
  const publishedPostPreview = document.getElementById('published-post-preview'); 
  const finishGameBtn = document.getElementById('finish-game-btn'); 
  // Pantalla Final
  const endScreen = document.getElementById('end-screen');
  const finalScoreEl = document.getElementById('final-score');
  const badgesEl = document.getElementById('badges');
  const replayBtn = document.getElementById('replay');

  // Controles Móviles
  const leftBtn = document.getElementById('left-btn');
  const rightBtn = document.getElementById('right-btn');
  const jumpBtn = document.getElementById('jump-btn');

  // ELEMENTOS DE UI PARA EL MATCH-MODAL (Nivel 2)
  const matchModal = document.getElementById('match-modal');
  const matchTitle = document.getElementById('match-title');
  const matchPrompt = document.getElementById('match-prompt');
  const dilemmaCardsContainer = document.getElementById('dilemma-cards');
  const matchResultsBox = document.getElementById('match-results-box');
  const matchFeedbackMessage = document.getElementById('match-feedback-message');
  const matchCorrectPhrase = document.getElementById('match-correct-phrase');
  const closeMatchModalBtn = document.getElementById('close-match-modal');


  // --- AUDIO Y RECURSOS
  const ASSETS = {
    // IMAGENES
    fondo_n1: 'src/Imagenes_L9/fondo_n1.png',
    fondo_n2: 'src/Imagenes_L9/fondo_n2.png',
    fondo_n3: 'src/Imagenes_L9/fondo_n3.png',
    player_front: 'src/Imagenes_L9/Elias_frente.png',
    player_front_hand: 'src/Imagenes_L9/Elias_frente_mano_levantada.png',
    player_right: 'src/Imagenes_L9/Elias_perfil_derecho.png',
    player_left: 'src/Imagenes_L9/Elias_perfll_izquierdo.png', 
    fondo_n1_act: 'src/Imagenes_L9/fondo_n1_act.png',
    

    //Nuevos Espiritus
    agua: 'src/Imagenes_L9/L9_agua.png',
    fuego: 'src/Imagenes_L9/L9_Fuego.png',
    nube_espiritu: 'src/Imagenes_L9/L9_Nube.png',
    paloma: 'src/Imagenes_L9/L9_Paloma.png',
    sello: 'src/Imagenes_L9/L9_Sello.png',
    
    // SPIRITS Y NUBES (Coleccionables)
    spirit: 'src/Imagenes_L9/Espiritu_fuego.png', // Spirit original
    spiritt: 'src/Imagenes_L9/espiritu.png',     // Segundo Spirit
    nube: 'src/Imagenes_L9/nube.png',           // Nube
    celular: 'src/Imagenes_L9/FondoIndex.png',   // Celular (Nivel 2)
    
    // PREGUNTAS (Nivel 3)
    pregunta1: 'src/Imagenes_L9/pregunta1.png',
    pregunta2: 'src/Imagenes_L9/pregunta2.png',
    pregunta3: 'src/Imagenes_L9/pregunta3.png',
    pregunta4: 'src/Imagenes_L9/pregunta4.png',


    don_S: 'src/Imagenes_L9/S.png', // Sabiduría
    don_I: 'src/Imagenes_L9/I.png', // Inteligencia
    don_CI: 'src/Imagenes_L9/CI.png', // Ciencia
    don_F: 'src/Imagenes_L9/F.png', // Fortaleza
    don_P: 'src/Imagenes_L9/P.png', // Piedad
    don_T: 'src/Imagenes_L9/T.png', // Temor de Dios
    don_C: 'src/Imagenes_L9/C.png', // Consejo
    
    // AUDIO (ASUMIMOS RUTAS MP3)
    audio_jump: 'src/Audio/jump.mp3', 
    audio_correct: 'src/Audio/correct.mp3',
    audio_wrong: 'src/Audio/incorrect.mp3',
    audio_level_complete: 'src/Audio/levelup.mp3',
    audio_intro: 'src/Audio/intro.mp3', 
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

  // Array de imágenes disponibles para niveles 1 y 2
  const SPIRIT_ASSET_KEYS = ['spirit', 'spiritt', 'nube', 'agua', 'fuego', 'paloma', 'sello', 'nube_espiritu'];


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

  // 🛑 FUNCIONES DE MÚSICA DE FONDO 🛑
  let backgroundMusic = null; // Variable para controlar la música de fondo

  function playBackgroundMusic(key, loop = true) {
      // 1. Detener la música anterior si existe
      if (backgroundMusic) {
          backgroundMusic.pause();
          backgroundMusic.currentTime = 0;
          backgroundMusic = null;
      }
      
      // 2. Reproducir la nueva pista
      if (AUDIO[key]) {
          // Usar cloneNode para no afectar al Audio original cargado
          backgroundMusic = AUDIO[key].cloneNode(); 
          backgroundMusic.loop = loop;
          backgroundMusic.volume = 0.5; // Volumen para la música de fondo
          backgroundMusic.play().catch(e => console.warn("Background music play error:", e));
      }
  }

  function stopBackgroundMusic() {
      if (backgroundMusic) {
          backgroundMusic.pause();
          backgroundMusic.currentTime = 0;
          backgroundMusic = null;
      }
  }
  // 🛑 FIN FUNCIONES DE MÚSICA DE FONDO 🛑

  // game state
  let state = {
    running: false,
    paused: false,
    currentLevel: 0,
    score: 0,
    badges: new Set(),
    currentQuestionIndex: 0,
    reachedGoal: false // 🛑 NUEVA PROPIEDAD: True si el jugador toca la bandera
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
  let spiritToRemoveIndex = -1; // Índice del espíritu a eliminar si la respuesta es correcta

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
      this.x = x;
      this.y = y;
      this.w = 52;
      this.h = 64;
      this.vx = 0;
      this.vy = 0;
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
  // ... (Tu array de niveles 'levels' se mantiene sin cambios)
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
        {x:130,y:380,w:36,h:36, type: 'trivia', index: 0, asset: SPIRIT_ASSET_KEYS[Math.floor(Math.random() * SPIRIT_ASSET_KEYS.length)]},
        {x:340,y:320,w:36,h:36, type: 'trivia', index: 1, asset: SPIRIT_ASSET_KEYS[Math.floor(Math.random() * SPIRIT_ASSET_KEYS.length)]},
        {x:530,y:260,w:36,h:36, type: 'trivia', index: 2, asset: SPIRIT_ASSET_KEYS[Math.floor(Math.random() * SPIRIT_ASSET_KEYS.length)]},
        {x:730,y:380,w:36,h:36, type: 'trivia', index: 3, asset: SPIRIT_ASSET_KEYS[Math.floor(Math.random() * SPIRIT_ASSET_KEYS.length)]},
        {x:940,y:320,w:36,h:36, type: 'trivia', index: 4, asset: SPIRIT_ASSET_KEYS[Math.floor(Math.random() * SPIRIT_ASSET_KEYS.length)]},
      ],
      flag: {x:1200,y:468,w:48,h:72, assetKey: 'celular'}
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
        {x:1050,y:500,w:100,h:20}, // Consejo (Cercano a la meta)
      ],
      spirits: [
        {x:120,y:420,w:36,h:36, type: 'match_dilemma', index: 0, asset: SPIRIT_ASSET_KEYS[Math.floor(Math.random() * SPIRIT_ASSET_KEYS.length)]}, // Sabiduría
        {x:320,y:360,w:36,h:36, type: 'match_dilemma', index: 1, asset: SPIRIT_ASSET_KEYS[Math.floor(Math.random() * SPIRIT_ASSET_KEYS.length)]}, // Inteligencia
        {x:500,y:300,w:36,h:36, type: 'match_dilemma', index: 2, asset: SPIRIT_ASSET_KEYS[Math.floor(Math.random() * SPIRIT_ASSET_KEYS.length)]}, // Ciencia
        {x:680,y:440,w:36,h:36, type: 'match_dilemma', index: 3, asset: SPIRIT_ASSET_KEYS[Math.floor(Math.random() * SPIRIT_ASSET_KEYS.length)]}, // Fortaleza
        {x:850,y:380,w:36,h:36, type: 'match_dilemma', index: 4, asset: SPIRIT_ASSET_KEYS[Math.floor(Math.random() * SPIRIT_ASSET_KEYS.length)]}, // Piedad
        {x:1050,y:320,w:36,h:36, type: 'match_dilemma', index: 5, asset: SPIRIT_ASSET_KEYS[Math.floor(Math.random() * SPIRIT_ASSET_KEYS.length)]}, // Temor de Dios
        {x:1100,y:460,w:36,h:36, type: 'match_dilemma', index: 6, asset: SPIRIT_ASSET_KEYS[Math.floor(Math.random() * SPIRIT_ASSET_KEYS.length)]}, // Consejo
      ],
      flag: {x:1200,y:468,w:48,h:72, assetKey: 'celular'}
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
        
      ],
      spirits: [
        {x:120,y:420,w:36,h:36, type: 'encounter', index: 0, asset: 'pregunta1'},
        {x:320,y:380,w:36,h:36, type: 'encounter', index: 1, asset: 'pregunta2'},
        {x:540,y:320,w:36,h:36, type: 'encounter', index: 2, asset: 'pregunta3'},
        {x:760,y:260,w:36,h:36, type: 'encounter', index: 3, asset: 'pregunta4'},
      ],
      flag: {x:1200,y:468,w:48,h:72, assetKey: 'celular'}
    }
  ];

  // --- Modal logic
  let modalTimerInterval = null;
  let questionsData = [window.GAME_QUESTIONS.level1, window.GAME_QUESTIONS.level2, window.GAME_QUESTIONS.level3];


  function displayFeedback(message, type, duration = 1.5) { // 🛑 DEFAULT duration=1.5s
    feedback.message = message;
    feedback.type = type;
    feedback.timer = (type === 'level') ? 3.5 : duration; // Nivel completado tiene 3.5s
  }

  // ----------------------------------------------------------------------
  // 🛑 FUNCIÓN MEJORADA: Cierre para Trivia/Encounter (Nivel 1 y 3)
  // ----------------------------------------------------------------------
  function closeModal(resultType, pointsAwarded = 0) {
    if (modalTimerInterval) {
      clearInterval(modalTimerInterval);
      modalTimerInterval = null;
    }
    modal.classList.add('hidden');

    // 🛑 IMPORTANTE: Solo reanudar el juego si NO es un éxito (la función de éxito lo reanuda después del delay)
    if (resultType !== 'correct') {
      state.paused = false;
    }

    modalFeedback.textContent = '';

    if (resultType === 'correct' || resultType === 'partial') {
      // 🛑 Los puntos y la eliminación del espíritu ahora se manejan *dentro* de submitModalAnswer
      const message = resultType === 'correct' ?
        `¡Genial! ¡El Espíritu Santo está contigo! (+${pointsAwarded} Puntos) 🎉` :
        `¡Bien hecho! (+${pointsAwarded} Puntos) 🎉`;
      playAudio('audio_correct');
      displayFeedback(message, 'correct', 2.0); // Feedback más largo para acierto
    } else if (resultType === 'wrong') {
      // 🛑 Si es incorrecto, NO se suman puntos y NO se elimina el espíritu.
      playAudio('audio_wrong');
      displayFeedback("¡No te rindas! Escucha a tu corazón. ❤️", 'wrong', 2.0); // Feedback más largo para fallo
    }

    // El espíritu se elimina si spiritToRemoveIndex fue seteado y la respuesta fue correcta
    spiritToRemoveIndex = -1; // Resetear índice
    updateHUD();
  }

  // ----------------------------------------------------------------------
  // 🛑 FUNCIÓN MEJORADA: Cierre para Emparejamiento (Nivel 2)
  // ----------------------------------------------------------------------
  function closeMatchModal(resultType, pointsAwarded = 0) {
    matchModal.classList.add('hidden');
    matchResultsBox.classList.add('hidden');
    matchResultsBox.classList.remove('active');
    state.paused = false; // El juego se reanuda inmediatamente

    if (resultType === 'correct') {
      state.score += pointsAwarded;
      playAudio('audio_correct');
      displayFeedback(`¡Don viralizado! (+${pointsAwarded} Puntos) 🎉`, 'correct', 2.0);

      // 🛑 ELIMINACIÓN: Solo si es correcto
      if (spiritToRemoveIndex !== -1) {
        levels[state.currentLevel].spirits.splice(spiritToRemoveIndex, 1);
        spiritToRemoveIndex = -1;
      }
    } else if (resultType === 'wrong') {
      // 🛑 NO ELIMINAR EL ESPÍRITU si es incorrecto
      playAudio('audio_wrong');
      displayFeedback("Esa no era la app correcta. ¡A estudiar los Dones! ❤️", 'wrong', 2.0);
    }

    // Limpia el estado 'flipped' y 'wrong'
    dilemmaCardsContainer.querySelectorAll('.don-card').forEach(card => {
      card.classList.remove('flipped', 'wrong');
    });

    updateHUD();
  }


  function openTrivia(questionObj, levelIndex, spiritIndex) {
    currentQuestion = questionObj;
    currentSelection = null;
    state.paused = true;
    spiritToRemoveIndex = spiritIndex; // Se almacena el índice aquí, pero solo se usa si acierta

    const qType = questionObj.type || 'trivia';
    const isMatchDilemma = qType === 'match_dilemma';

    // LÓGICA PARA NIVEL 2: DILEMA DE EMPAREJAMIENTO (Mantenida)
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
            if (correctCard) correctCard.classList.add('flipped');

            closeMatchModalBtn.onclick = () => closeMatchModal('wrong', 0);
          }
        };
        dilemmaCardsContainer.appendChild(card);
      });

      return;
    }

    // Lógica para TRIVIA (Nivel 1) y ENCOUNTER (Nivel 3)

    modal.classList.remove('hidden');
    matchModal.classList.add('hidden');

    // Resetear elementos
    modalChoices.innerHTML = '';
    modalTimer.classList.remove('hidden');
    skipAnswerBtn.classList.remove('hidden');
    modalFeedback.textContent = '';
    submitAnswerBtn.textContent = "Enviar";
    submitAnswerBtn.disabled = true;


    modalTitle.textContent = `Desafío - ${questionObj.title || levels[levelIndex].name}`;
    modalQuestion.textContent = questionObj.question || questionObj.prompt || "Desafío Pendiente";

    // 🛑 LÓGICA ESPECÍFICA PARA ENCOUNTER (Nivel 3)
    if (qType === 'encounter') {
      modalTimer.classList.add('hidden');
      skipAnswerBtn.classList.add('hidden');
      submitAnswerBtn.textContent = "Confirmar";
      submitAnswerBtn.disabled = true;


      // Botón 'Verdad (Conexión Divina)'
      const btnTrue = document.createElement('button');
      btnTrue.textContent = 'Verdad (Conexión Divina)';
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

        btn.dataset.index = idx;
        modalChoices.appendChild(btn);
      });

      submitAnswerBtn.disabled = true;

      // Configurar el timer para Nivel 1
      let timeLeft = (levelIndex === 0) ? 30 : 9999;
      modalTimer.textContent = timeLeft;
      modalTimer.classList.toggle('hidden', levelIndex !== 0);

      if (modalTimerInterval) clearInterval(modalTimerInterval);
      if (levelIndex === 0) {
        modalTimerInterval = setInterval(() => {
          if (timeLeft > 0) {
            timeLeft--;
            modalTimer.textContent = timeLeft;
          } else {
            clearInterval(modalTimerInterval);
            // 🛑 SI SE ACABA EL TIEMPO: Muestra feedback y reanuda, NO elimina el espíritu.
            closeModal('wrong', 0);
          }
        }, 1000);
      }
    }

    // Listener de selección unificado
    modalChoices.querySelectorAll('.choice').forEach(choice => {
      choice.addEventListener('click', () => {
        [...modalChoices.children].forEach(ch => ch.classList.remove('selected'));
        choice.classList.add('selected');

        submitAnswerBtn.disabled = false;

        if (currentQuestion.type === 'encounter') {
          currentSelection = choice.dataset.answer;
        } else {
          currentSelection = parseInt(choice.dataset.index);
        }
      });
    });

    // La validación se mueve al listener externo `submitAnswerBtn`
    skipAnswerBtn.onclick = () => {
      // 🛑 SI USA SKIP: Muestra feedback y reanuda, NO elimina el espíritu.
      closeModal('wrong', 0);
    };
  }

  // ----------------------------------------------------------------------
  // 🛑 FUNCIÓN MEJORADA: Lógica de envío de respuesta (Unificado)
  // ----------------------------------------------------------------------
  function submitModalAnswer() {
    if (currentSelection === null) {
      modalFeedback.textContent = '¡Selecciona una opción antes de confirmar!';
      modalFeedback.style.color = '#ffeb3b';
      return;
    }

    submitAnswerBtn.disabled = true;
    let isCorrect = false;
    let points = 0;
    let resultType = 'wrong';

    if (currentQuestion.type === 'trivia') {
      isCorrect = currentSelection === currentQuestion.correctIndex;
      points = isCorrect ? 10 : 0;
      resultType = isCorrect ? 'correct' : 'wrong';

    } else if (currentQuestion.type === 'encounter') {
      const correctAnswerStr = String(currentQuestion.correctAnswer);
      isCorrect = currentSelection === correctAnswerStr;
      points = isCorrect ? currentQuestion.points : 0;
      resultType = isCorrect ? 'correct' : 'wrong';
    }

    // ------------------------------------------------------------------
    // ❌ RESPUESTA INCORRECTA
    // ------------------------------------------------------------------
    if (!isCorrect) {
      modalFeedback.textContent =
        currentQuestion.type === 'encounter' ?
        '❌ ¡Fake News! Esa conexión no es del Evangelio. Intenta de nuevo.' :
        '❌ Respuesta incorrecta. Sigue evangelizando. Intenta de nuevo.';
      modalFeedback.style.color = '#ff6b6b';
      playAudio('audio_wrong');

      // 🛑 NO SE CIERRA EL MODAL. Se limpia la selección y se reactiva el botón
      setTimeout(() => {
        submitAnswerBtn.disabled = false;
        currentSelection = null; // Limpiar selección para obligar a seleccionar de nuevo
        // Remover la clase 'selected' y re-habilitar visualmente
        modalChoices.querySelectorAll('.choice').forEach(ch => ch.classList.remove('selected'));
        modalFeedback.textContent = 'Selecciona una nueva opción.';
        modalFeedback.style.color = '#ffffff';
      }, 1000);

      // Deshabilitar la selección temporalmente
      modalChoices.querySelectorAll('.choice').forEach(btn => btn.disabled = true);
      setTimeout(() => {
        modalChoices.querySelectorAll('.choice').forEach(btn => btn.disabled = false);
      }, 1000);

      return; // Detener el flujo aquí
    }

    // ------------------------------------------------------------------
    // ✔️ RESPUESTA CORRECTA
    // ------------------------------------------------------------------
    state.score += points;

    modalFeedback.textContent =
      currentQuestion.type === 'encounter' ?
      `✔️ ¡Validado! +${points} pts. Es una Conexión Divina.` :
      `✔️ ¡Correcto! ¡Sigue así! (+${points} pts)`;
    modalFeedback.style.color = '#6ee7b7';
    playAudio('audio_correct');

    // 🛑 ELIMINAR ESPÍRITU AHORA
    if (spiritToRemoveIndex !== -1) {
      levels[state.currentLevel].spirits.splice(spiritToRemoveIndex, 1);
      spiritToRemoveIndex = -1;
    }

    // Cierra el modal después de 1 segundo (con mensaje de éxito)
    setTimeout(() => {
      // 🛑 Se llama a closeModal solo para ocultar el modal y mostrar el feedback global
      closeModal(resultType, points);
      state.paused = false; // Reanudar el juego (la pausa se hizo en openTrivia)
      updateHUD();
    }, 1500);
  }

  // ----------------------------------------------------------------------
  // Listener Global para el botón 'Enviar/Confirmar' del Modal
  // ----------------------------------------------------------------------
  submitAnswerBtn.addEventListener('click', submitModalAnswer);


  function updateHUD() {
    scoreEl.textContent = `Puntos: ${state.score}`;
    levelLabel.textContent = `Nivel ${state.currentLevel+1}: ${levels[state.currentLevel].name}`;
  }

  function startLevel(index) {
    // stopBackgroundMusic(); // Esto se hace en startGame
    state.currentLevel = index;
    state.currentQuestionIndex = 0;
    state.reachedGoal = false; // Resetear el estado de la bandera
    player = new Player(40, 460);
    lastTime = performance.now();
    state.paused = false;
    updateHUD();
  }

  // ----------------------------------------------------------------------
  // 🛑 FUNCIÓN MEJORADA: Lógica de Nivel Completo
  // ----------------------------------------------------------------------
  function onLevelComplete() {
    const spiritsRemaining = levels[state.currentLevel].spirits.length;

    // 🛑 VALIDACIÓN CLAVE: Si quedan espíritus, bloquear el avance.
    if (spiritsRemaining > 0) {
      // 1. Mostrar un mensaje de bloqueo y bloquear movimiento inmediatamente
      displayFeedback(`❗ Aún quedan ${spiritsRemaining}¡No puedes avanzar!`, "wrong", 1.0);
      state.paused = true; 
      
      // 2. Quitar la bandera de "alcanzada" para permitir el reintento.
      state.reachedGoal = false;

      setTimeout(() => {
        // Asegúrate de que solo reanudamos si *ningún* modal de pregunta está visible.
        const isModalOpen = !modal.classList.contains('hidden') || !matchModal.classList.contains('hidden');
        
        if (!isModalOpen) {
           state.paused = false; 
        }
      }, 1); // 3 segundos, igual que la duración del feedback

      return; // ⬅️ Bloquea el avance del nivel
    }

    // Si llegamos aquí, el nivel está realmente completo:
    state.score += 50;

    const badgeMap = ['🟢 “Follower Confirmado”', '🔵 “Espíritu ON”', '🟣 “Influencer del Evangelio”'];
    state.badges.add(badgeMap[state.currentLevel]);

    const nextLevelIndex = state.currentLevel + 1;

    state.paused = true;
    playAudio('audio_level_complete');
    displayFeedback(`¡Wow, has viralizado un mensaje de amor!`);

    // Esperar el tiempo de feedback de nivel (3.5s) antes de avanzar
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
    
    // Referencias al modal de entrada
    const finalPostInput = document.getElementById('final-post-input');
    const submitPostBtn = document.getElementById('submit-post-btn');
    const userPostText = document.getElementById('user-post-text');

    // --- 1. CONFIGURACIÓN INICIAL ---
    finalPostInput.value = '';
    userPostText.textContent = '¡Escribe tu mensaje para viralizar los Dones aquí!';

    // --- 2. LISTENER PARA LA PREVISUALIZACIÓN EN TIEMPO REAL ---
    finalPostInput.oninput = () => {
        userPostText.textContent = finalPostInput.value.trim() || '¡Escribe tu mensaje para viralizar los Dones aquí!';
    };

    // --- 3. LISTENER DEL BOTÓN PUBLICAR (Llama a showPublishedPost) ---
    submitPostBtn.onclick = () => {
      const text = finalPostInput.value.trim();
      
      // Validación
      if (text.length < 15) { 
        alert('Tu post es muy corto. ¡Hazlo más viral! (Mínimo 15 caracteres).');
        return;
      }
      
      // Llama a la nueva función para mostrar el post final estilizado
      showPublishedPost(text);
    };
}


// ======================================================================
// 2. NUEVA FUNCIÓN showPublishedPost()
//    (Copia y pega esta función en game.js, cerca de openFinalChallenge)
// ======================================================================

function showPublishedPost(postText) {
    // 1. Ocultar el modal de entrada y mostrar el de confirmación
    finalModal.classList.add('hidden');
    publishConfirmModal.classList.remove('hidden');

    // 2. Puntaje (se aplica aquí al completar el reto)
    state.score += 30;
    
    // 3. Crear el HTML del post final (usa la paloma como imagen de post)
    publishedPostPreview.innerHTML = `
        <div class="post-header">
            <img src="src/Imagenes_L9/Elias_perfil_derecho.png" alt="Usuario" class="profile-pic"> 
            <span class="username">Elias_Evangeliza</span>
        </div>
        
        <img src="src/Imagenes_L9/L9_Paloma.png" alt="Imagen del Post" class="post-media">
        
        <div class="post-caption">
            <p id="caption-username" class="username">Elias_Evangeliza</p>
            <p class="post-text">${postText}</p>
            <span class="post-time">Viralizado Ahora</span>
        </div>
        <div class="post-actions">
            <span>❤️ 1,200 Me gusta</span>
            <span>💬 250 Comentar</span>
            <span>📤 Compartir</span>
        </div>
    `;

    // 4. Configurar el botón "Terminar Misión"
    finishGameBtn.onclick = () => {
        publishConfirmModal.classList.add('hidden');
        state.paused = false; 
        showEndScreen(); // Mostrar la pantalla de logros y puntuación final
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
  // BUCLE PRINCIPAL DEL JUEGO (Game Loop)
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
  // 🛑 LÓGICA DE ACTUALIZACIÓN (Update) MEJORADA
  // ----------------------------------------------------------------------------------
  function update(dt) {
    // Manejo del Feedback (Pausa visual)
    if (feedback.timer > 0) {
      feedback.timer -= dt;
      // Solo reanudar automáticamente si NO es un feedback de cambio de nivel
      if (feedback.timer <= 0 && feedback.type !== 'level') {
        //state.paused = false; // Se reanuda en onLevelComplete si es necesario
        feedback.message = null;
      }
      // Bloquea el movimiento durante el mensaje de nivel completo (3.5s)
      if (feedback.type === 'level' && feedback.timer > 0) return;
    }

    if (state.paused) return;

    // Lógica de movimiento (Mantenida)
    let moveLeft = keys['arrowleft'] || keys['a'] || mobileLeft;
    let moveRight = keys['arrowright'] || keys['d'] || mobileRight;
    let jump = keys['arrowup'] || keys['w'] || keys[' '] || mobileJump;

    if (moveLeft) {
      player.vx = -player.speed;
      player.facing = 'left';
    } else if (moveRight) {
      player.vx = player.speed;
      player.facing = 'right';
    } else {
      player.vx = 0;
      player.facing = 'front';
    }

    if (jump && player.onGround) {
      player.vy = player.jumpSpeed;
      player.onGround = false;
      player.facing = 'hand';
      playAudio('audio_jump');
    }

    player.vy += 1500 * dt;
    player.x += player.vx * dt;
    player.y += player.vy * dt;

    if (player.x < 0) player.x = 0;
    if (player.x + player.w > WORLD_WIDTH) player.x = WORLD_WIDTH - player.w;
    if (player.y > canvas.height) {
      player.x = 40;
      player.y = 460;
      player.vy = 0;
    }

    const level = levels[state.currentLevel];
    player.onGround = false;

    // Colisión con plataformas (Mantenida)
    const previousY = player.y - player.vy * dt;
    for (const p of level.platforms) {
      const plat = {
        x: p.x,
        y: p.y,
        w: p.w,
        h: p.h
      };

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

    // Colisión con spirits (Activa el modal) (Mantenida)
    spiritToRemoveIndex = -1;
    for (let i = 0; i < level.spirits.length; i++) {
      const s = level.spirits[i];
      const spiritBox = {
        x: s.x,
        y: s.y,
        w: s.w,
        h: s.h
      };
      const playerBox = {
        x: player.x,
        y: player.y,
        w: player.w,
        h: player.h
      };

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

    // 🛑 flag check (Fin de nivel) - Solo llama a onLevelComplete si la bandera no ha sido registrada.
    const flag = level.flag;
    if (aabb({x: player.x, y: player.y, w: player.w, h: player.h}, flag)) {
      if (!state.reachedGoal) {
        state.reachedGoal = true; // Marca que ha tocado la bandera
        onLevelComplete(); // Llama a la función que valida los espíritus
      }
    } else {
       // Permite al jugador reintentar tocar la bandera si fue bloqueado
       if (state.reachedGoal && levels[state.currentLevel].spirits.length > 0) {
           state.reachedGoal = false;
       }
    }


    // Lógica de la Cámara (Scroll) (Mantenida)
    cameraX = player.x - VIEWPORT_WIDTH / 2;
    if (cameraX < 0) cameraX = 0;
    if (WORLD_WIDTH > VIEWPORT_WIDTH) {
      if (cameraX > WORLD_WIDTH - VIEWPORT_WIDTH) cameraX = WORLD_WIDTH - VIEWPORT_WIDTH;
    } else {
      cameraX = 0;
    }
  }

  // ----------------------------------------------------------------------------------
  // LÓGICA DE DIBUJO (Render) (Mantenida)
  // ----------------------------------------------------------------------------------
  function render() {
    ctx.clearRect(0, 0, VIEWPORT_WIDTH, canvas.height);

    const level = levels[state.currentLevel];
    const bgKey = level.bgKey;
    const bgImg = IMAGES[bgKey];

    if (bgImg) {
      ctx.drawImage(bgImg, cameraX, 0, VIEWPORT_WIDTH, canvas.height,
        0, 0, VIEWPORT_WIDTH, canvas.height);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#6dd3ff22');
      gradient.addColorStop(1, '#ffd16611');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, VIEWPORT_WIDTH, canvas.height);
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

      // Aplicar destello blanco (halo) para todos
      ctx.globalAlpha = 0.9 + Math.sin(t) * 0.1;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x + s.w / 2, s.y + s.h / 2, Math.max(s.w, s.h), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Determinar la imagen a usar
      let spiritImg = null;
      let assetKey = s.asset;

      // Nivel 3 usa imágenes de preguntas
      if (state.currentLevel === 2) {
        spiritImg = IMAGES[assetKey];
      }
      // Nivel 1 y 2 usan combinación aleatoria
      else if (state.currentLevel === 0 || state.currentLevel === 1) {
        spiritImg = IMAGES[assetKey];
      }

      // Dibujar la imagen
      if (spiritImg) {
        ctx.drawImage(spiritImg, s.x - 6, s.y - 6, s.w + 12, s.h + 12);
      } else {
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(s.x, s.y, s.w, s.h);
      }
    }

    
    // Flag (bandera)
    const f = level.flag;
    const flagImg = IMAGES[f.assetKey]; // Intentar cargar la imagen usando la nueva clave

    if (flagImg) {
      // 🛑 DIBUJAR IMAGEN SI EXISTE
      ctx.drawImage(flagImg, f.x, f.y, f.w, f.h);
    } else {
      // DIBUJAR RECTÁNGULO DE COLOR (FALLBACK si la imagen no se carga)
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(f.x, f.y, f.w, f.h);
    }

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
      else if (feedback.type === 'level') color = '#f9c74f';

      ctx.fillStyle = color;
      ctx.fillText(feedback.message, VIEWPORT_WIDTH / 2, canvas.height / 2);
      ctx.restore();
    }
  }

  // ----------------------------------------------------------------------
  // 🕹️ INICIALIZACIÓN Y MANEJO DE EVENTOS (Mantenido)
  // ----------------------------------------------------------------------

  // Lógica de Pausa / Reanudar
  pauseBtn.addEventListener('click', () => {
    if (state.running && (modal && !modal.classList.contains('hidden') || matchModal && !matchModal.classList.contains('hidden'))) {
      return;
    }
    state.paused = !state.paused;
    pauseBtn.textContent = state.paused ? '▶️ Reanudar' : '⏸ Pausa';

    if (state.paused) {
      stopBackgroundMusic();
    }
  });


  document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    const isTyping =
      e.target.tagName === 'INPUT' ||
      e.target.tagName === 'TEXTAREA' ||
      e.target.isContentEditable;

    if (isTyping) return;

    if (['arrowleft', 'arrowright', 'arrowup', 'w', 'a', 'd', ' '].includes(key)) {
      keys[key] = true;
      e.preventDefault();
    }

    if (key === 'p') {
      pauseBtn.click();
    }
  });

  document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    const isTyping =
      e.target.tagName === 'INPUT' ||
      e.target.tagName === 'TEXTAREA' ||
      e.target.isContentEditable;

    if (isTyping) return;

    if (['arrowleft', 'arrowright', 'arrowup', 'w', 'a', 'd', ' '].includes(key)) {
      keys[key] = false;
    }
  });

  /// Controles Táctiles (Mobile) - MEJORADOS CON POINTER EVENTS
  // -----------------------------------------------------------
  
  // Función de Manejo (Reutilizable)
  function handleButton(btn, isDown, e) {
    if (e) e.preventDefault();
    if (btn === 'left') mobileLeft = isDown;
    else if (btn === 'right') mobileRight = isDown;
    else if (btn === 'jump') mobileJump = isDown;

    // Si estás reanudando, asegúrate de que el personaje deje de mirar la mano levantada
    if (!isDown && btn === 'jump') {
        player.facing = 'front';
    }
  }

  // EVENTOS PARA EL BOTÓN IZQUIERDA
  leftBtn.addEventListener('pointerdown', (e) => handleButton('left', true, e));
  leftBtn.addEventListener('pointerup', (e) => handleButton('left', false, e));
  leftBtn.addEventListener('pointerleave', (e) => handleButton('left', false, e)); // Para cuando el dedo/mouse se sale

  // EVENTOS PARA EL BOTÓN DERECHA
  rightBtn.addEventListener('pointerdown', (e) => handleButton('right', true, e));
  rightBtn.addEventListener('pointerup', (e) => handleButton('right', false, e));
  rightBtn.addEventListener('pointerleave', (e) => handleButton('right', false, e));

  // EVENTOS PARA EL BOTÓN SALTAR
  jumpBtn.addEventListener('pointerdown', (e) => handleButton('jump', true, e));
  jumpBtn.addEventListener('pointerup', (e) => handleButton('jump', false, e));
  jumpBtn.addEventListener('pointerleave', (e) => handleButton('jump', false, e));

  // 🛑 Listener de limpieza general para evitar que se quede pegado si el usuario arrastra el dedo fuera de la pantalla
  document.addEventListener('pointercancel', () => {
    mobileLeft = false;
    mobileRight = false;
    mobileJump = false;
    player.facing = 'front';
  });

  // Función principal de inicio de juego
  function startGame() {
    menu.classList.add('hidden');
    howtoScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    endScreen.classList.add('hidden');

    // Reiniciar estado
    state.running = true;
    state.score = 0;
    state.badges.clear();
    state.currentLevel = 0;

    

    // Iniciar el primer nivel
    startLevel(0);

    // Iniciar el loop principal
    requestAnimationFrame(loop);
  }

  // Manejo del flujo del juego al hacer clic en 'Empezar'
startBtn.addEventListener('click', () => {
  playAudio('audio_intro');
  startGame();
});

// 🛠️ CORRECCIÓN CLAVE: El botón de Reinicio recarga la página
replayBtn.addEventListener('click', () => {
  // Esto asegura que todo el estado del juego, incluyendo el canvas y los espíritus,
  // se reinicie completamente, eliminando el bug de las imágenes faltantes.
  window.location.reload(); 
});

// Mostrar/Ocultar pantalla de ayuda
howtoBtn.addEventListener('click', () => {
  menu.classList.add('hidden');
  howtoScreen.classList.remove('hidden');
});
closeHowto.addEventListener('click', () => {
  howtoScreen.classList.add('hidden');
  menu.classList.remove('hidden');
});


// Pre-carga y espera a que los recursos estén listos
preloadResources(() => {
  // Si la carga es exitosa, mostrar el menú
  document.getElementById('loading').classList.add('hidden');
  menu.classList.remove('hidden');
});

// 📢 EXPOSICIÓN DE FUNCIONES GLOBALES (PARA INTERACCIÓN EXTERNA)
window.game = {
  closeMatchModal: closeMatchModal, // Necesario para el Nivel 2 (Emparejamiento)
  // Puedes agregar más funciones públicas si las necesitas aquí
};

})();