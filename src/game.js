// src/game.js - Versión con jugabilidad completa implementada y lógica de rendering fija.

(() => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
  
    // UI elems
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
    
    const mobileControls = document.getElementById('mobile-controls');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const jumpBtn = document.getElementById('jump-btn');
  
    // --- AUDIO: DESACTIVADO POR DEFECTO 
    const audio = {
      jump: null, correct: null, wrong: null, levelComplete: null,
    };
  
    // -- RUTAS DE IMAGENES
    const ASSETS = {
      fondo: 'src/Imagenes_L9/Fondo.png',
      player_front: 'src/Imagenes_L9/Elias_frente.png',
      player_front_hand: 'src/Imagenes_L9/Elias_frente_mano_levantada.png',
      player_right: 'src/Imagenes_L9/Elias_perfil_derecho.png',
      player_left: 'src/Imagenes_L9/Elias_perfll_izquierdo.png', 
      spirit: 'src/Imagenes_L9/Espiritu_fuego.png',
      celular: 'src/Imagenes_L9/Vector_celular.png'
    };
  
    const IMAGES = {};
    let imagesToLoad = Object.keys(ASSETS).length;
    let imagesLoaded = 0;
  
    function preloadImages(onComplete) {
      imagesLoaded = 0;
      imagesToLoad = Object.keys(ASSETS).length;
      Object.entries(ASSETS).forEach(([key, path]) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
          IMAGES[key] = img;
          imagesLoaded++;
          if (imagesLoaded === imagesToLoad) onComplete();
        };
        img.onerror = (e) => {
          console.warn(`Error cargando imagen ${path}`, e);
          IMAGES[key] = null;
          imagesLoaded++;
          if (imagesLoaded === imagesToLoad) onComplete();
        };
      });
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
    
    // ⚠️ CRÍTICO: Variable global del jugador y para Input/Colisión
    let player; 
    let lastTime = 0;
    let keys = {}; // Estado de teclas presionadas
    let mobileLeft = false;
    let mobileRight = false;
    let mobileJump = false;

    // Función de Detección de Colisión (Axis-Aligned Bounding Box)
    function aabb(box1, box2) {
      return box1.x < box2.x + box2.w &&
             box1.x + box1.w > box2.x &&
             box1.y < box2.y + box2.h &&
             box1.y + box1.h > box2.y;
    }
  
    // Player Class 
    class Player {
        constructor(x, y) {
            this.x = x; this.y = y;
            this.w = 52; this.h = 64;
            this.vx = 0; this.vy = 0;
            
            // 🚀 MODIFICACIÓN 1: Aumentar la velocidad horizontal
            this.speed = 300; // De 220 a 300
            
            // 🚀 MODIFICACIÓN 2: Aumentar la fuerza de salto
            this.jumpSpeed = -600; // De -460 a -600 (Más negativo = más alto)
            
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
  
    // levels (más desafíos por nivel para la trivia)
    const levels = [
      {
        name: "Stories",
        bgKey: 'fondo',
        platforms: [
          {x:0,y:540,w:900,h:60},
          {x:120,y:440,w:160,h:20},
          {x:320,y:380,w:160,h:20},
          {x:560,y:320,w:160,h:20}
        ],
        // 5 desafíos de trivia según las preguntas proporcionadas
        spirits: [
          {x:150,y:380,w:36,h:36, type: 'trivia', index: 0},
          {x:360,y:320,w:36,h:36, type: 'trivia', index: 1},
          {x:590,y:260,w:36,h:36, type: 'trivia', index: 2}, 
          {x:750,y:400,w:36,h:36, type: 'trivia', index: 3}, 
          {x:450,y:500,w:36,h:36, type: 'trivia', index: 4}, 
        ],
        flag: {x:780,y:240,w:48,h:72}
      },
      {
        name: "Reels",
        bgKey: 'fondo',
        platforms: [
          {x:0,y:540,w:900,h:60},
          {x:200,y:460,w:160,h:20},
          {x:420,y:400,w:160,h:20},
          {x:640,y:340,w:160,h:20}
        ],
        spirits: [
          {x:220,y:420,w:36,h:36, type: 'match', index: 0}, 
          {x:460,y:360,w:36,h:36, type: 'match', index: 1},
        ],
        flag: {x:780,y:260,w:48,h:72}
      },
      {
        name: "Post del Día",
        bgKey: 'fondo',
        platforms: [
          {x:0,y:540,w:900,h:60},
          {x:100,y:460,w:120,h:20},
          {x:300,y:420,w:120,h:20},
          {x:520,y:360,w:120,h:20},
          {x:680,y:300,w:120,h:20}
        ],
        spirits: [
          {x:120,y:420,w:36,h:36, type: 'action', index: 0}, // alguien triste y Solo
          {x:320,y:380,w:36,h:36, type: 'action', index: 1}, // Notificación
          {x:540,y:320,w:36,h:36, type: 'action', index: 2}, // Recoge basura
        ],
        flag: {x:820,y:240,w:48,h:72}
      }
    ];

    // --- Trivia modal logic (Expandida para manejar todos los tipos de desafíos)
    let modalTimerInterval = null;
    let questionsData = [window.GAME_QUESTIONS.level1, window.GAME_QUESTIONS.level2, window.GAME_QUESTIONS.level3];

    function openTrivia(questionObj, levelIndex) {
      state.paused = true;
      modal.classList.remove('hidden');
      modalFeedback.textContent = '';
      modalTitle.textContent = `Desafío - ${levels[levelIndex].name}`;
      
      modalQuestion.textContent = questionObj.question || questionObj.prompt || "Desafío Pendiente";
      modalChoices.innerHTML = '';
      let selected = -1;
      let isActionChallenge = !questionObj.choices;

      if (questionObj.choices && Array.isArray(questionObj.choices)) {
        questionObj.choices.forEach((c, idx) => {
          const btn = document.createElement('div');
          btn.className = 'choice';
          btn.textContent = c;
          btn.addEventListener('click', ()=> {
            [...modalChoices.children].forEach(ch => ch.classList.remove('selected'));
            btn.classList.add('selected');
            selected = idx;
          });
          modalChoices.appendChild(btn);
        });
        submitAnswerBtn.textContent = "Enviar";
        submitAnswerBtn.classList.remove('hidden');
        skipAnswerBtn.classList.remove('hidden');
      } else {
        // Mostrar acción/mensaje para Nivel 3 (Acciones Reflexivas)
        const p = document.createElement('div');
        p.textContent = questionObj.text || questionObj.prompt || 'Contenido';
        p.className = 'choice selected';
        modalChoices.appendChild(p);
        submitAnswerBtn.textContent = "¡Entendido!";
        submitAnswerBtn.classList.remove('hidden');
        skipAnswerBtn.classList.add('hidden');
      }
  
      // Configurar temporizador (solo 30s para Nivel 1)
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
            modalFeedback.textContent = "Se acabó el tiempo.";
            closeModal(false);
          }
        }, 1000);
      }
  
      function closeModal(correct) {
        if (modalTimerInterval) { clearInterval(modalTimerInterval); modalTimerInterval = null; }
        modal.classList.add('hidden');
        state.paused = false;

        // Retroalimentación y puntos
        if (typeof correct === 'boolean') {
          if (correct) {
            state.score += 10; 
            modalFeedback.textContent = "¡Genial! ¡El Espíritu Santo está contigo! 🎉"; 
          } else {
            modalFeedback.textContent = "¡No te rindas! Escucha a tu corazón. ❤️"; 
          }
        }
        updateHUD();
      }

      // Handler de Envío
      submitAnswerBtn.onclick = () => {
        if (isActionChallenge) {
            state.score += 10; // +10 pts por Reto Reflexivo (Nivel 3)
            closeModal(true);
        } else if (questionObj.choices && selected >= 0) {
          const isCorrect = selected === questionObj.correctIndex;
          closeModal(isCorrect);
        } else {
          closeModal(false);
        }
      };
      
      skipAnswerBtn.onclick = () => { 
        closeModal(false); 
      };
    }
    
    function updateHUD(){ 
        scoreEl.textContent = `Puntos: ${state.score}`; 
        levelLabel.textContent = `Nivel ${state.currentLevel+1}: ${levels[state.currentLevel].name}`; 
    }
  
    function startLevel(index) {
        state.currentLevel = index;
        state.currentQuestionIndex = 0; 
        // ⚠️ La instancia del jugador se crea aquí
        player = new Player(40, 460); 
        lastTime = performance.now();
        state.paused = false;
        updateHUD();
    }
  
    function onLevelComplete() {
      state.score += 50; // +50 pts por completar un nivel
      
      const badgeMap = ['🟢 “Follower Confirmado”','🔵 “Espíritu ON”','🟣 “Influencer del Evangelio”'];
      state.badges.add(badgeMap[state.currentLevel]);
      
      if (state.currentLevel < levels.length - 1) {
        startLevel(state.currentLevel + 1);
      } else {
        openFinalChallenge();
      }
      updateHUD();
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
        state.score += 30; // +30 pts por Reto Final
        finalModal.classList.add('hidden');
        state.paused = false;
        showEndScreen();
      };
    }
  
    function showEndScreen() {
      endScreen.classList.remove('hidden');
      state.score += 100; // +100 pts por Finalizar todo el juego
      finalScoreEl.textContent = `Puntos totales: ${state.score}`;
      
      badgesEl.innerHTML = '';
      state.badges.forEach(b => {
        const span = document.createElement('span');
        span.className = 'badge';
        span.textContent = b;
        badgesEl.appendChild(span);
      });
    }
  
    // ----------------------------------------------------------------------------------
    // BU CLE PRINCIPAL DEL JUEGO (Game Loop)
    // ----------------------------------------------------------------------------------
    function loop(ts) { 
        const dt = Math.min(0.05, (ts - lastTime) / 1000);
        lastTime = ts;
        
        if (!state.paused && state.running) { 
            update(dt);
        }
        
        render();
        
        // Si el juego está corriendo, solicita el siguiente frame
        if (state.running) requestAnimationFrame(loop); 
    }
    
    // ----------------------------------------------------------------------------------
    // LÓGICA DE ACTUALIZACIÓN (Update)
    // ----------------------------------------------------------------------------------
    function update(dt) {
      let moveLeft = keys['ArrowLeft'] || keys['a'] || mobileLeft;
      let moveRight = keys['ArrowRight'] || keys['d'] || mobileRight;
      let jump = keys['ArrowUp'] || keys['w'] || keys[' ' ] || mobileJump;
  
      if (moveLeft) { player.vx = -player.speed; player.facing = 'left'; }
      else if (moveRight) { player.vx = player.speed; player.facing = 'right'; }
      else { player.vx = 0; player.facing = 'front'; }
  
      if (jump && player.onGround) {
        player.vy = player.jumpSpeed;
        player.onGround = false;
        player.facing = 'hand';
      }
  
      player.vy += 1500 * dt; // Gravedad
      player.x += player.vx * dt;
      player.y += player.vy * dt;
  
      // Clamp player position and check for fall
      if (player.x < 0) player.x = 0;
      if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;
      if (player.y > canvas.height) {
        player.x = 40; player.y = 460; player.vy = 0; // Reinicio al caer
      }
  
      const level = levels[state.currentLevel];
      player.onGround = false;
      
      // Colisión con plataformas
      // Necesitamos calcular la posición Y anterior del jugador
      const previousY = player.y - player.vy * dt;

      for (const p of level.platforms) {
        const plat = {x:p.x,y:p.y,w:p.w,h:p.h};
        
        // 1. Verificación de colisión horizontal
        if (player.x + player.w > plat.x && player.x < plat.x + plat.w) {
          
          // 2. Verificación de colisión vertical y dirección
          // Solo si el jugador está "aterrizando" (borde inferior actual > borde superior plataforma)
          // Y su borde inferior ANTERIOR era menor o igual al borde superior plataforma.
          if (player.y + player.h > plat.y && previousY + player.h <= plat.y) {
            
            // 3. Resolución de la colisión (ajustar posición y detener velocidad)
            player.y = plat.y - player.h;
            player.vy = 0;
            player.onGround = true;
            
          } else if (player.y < plat.y + plat.h && previousY >= plat.y + plat.h) {
            
            // Colisión por la parte inferior (golpeando la cabeza contra la plataforma)
            player.y = plat.y + plat.h;
            player.vy = 0;
          }
        }
      }
  
      // Colisión con spirits (desafíos)
      for (let i = 0; i < level.spirits.length; i++) {
        const s = level.spirits[i];
        const spiritBox = {x:s.x, y:s.y, w:s.w, h:s.h};
        const playerBox = {x:player.x, y:player.y, w:player.w, h:player.h};

        if (aabb(playerBox, spiritBox)) {
          if (window.GAME_QUESTIONS) {
            const currentQuestions = questionsData[state.currentLevel];
            let questionObj = currentQuestions ? currentQuestions[s.index] : null;

            if (questionObj) {
                openTrivia(questionObj, state.currentLevel);
                s.x = -1000; // Mueve el spirit fuera de la pantalla
            } else {
                console.warn(`No se encontró la pregunta para el Nivel ${state.currentLevel + 1}, índice ${s.index}.`);
            }
          }
        }
      }
  
      // flag check (Fin de nivel)
      const flag = level.flag;
      if (player.x + player.w > flag.x && player.y < flag.y + flag.h) {
        onLevelComplete();
      }
    }
  
    // ----------------------------------------------------------------------------------
    // LÓGICA DE DIBUJO (Render)
    // ----------------------------------------------------------------------------------
    function render() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
  
      const level = levels[state.currentLevel];
      const bgImg = IMAGES[level.bgKey];
      
      // Fondo
      if (bgImg) {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
      } else {
        const gradient = ctx.createLinearGradient(0,0,0,canvas.height);
        if (state.currentLevel === 0) {
          gradient.addColorStop(0,'#a0e9ff'); gradient.addColorStop(1,'#ffd1a8');
        } else if (state.currentLevel === 1) {
          gradient.addColorStop(0,'#ffddf4'); gradient.addColorStop(1,'#c7f9cc');
        } else {
          gradient.addColorStop(0,'#fff2a8'); gradient.addColorStop(1,'#d2e8ff');
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0,0,canvas.width,canvas.height);
      }
  
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
    }
    
    // ----------------------------------------------------------------------------------
    // MANEJO DE EVENTOS (Input Handling)
    // ----------------------------------------------------------------------------------

    // Teclado
    window.addEventListener('keydown', (e) => {
      keys[e.key.toLowerCase()] = true;
      keys[e.key] = true;
    });
    window.addEventListener('keyup', (e) => {
      keys[e.key.toLowerCase()] = false;
      keys[e.key] = false;
    });

    // Controles Móviles (Touch)
    const setMobileControl = (btn, state) => {
        if (btn === leftBtn) mobileLeft = state;
        else if (btn === rightBtn) mobileRight = state;
        else if (btn === jumpBtn) mobileJump = state;
    };

    [leftBtn, rightBtn, jumpBtn].forEach(btn => {
        // Eventos de inicio (mousedown, touchstart)
        btn.addEventListener('mousedown', (e) => { e.preventDefault(); setMobileControl(btn, true); });
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); setMobileControl(btn, true); });
        
        // Eventos de finalización (mouseup, touchend, mouseleave/touchcancel)
        const release = (e) => { 
            e.preventDefault(); 
            // Solo liberar si el evento es sobre el mismo botón o es un touchend global
            if (e.target === btn || e.type.includes('touch')) {
                setMobileControl(btn, false); 
            }
        };
        btn.addEventListener('mouseup', release);
        btn.addEventListener('touchend', release);
        btn.addEventListener('touchcancel', release);
        btn.addEventListener('mouseleave', release); // Importante para PC si se usa mouse
    });

    // ----------------------------------------------------------------------------------
    // CONTROLES: START, HOWTO, CLOSE, PAUSE, REPLAY
    // ----------------------------------------------------------------------------------
    
    function startGame() {
        menu.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        mobileControls.classList.remove('hidden');
        state.running = true;
        state.score = 0;
        state.badges = new Set();
        startLevel(0);
        lastTime = performance.now();
        requestAnimationFrame(loop);
    }
  
    startBtn.addEventListener('click', () => {
      if (imagesLoaded === imagesToLoad) {
        startGame();
      } else {
        startBtn.textContent = 'Cargando recursos...';
        preloadImages(() => {
          startBtn.textContent = 'Iniciar Juego';
          startGame();
        });
      }
    });

    // Muestra las instrucciones
    howtoBtn.addEventListener('click', ()=>{ 
        howtoScreen.classList.remove('hidden'); 
        menu.classList.add('hidden');
    });

    // Cierra las instrucciones y regresa al menú
    closeHowto.addEventListener('click', ()=>{ 
        console.log('Cerrando howto-screen y volviendo al menú.');
        howtoScreen.classList.add('hidden'); 
        menu.classList.remove('hidden'); 
        gameScreen.classList.add('hidden');
    });
    
    pauseBtn.addEventListener('click', ()=>{ state.paused = !state.paused; });
  
    replayBtn.addEventListener('click', ()=> {
      endScreen.classList.add('hidden');
      startLevel(0); 
      menu.classList.remove('hidden'); 
      state.score = 0;
      state.badges = new Set();
    });
  
    updateHUD();
  
    // Función de detección de touch para mostrar controles
    function isTouch() { return 'ontouchstart' in window || navigator.maxTouchPoints > 0; }
    if (isTouch()) {
      mobileControls.classList.remove('hidden');
    }
  
    // precarga inicial 
    preloadImages(() => {
      console.log('Imágenes precargadas:', Object.keys(IMAGES).filter(k => IMAGES[k]));
      // Opcional: mostrar un mensaje de "listo para jugar"
    });
  
    window._game = { state, levels, startLevel: (i)=>startLevel(i), openTrivia, IMAGES };
})();