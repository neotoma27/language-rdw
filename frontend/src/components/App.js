import React, { useState, useEffect } from "react";
import axios from 'axios';

function useData(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        async function startFetching() {
            setLoading(true);
            try {
                setError(null);
                const response = await axios.get(url);
                if (!ignore) {
                    setData(response.data);
                }
            } catch (err) {
                setError(err);
                setData(null);
            }
            setLoading(false);
        }

        let ignore = false;
        startFetching();
        return () => {
            ignore = true;
        }
    }, [url]);
  
    return { data, loading, error };
}

function useQuestionData(questionBaseUrl) {
    const [questionBaseData, setQuestionBaseData] = useState(null);
    const [questionBaseLoading, setQuestionBaseLoading] = useState(false);
    const [questionBaseError, setQuestionBaseError] = useState(null);
    const [questionSpecificData, setQuestionSpecificData] = useState(null);
    const [questionSpecificLoading, setQuestionSpecificLoading] = useState(false);
    const [questionSpecificError, setQuestionSpecificError] = useState(null);
  
    useEffect(() => {
        async function startFetching() {
            setQuestionBaseLoading(true);
            try {
                setQuestionBaseError(null);
                const responseB = await axios.get(questionBaseUrl);
                if (!ignore) {
                    setQuestionBaseData(responseB.data);
                    const questionSpecificUrl = `api/vocabmcquestions/${responseB.data.id}.json`;
                    setQuestionSpecificLoading(true);
                    try {
                        setQuestionSpecificError(null);
                        const responseSp = await axios.get(questionSpecificUrl);
                        if (!ignore) {
                            setQuestionSpecificData(responseSp.data);
                        }
                    } catch (err) {
                        setQuestionSpecificError(err);
                        setQuestionSpecificData(null);
                    }
                    setQuestionSpecificLoading(false);
                }
            } catch (err) {
                setQuestionBaseError(err);
                setQuestionBaseData(null);
            }
            setQuestionBaseLoading(false);
        }
        let ignore = false;
        startFetching();
        return () => {
            ignore = true;
        }
    }, [questionBaseUrl]);
  
    return { questionBaseData, questionBaseLoading, questionBaseError, questionSpecificData, questionSpecificLoading, questionSpecificError };
}

function FeedbackMessage({ correct, correctAnswer, onContinue }) {
    let display = <div>Feedback Message Error</div>;
    if (correct) {
        display = <div>
            <div>You are correct</div>
            <div>CONTINUE</div>
        </div>;
    }
    else {
        display = <div>
            <div>Sorry, incorrect</div>
            <div>Correct solution:</div>
            <div>{correctAnswer}</div>
            <div>CONTINUE</div>
        </div>;
    }
    return display;
}

function MultiChQuestionDisplay({ questionData, answerSubmitted, onSubmitAnswer }) {
    const [userChoice, setUserChoice] = useState(null);
    const [correctChoice, setCorrectChoice] = useState(3);

    function handleInputChange(e) {
        setUserChoice(parseInt(e.target.value, 10));
    }
    function handleSubmit(e) {
        e.preventDefault();
        onSubmitAnswer(userChoice === correctChoice);
    }

    const answerOptions = questionData.incorrect_answer_options.options.toSpliced(correctChoice, 0, questionData.correct_answer);
    return (
        <div>
            <h1>Question 1</h1>
            <form onSubmit={handleSubmit}>
                <section>
                    <div>Which one means {questionData.vocab_word}?</div>
                    <fieldset>
                        <legend>Select</legend>
                        <ul>
                            {answerOptions.map((choice, choiceIndex) => 
                                <li key={choice}>
                                    <label>
                                        {choice}
                                        <input
                                            type="radio"
                                            name="choice"
                                            value={choiceIndex}
                                            checked={choiceIndex === userChoice}
                                            onChange={handleInputChange} />
                                    </label>
                                </li>
                            )}
                        </ul>
                    </fieldset>
                </section>
                {(!answerSubmitted) && <button type="submit">CHECK</button>}
            </form>
        </div>
    );
}

