// src/questions.js

window.GAME_QUESTIONS = {
  // ----------------------------------------------------------------------
  // Nivel 1: Stories (Trivia)
  // ----------------------------------------------------------------------
  level1: [
    {
        type: 'trivia',
        title: 'Amistad con Jesús',
        question: '¿Qué significa aceptar la “solicitud de amistad” de Jesús?',
        choices: [
            'Ir a misa de vez en cuando', 
            'Hacerte religioso', 
            'Decidir seguirlo y vivir como Él', 
            'Unirte a un grupo de WhatsApp de la parroquia'
        ],
        correctIndex: 2 // C) Decidir seguirlo y vivir como Él
    },
    {
        type: 'trivia',
        title: 'Story de Fe',
        question: '¿Qué acción de Jesús mostrarías en tu primera “story” de fe?',
        choices: [
            'Haciendo un milagro solo para impresionar', 
            'Sanando a un leproso y tocándolo con amor', 
            'Ignorando a los pecadores', 
            'Celebrando con los poderosos'
        ],
        correctIndex: 1 // B) Sanando a un leproso y tocándolo con amor
    },
    {
        type: 'trivia',
        title: 'Hacer un "Live"',
        question: 'Jesús nos invita a hacer un “live”. ¿Qué nos pediría mostrar?',
        choices: [
            'Nuestra vida perfecta', 
            'Nuestra fe auténtica, incluso en la dificultad', 
            'Lo que hacemos para que nos aplaudan', 
            'Videos virales de risa'
        ],
        correctIndex: 1 // B) Nuestra fe auténtica, incluso en la dificultad
    },
    {
        type: 'trivia',
        title: 'Historia Destacada',
        question: 'Según el tema ¿Cuál es una “historia destacada” de Jesús?',
        choices: [
            'Cuando rechazó a los fariseos', 
            'Cuando dio inicio su misión: estando en la sinagoga se puso de pie para hacer la lectura',
            'Cuando huyó del desierto', 
            'Cuando perdonó a la mujer adúltera'
        ],
        correctIndex: 1 // B) Cuando dio inicio su misión: estando en la sinagoga se puso de pie para hacer la lectura
    },
    {
        type: 'trivia',
        title: 'El Gran Influencer',
        question: '¿Por qué decimos que Jesús es el “gran influencer”?',
        choices: [
            'Por sus poderes', 
            'Porque su mensaje transformó vidas', 
            'Porque tenía muchos seguidores', 
            'Porque escribía muchos libros'
        ],
        correctIndex: 1 // B) Porque su mensaje transformó vidas
    }
],

  // ----------------------------------------------------------------------
  // Nivel 2: Reels (Dilema de Emparejamiento - Match Dilemma)
  // ----------------------------------------------------------------------
  level2: [
      // Spirit 0: Sabiduría
      {
          type: 'match_dilemma',
          don: 'Sabiduría',
          initial: 'S',
          prompt: 'Tu mejor amigo te invita a faltar a misa para ir al parque.',
          correct_phrase: 'Decidir que primero honras a Dios en la misa y después disfrutas con tu amigo.',
          points: 20
      },
      // Spirit 1: Inteligencia
      {
          type: 'match_dilemma',
          don: 'Inteligencia',
          initial: 'I',
          prompt: 'La maestra explica un problema difícil de matemáticas.',
          correct_phrase: 'Escuchas, preguntas, y luego ayudas a tus compañeros a entender.',
          points: 20
      },
      // Spirit 2: Ciencia
      {
          type: 'match_dilemma',
          don: 'Ciencia',
          initial: 'CI',
          prompt: 'En clase de ciencias, el maestro pide investigar sobre el agua.',
          correct_phrase: 'Investigar, comprender y explicar con tus propias palabras sobre la importancia de cuidar los recursos naturales que tenemos.',
          points: 20
      },
      // Spirit 3: Fortaleza
      {
          type: 'match_dilemma',
          don: 'Fortaleza',
          initial: 'F',
          prompt: 'Tus amigos te presionan para decir groserías.',
          correct_phrase: 'Decir con firmeza que no quieres hablar así y mantener tu decisión.',
          points: 20
      },
      // Spirit 4: Piedad
      {
          type: 'match_dilemma',
          don: 'Piedad',
          initial: 'P',
          prompt: 'Tu abuela te pide que la acompañes a rezar el rosario.',
          correct_phrase: 'Acompañarla con cariño, rezar con ella y agradecer su fe.',
          points: 20
      },
      // Spirit 5: Temor de Dios
      {
          type: 'match_dilemma',
          don: 'Temor de Dios',
          initial: 'T',
          prompt: 'Estás solo y ves dinero de tu hermano en la mesa.',
          correct_phrase: 'No solo lo dejas, sino que lo cuidas y avisas a tu hermano.',
          points: 20
      },
      // Spirit 6: Consejo
      {
          type: 'match_dilemma',
          don: 'Consejo',
          initial: 'C', // Usa C2 para distinguirlo de Ciencia (C)
          prompt: 'Un compañero está triste porque sacó mala nota.',
          correct_phrase: 'Animarlo, darle ideas para estudiar mejor y ofrecerte a ayudarlo.',
          points: 20
      }
  ],

  // ----------------------------------------------------------------------
  // Nivel 3: Post del Día (Acción/Reflexión)
  // ----------------------------------------------------------------------
  level3: [
    {
        type: 'encounter',
        title: 'Reto 1: El Algoritmo de la Caridad',
        scenario: 'Encuentras a alguien triste y solo, y ves a niños ayudando a otros.',
        prompt: 'Se te revela esta frase: "Ayudar sin que nadie te lo pida ni vea es un algoritmo de caridad". ¿Es esta una **conexión divina** (Verdad) o una **fake news** (Falso)?',
        correctAnswer: true, // La frase es correcta/verdadera
        points: 20
    },
    {
        type: 'encounter',
        title: 'Reto 2: Mensaje Transformador',
        scenario: 'Te llega una notificación al celular con un destello del Espíritu Santo.',
        prompt: 'La notificación dice: "El mensaje del Evangelio te transforma". ¿Debes **Validar** este mensaje (Verdad) o **Eliminarlo** (Falso)?',
        correctAnswer: true,
        points: 20
    },
    {
        type: 'encounter',
        title: 'Reto 3: Viralizando la Alegría',
        scenario: 'Te encuentras con niños cantando y alegres.',
        prompt: 'La frase que se te presenta es: "El Espíritu Santo nos hace vivir alegres y con esperanza". ¿Esta frase **refleja la verdad del Evangelio** (Verdad) o es una **distracción** (Falso)?',
        correctAnswer: true,
        points: 20
    },
    {
        type: 'encounter',
        title: 'Reto 4: Escucha a María',
        scenario: 'Recibes un mensaje especial con la imagen de María.',
        prompt: 'El mensaje de María dice: "Escucha a Dios en tu corazón". ¿**Aceptas** el consejo como una **conexión divina** (Verdad) o lo **descartas** (Falso)?',
        correctAnswer: true,
        points: 20
    }
],
};