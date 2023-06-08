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
                    console.log(response);
                    console.log(response.data);
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

function MultiChQuestionDisplay({ lessonId, onNavigationSelect }) {
    const [userChoice, setUserChoice] = useState(null);

    function handleInputChange(e) {
        setUserChoice(parseInt(e.target.value, 10));
    }
    function handleSubmit() {

    }
    function handleNextQuestion() {

    }

    const { data, loading, error } = useData('api/vocabmcquestions/1.json');
    // if (data) {const choices = data.incorrect_answer_options.options.concat(data.correct_answer)};

    return (
        <div>
            <h1>Question 1</h1>
            {loading && <div>Loading question</div>}
            {error && (
                <div>{`There was a problem fetching the question data - ${error}`}</div>
            )}
            {data && <form onSubmit={handleSubmit}>
                <section>
                    <div>Which one means {data.vocab_word}?</div>
                    <fieldset>
                        <legend>Select</legend>
                        <ul>
                            {data.incorrect_answer_options.options.concat(data.correct_answer).map((choice, choiceIndex) => 
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
            </form>}
        </div>
    );
}

function LessonDisplay({ lessonId, onNavigationSelect }) {
    const [questionNumber, setQuestionNumber] = useState(1);

    function handleNextQuestion() {

    }
    function handleQuitLesson() {

    }

    
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
    const [navigationId, setNavigationId] = useState('');

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
                <MultiChQuestionDisplay
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