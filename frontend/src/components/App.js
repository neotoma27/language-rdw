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

function LessonChoiceRow({ id, lessonName, onNavigationSelect }) {
    function handleClickLesson() {
        onNavigationSelect(id);
    }

    return <button onClick={handleClickLesson}>{lessonName}</button>;
}

function MenuDisplay(onNavigationSelect) {
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
    const [navigationCategory, setNavigationCategory] = useState('menu');
    const [navigationId, setNavigationId] = useState('lesson select');

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

    let display, data, loading, error;
    switch(navigationCategory) {
        case 'lesson':
            ({ data, loading, error } = useData(`api/lessons/${navigationId}.json`));
            display =
                <LessonDisplay
                    data={data}
                    loading={loading}
                    error={error}
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