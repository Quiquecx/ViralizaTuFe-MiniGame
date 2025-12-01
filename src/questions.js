// src/questions.js - Preguntas y contenidos por nivel con estructura de desafíos
window.GAME_QUESTIONS = {
  // NIVEL 1: STORIES (Trivia rápida)
  level1: [
    {
      id: "1",
      question: "¿Qué significa aceptar la “solicitud de amistad” de Jesús?",
      choices: ["Ir a misa de vez en cuando", "Hacerte religioso", "Decidir seguirlo y vivir como Él", "Unirte a un grupo de WhatsApp de la parroquia"],
      correctIndex: 2
    },
    {
      id: "2",
      question: "¿Qué acción de Jesús mostrarías en tu primera “story” de fe?",
      choices: ["Haciendo un milagro solo para impresionar", "Sanando a un leproso y tocándolo con amor", "Ignorando a los pecadores", "Celebrando con los poderosos"],
      correctIndex: 1
    },
    {
      id: "3",
      question: "Jesús nos invita a hacer un “live”. ¿Qué nos pediría mostrar?",
      choices: ["Nuestra vida perfecta", "Nuestra fe auténtica, incluso en la dificultad", "Lo que hacemos para que nos aplaudan", "Videos virales de risa"],
      correctIndex: 1
    },
    {
      id: "4",
      question: "Según el tema ¿Cuál es una “historia destacada” de Jesús?",
      choices: ["Cuando rechazó a los fariseos", "Cuando dio inicio su misión: estando en la sinagoga se puso de pie para hacer la lectura", "Cuando huyó del desierto", "Cuando perdonó a la mujer adúltera"],
      correctIndex: 1 // La pregunta original tiene 2 respuestas B/D, he dejado B por contexto de misión
    },
    {
      id: "5",
      question: "¿Por qué decimos que Jesús es el “gran influencer”?",
      choices: ["Por sus poderes", "Porque su mensaje transformó vidas", "Porque tenía muchos seguidores", "Porque escribía muchos libros"],
      correctIndex: 1
    }
  ],
  
  // NIVEL 2: REELS (Juego visual/Trivia simple simulada como 'match')
  level2: [
    // Nota: El juego de plataforma simple no soporta arrastrar y soltar (match), 
    // así que lo simulamos con una trivia de selección que aborda el tema.
    { 
      id: "l2-1", 
      question: "En 'Collab con el Espíritu Santo', ¿qué Don nos ayuda a tomar buenas decisiones?",
      choices: ["Don de Sabiduría", "Don de Consejo", "Don de Ciencia", "Don de Piedad"],
      correctIndex: 1 // Ejemplo: Consejo (Don de GPS)
    },
    { 
      id: "l2-2", 
      question: "¿Cuál de estos símbolos SÍ representa al Espíritu Santo?",
      choices: ["Un rayo", "Una paloma", "Una corona", "Una espada"],
      correctIndex: 1 // Basado en los nicknames (paloma, lenguas de fuego, agua, etc.)
    },
  ],
  
  // NIVEL 3: POST DEL DÍA (Elección reflexiva/Mensaje)
  level3: [
    { 
      id: "l3-1", 
      prompt: "Encuentras a alguien triste y solo. ¿Cuál es el mensaje de esperanza?", 
      text: "Dios te ama y está contigo en este momento. #ConexiónDivina",
      // En el juego, esto se considera completado al hacer clic en 'Entendido'.
    },
    { 
      id: "l3-2", 
      prompt: "Recoges basura del piso. ¿Cuál es el 'algoritmo' de tu acción?", 
      text: "Ayudar sin que nadie te lo pida ni vea es un algoritmo de caridad.",
    },
    { 
      id: "l3-3", 
      prompt: "Recibes una notificación: 'El mensaje del Evangelio te transforma'. ¿Qué haces?", 
      text: "Recordar que el Evangelio es el filtro más poderoso para mi vida.",
    },
  ]
};