document.addEventListener('DOMContentLoaded', () => {
    let questions = [];
    let currentQuestionIndex = -1;
    let usedQuestions = new Set();
    let timer;
    const timerDuration = 20;
    let timeRemaining = timerDuration;

    async function loadQuestions() {
        try {
            const response = await fetch('preguntas.json');
            questions = await response.json();
        } catch (error) {
            console.error('Error al cargar las preguntas:', error);
        }
    }

    function getRandomQuestionIndex() {
        if (usedQuestions.size === questions.length) {
            return -1;
        }
        let index;
        do {
            index = Math.floor(Math.random() * questions.length);
        } while (usedQuestions.has(index));
        return index;
    }

    function displayQuestion() {
        currentQuestionIndex = getRandomQuestionIndex();
        if (currentQuestionIndex === -1) {
            alert('No hay más preguntas disponibles.');
            return;
        }

        const question = questions[currentQuestionIndex];
        document.getElementById('enunciado').textContent = question.enunciado;
        document.getElementById('pista').textContent = question.pista.toUpperCase();
        document.getElementById('respuesta').textContent = question.respuesta.toUpperCase();
        document.getElementById('pista').style.display = 'block';
        document.getElementById('respuesta').style.display = 'none';
        document.getElementById('respuesta').classList.remove('text-danger');
        document.getElementById('show-answer-btn').style.display = 'inline';
        usedQuestions.add(currentQuestionIndex);

        resetTimer();
    }

    function resetTimer() {
        clearInterval(timer);
        timeRemaining = timerDuration;
        document.getElementById('timer').textContent = timeRemaining;
        timer = setInterval(() => {
            timeRemaining--;
            document.getElementById('timer').textContent = timeRemaining;
            if (timeRemaining <= 0) {
                clearInterval(timer);
                showAnswerIncorrect();
            }
        }, 1000);
    }

    function showAnswerIncorrect() {
        document.getElementById('pista').style.display = 'none';
        document.getElementById('respuesta').style.display = 'block';
        document.getElementById('respuesta').classList.add('text-danger');
        document.getElementById('show-answer-btn').style.display = 'none';
    }

    function showAnswer() {
        document.getElementById('pista').style.display = 'none';
        document.getElementById('respuesta').style.display = 'block';
        document.getElementById('show-answer-btn').style.display = 'none';
    }

    document.getElementById('new-question-btn').addEventListener('click', () => {
        displayQuestion();
    });

    document.getElementById('show-answer-btn').addEventListener('click', () => {
        clearInterval(timer);
        showAnswer();
    });

    loadQuestions();
});