function QuestionDisplay({ questionUrl, answerSubmitted, onSubmitAnswer }) {
    const [answeredCorrectly, setAnsweredCorrectly] = useState(null);

    function handleSubmitAnswer(answeredCorrectlySubmit) {
        onSubmitAnswer();
        setAnsweredCorrectly(answeredCorrectlySubmit);
    }
    
    function handleNextQuestion() {
        setAnsweredCorrectly(null);
        onNextQuestion();
    }

    const { questionBaseData, questionBaseLoading, questionBaseError, questionSpecificData, questionSpecificLoading, questionSpecificError } = useQuestionData(questionUrl);
    let display = <div></div>;
    let correctAnswer = '';
    if (questionSpecificData) {
        correctAnswer = questionSpecificData.correct_answer;
        display = 
            <MultiChQuestionDisplay
                questionData={questionSpecificData}
                answerSubmitted={answerSubmitted}
                onSubmitAnswer={handleSubmitAnswer} />;
    //     switch (data.question_type) {
    //         case 1:
    //             display =
                    // <MultiChQuestionDisplay
                    //     questionId={data.id}
                    //     answerSubmitted={answerSubmitted}
                    //     onQuestionDataLoaded={handleQuestionDataLoaded}
                    //     onSubmitAnswer={handleSubmitAnswer} />;
    //             break;
    //         default:
    //             display = <div>{`Invalid question type - ${data.question_type}`}</div>;
    //     }
    }

    return (
        <div>
            {(questionBaseLoading || questionSpecificLoading) && <div>Loading Question Data</div>}
            {(questionBaseError || questionSpecificError) && (
                <div>{`There was a problem fetching the question data - ${questionBaseError} ${questionSpecificError}`}</div>
            )}
            {display}
            {answerSubmitted && <FeedbackMessage
                correct={answeredCorrectly}
                correctAnswer={correctAnswer}
                onContinue={handleNextQuestion} />
            }
        </div>
    );
}

function LessonDisplay({ lessonId, onNavigationSelect }) {
    const [questionNumber, setQuestionNumber] = useState(1);
    const [answerSubmitted, setAnswerSubmitted] = useState(false);

    function handleSubmitAnswer() {
        setAnswerSubmitted(true);
    }
    function handleNextQuestion() {
        setQuestionNumber(questionNumber + 1);
        setAnswerSubmitted(false);
    }
    // function handleQuitLesson() {

    // }

    const { data, loading, error } = useData('api/lessons/1.json');

    return (
        <div>
            {loading && <div>Loading Lesson</div>}
            {error && (
                <div>{`There was a problem fetching the lesson data - ${error}`}</div>
            )}
            {data && <QuestionDisplay
                questionUrl={data.questions[questionNumber - 1]}
                answerSubmitted={answerSubmitted}
                onSubmitAnswer={handleSubmitAnswer} />
            }
        </div>
    );
}

function LessonChoiceRow({ id, lessonName, onNavigationSelect }) {
    function handleClickLesson() {
        onNavigationSelect(id);
    }

    return <button onClick={handleClickLesson}>{lessonName}</button>;
}

function MenuDisplay({ onNavigationSelect }) {
    function handleNavigationSelect(id) {
        onNavigationSelect('lesson', id);
    }

    const { data, loading, error } = useData('api/lessons.json');
    return (
        <div>
            <h1>Lesson Select Menu</h1>
            {loading && <div>Loading lessons list</div>}
            {error && (
                <div>{`There was a problem fetching the lessons data - ${error}`}</div>
            )}
            {data && <ul>
                {data.map((lesson) => 
                    <li key={lesson.id}>
                        <LessonChoiceRow
                            id={lesson.id}
                            lessonName={lesson.lesson_name}
                            onNavigationSelect={handleNavigationSelect} />
                    </li>
                )}
            </ul>}
        </div>
    );
}

export default function App() {
    // const [navigationCategory, setNavigationCategory] = useState('menu');
    // const [navigationId, setNavigationId] = useState('lesson select');
    const [navigationCategory, setNavigationCategory] = useState('lesson');
    const [navigationId, setNavigationId] = useState(1);

    function handleNavigationSelect(chosenNavigationCategory, navigationSelection) {
        switch(chosenNavigationCategory) {
            case 'lesson':
                setNavigationCategory('lesson');
                setNavigationId(navigationSelection);
                break;
            case 'menu':
            default:
                setNavigationCategory('menu');
                setNavigationId('lesson select');
        }
    }

    let display;
    switch(navigationCategory) {
        case 'lesson':
            display =
                <LessonDisplay
                    lessonId={navigationId}
                    onNavigationSelect={handleNavigationSelect} />;
            break;
        case 'menu':
        default:
            display =
                <MenuDisplay
                    onNavigationSelect={handleNavigationSelect} />;
    }
    return display;
}

// const container = document.getElementById('app');
// const root = createRoot(container);
// root.render(<App tab="home" />);