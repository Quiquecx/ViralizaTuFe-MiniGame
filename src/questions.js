// src/questions.js - Preguntas y contenidos por nivel con estructura de desafíos
// Esta estructura soporta la lógica de trivia estándar (Level 1), 
// dilemas/matching (Level 2) y acciones reflexivas (Level 3).
window.GAME_QUESTIONS = {
  
  // =================================================================
  // NIVEL 1: STORIES (Trivia rápida) - Requiere 8 preguntas
  // Mecánica: Trivia de selección simple (puntos: 10 o 0)
  // =================================================================
  level1: [
    {
      id: "1",
      type: 'trivia',
      question: "¿Qué significa aceptar la “solicitud de amistad” de Jesús?",
      choices: ["Ir a misa de vez en cuando", "Hacerte religioso", "Decidir seguirlo y vivir como Él", "Unirte a un grupo de WhatsApp de la parroquia"],
      correctIndex: 2
    },
    {
      id: "2",
      type: 'trivia',
      question: "¿Qué acción de Jesús mostrarías en tu primera “story” de fe?",
      choices: ["Haciendo un milagro solo para impresionar", "Sanando a un leproso y tocándolo con amor", "Ignorando a los pecadores", "Celebrando con los poderosos"],
      correctIndex: 1
    },
    {
      id: "3",
      type: 'trivia',
      question: "Jesús nos invita a hacer un “live”. ¿Qué nos pediría mostrar?",
      choices: ["Nuestra vida perfecta", "Nuestra fe auténtica, incluso en la dificultad", "Lo que hacemos para que nos aplaudan", "Videos virales de risa"],
      correctIndex: 1
    },
    {
      id: "4",
      type: 'trivia',
      question: "Según el tema ¿Cuál es una “historia destacada” de Jesús?",
      choices: ["Cuando rechazó a los fariseos", "Cuando dio inicio su misión: estando en la sinagoga se puso de pie para hacer la lectura", "Cuando huyó del desierto", "Cuando perdonó a la mujer adúltera"],
      correctIndex: 1
    },
    {
      id: "5",
      type: 'trivia',
      question: "¿Por qué decimos que Jesús es el “gran influencer”?",
      choices: ["Por sus poderes", "Porque su mensaje transformó vidas", "Porque tenía muchos seguidores", "Porque escribía muchos libros"],
      correctIndex: 1
    },
    // Preguntas de relleno para asegurar 8 desafíos en el nivel
    {
        id: "6",
        type: 'trivia',
        question: "La misión de los followers de Jesús es:",
        choices: ["Ser famosos en redes", "Compartir el mensaje de amor de Dios", "Ganar mucho dinero", "Esperar que otros lo hagan"],
        correctIndex: 1
    },
    {
        id: "7",
        type: 'trivia',
        question: "¿Qué significa 'viralizar' el Evangelio?",
        choices: ["Hacer videos de TikTok", "Compartirlo con nuestras acciones y palabras", "Solo darle 'like' a publicaciones religiosas", "Imprimir folletos"],
        correctIndex: 1
    },
    {
        id: "8",
        type: 'trivia',
        question: "Jesús siempre usó las redes sociales para enseñar.",
        choices: ["Verdadero", "Falso"],
        correctIndex: 1
    },
  ],
  
  // =================================================================
  // NIVEL 2: REELS (En collab con el Espíritu Santo) - Requiere 8 preguntas
  // Mecánica: Dilemas con puntuación variable (puntos: 0, 5, 10) y Matching.
  // =================================================================
  level2: [
    // ----------------------------------------------------
    // DILEMAS (Dones del Espíritu Santo) - Puntos: 0, 5, 10
    // ----------------------------------------------------
    // Dilema 1: Sabiduría (index 0)
    { 
      type: 'dilemma', 
      title: 'Don de Sabiduría', 
      prompt: 'Tu mejor amigo te invita a faltar a misa para ir al parque.', 
      choices: [ 
        { text: 'Ir al parque y olvidar la misa. (Valor bajo)', points: 0 }, 
        { text: 'Ir a misa rápido y luego al parque. (Valor medio)', points: 5 }, 
        { text: 'Decidir que primero honras a Dios en la misa y después disfrutas con tu amigo. (Valor alto)', points: 10 } 
      ] 
    },
    // Dilema 2: Ciencia (index 1)
    { 
      type: 'dilemma', 
      title: 'Don de Ciencia', 
      prompt: 'En clase de ciencias, el maestro pide investigar sobre el agua.', 
      choices: [ 
        { text: 'Copiar todo de internet sin leer. (Valor bajo)', points: 0 }, 
        { text: 'Leer un poco y escribir lo que entendiste. (Valor medio)', points: 5 }, 
        { text: 'Investigar, comprender y explicar con tus propias palabras para que otros aprendan. (Valor alto)', points: 10 } 
      ] 
    },
    // Dilema 3: Piedad (index 2)
    { 
      type: 'dilemma', 
      title: 'Don de Piedad', 
      prompt: 'Tu abuela te pide que la acompañes a rezar el rosario.', 
      choices: [ 
        { text: 'Decir que no porque prefieres jugar. (Valor bajo)', points: 0 }, 
        { text: 'Acompañarla un rato, pero distraído. (Valor medio)', points: 5 }, 
        { text: 'Acompañarla con cariño, rezar con ella y agradecer su fe. (Valor alto)', points: 10 } 
      ] 
    },
    // Dilema 4: Temor de Dios (index 3)
    { 
      type: 'dilemma', 
      title: 'Don de Temor de Dios', 
      prompt: 'Estás solo y ves dinero en la mesa de tu hermano.', 
      choices: [ 
        { text: 'Tomarlo sin permiso. (Valor bajo)', points: 0 }, 
        { text: 'Pensar en tomarlo, pero lo dejas ahí. (Valor medio)', points: 5 }, 
        { text: 'No solo lo dejas, sino que lo cuidas y avisas a tu hermano. (Valor alto)', points: 10 } 
      ] 
    },
    // Dilema 5: Inteligencia (index 4)
    { 
      type: 'dilemma', 
      title: 'Don de Inteligencia', 
      prompt: 'La maestra explica un problema difícil de matemáticas.', 
      choices: [ 
        { text: 'No pones atención y esperas copiar. (Valor bajo)', points: 0 }, 
        { text: 'Escuchas, pero no preguntas tus dudas. (Valor medio)', points: 5 }, 
        { text: 'Escuchas, preguntas, y luego ayudas a tus compañeros a entender. (Valor alto)', points: 10 } 
      ] 
    },
    // Dilema 6: Fortaleza (index 5)
    { 
      type: 'dilemma', 
      title: 'Don de Fortaleza', 
      prompt: 'Tus amigos te presionan para decir groserías.', 
      choices: [ 
        { text: 'Ceder y repetirlas. (Valor bajo)', points: 0 }, 
        { text: 'No decirlas, pero quedarte callado. (Valor medio)', points: 5 }, 
        { text: 'Decir con firmeza que no quieres hablar así y mantener tu decisión. (Valor alto)', points: 10 } 
      ] 
    },
    // Dilema 7: Consejo (index 6)
    { 
      type: 'dilemma', 
      title: 'Don de Consejo', 
      prompt: 'Un compañero está triste porque sacó mala nota.', 
      choices: [ 
        { text: 'Ignorarlo y seguir con tus cosas. (Valor bajo)', points: 0 }, 
        { text: 'Decirle que no se preocupe, que ya pasará. (Valor medio)', points: 5 }, 
        { text: 'Animarlo, darle ideas para estudiar mejor y ofrecerte a ayudarlo. (Valor alto)', points: 10 } 
      ] 
    },
    // ----------------------------------------------------
    // Matching/Trivia de Símbolos (index 7)
    // ----------------------------------------------------
    {
      type: 'match',
      title: 'Nicknames del Espíritu Santo',
      prompt: "Son algunos nicknames del Espíritu Santo. Elige la imagen que lo representa (Paloma, Lenguas de fuego, Agua, Nube, Sello):",
      choices: [
        { text: "Espada (Símbolo incorrecto)", points: 0 },
        { text: "Paloma (Símbolo correcto)", points: 10 }, 
        { text: "Guantes (Símbolo incorrecto)", points: 0 },
        { text: "Lenguas de Fuego (Símbolo correcto)", points: 10 },
      ]
      // Nota: El 'game.js' solo permite seleccionar una opción, se usará como trivia simple donde una respuesta correcta basta para los 10 puntos.
    }
  ],
  
  // =================================================================
  // NIVEL 3: POST DEL DÍA (Conexión divina) - Requiere 4 preguntas
  // Mecánica: Reto de Acción/Reflexión (puntos: 10 por completar/entender)
  // =================================================================
  level3: [
    // Acción 1: Ayudar sin que te lo pidan (index 0)
    { 
      id: "l3-1", 
      type: 'action', 
      prompt: "Te encuentras a alguien triste y Solo, o ves niños ayudando a otros.", 
      message: "Ayudar sin que nadie te lo pida ni vea es un algoritmo de caridad. (+10 Pts)", 
      points: 10 
    },
    // Acción 2: Notificación del Evangelio (index 1)
    { 
      id: "l3-2", 
      type: 'action', 
      prompt: "¡Notificación en tu celular!: 'El mensaje del Evangelio te transforma'.", 
      message: "El mensaje del Evangelio te transforma. ¡Abre tu corazón! (+10 Pts)", 
      points: 10 
    },
    // Acción 3: Alegría y esperanza (index 2)
    { 
      id: "l3-3", 
      type: 'action', 
      prompt: "Ves a niños cantando y alegres a tu paso.", 
      message: "El Espíritu Santo nos hace vivir alegres y con esperanza. ¡Contagia la alegría! (+10 Pts)", 
      points: 10 
    },
    // Acción 4: Mensaje de María (index 3)
    { 
      id: "l3-4", 
      type: 'action', 
      prompt: "Recibes un mensaje especial de María.", 
      message: "Escucha a Dios en tu corazón. ¡Ella te acompaña! (+10 Pts)", 
      points: 10 
    }
  ]
};