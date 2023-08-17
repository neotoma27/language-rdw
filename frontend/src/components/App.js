import React, { useState, useEffect } from "react";
import axios from "axios";
import LessonCompleteGoose from '../assets/images/lesson-complete-goose.png'

function replaceItemInArray(items, replaceItem, replaceIndex) {
  return items.map((item) => {
    if (item.id === replaceIndex) {
      return replaceItem;
    } else {
      return item;
    }
  });
}

function useData(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function startFetching() {
      setLoading(true);
      try {
        // setError(null);
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
    };
  }, [url]);

  return { data, loading, error };
}

function useDataMultiple(urls) {
  const [dataArray, setDataArray] = useState(Array(urls.length).fill(null));
  const [loadingArray, setLoadingArray] = useState(
    Array(urls.length).fill(false),
  );
  const [errorArray, setErrorArray] = useState(Array(urls.length).fill(null));

  useEffect(() => {
    async function startFetching() {
      for (let i = 0; i < urls.length; i++) {
        setLoadingArray(replaceItemInArray(loadingArray, true, i));
        try {
          // setErrorArray(replaceItemInArray());
          const response = await axios.get(urls[i]);
          if (!ignore) {
            setDataArray(replaceItemInArray(dataArray, response.data, i));
          }
        } catch (err) {
          setErrorArray(replaceItemInArray(errorArray, err, i));
          setLoadingArray(replaceItemInArray(loadingArray, false, i));
        }
        setLoadingArray(replaceItemInArray(loadingArray, false, i));
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    };
  }, [urls]);

  return { dataArray, loadingArray, errorArray };
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
          const questionType = [
            "vocabmcquestions",
            "sentencemcquestions",
            "writesentencequestions",
          ][responseB.data.question_type - 1];
          const questionSpecificUrl = `api/${questionType}/${responseB.data.id}.json`;
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
    };
  }, [questionBaseUrl]);

  return {
    questionBaseData,
    questionBaseLoading,
    questionBaseError,
    questionSpecificData,
    questionSpecificLoading,
    questionSpecificError,
  };
}

function shuffleOrder(number) {
  let options = [...Array(number).keys()];
  for (let i = number - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { correct: options[0], rest: options.slice(1) };
}

function orderOptions(order, correct, rest) {
  let ordered = [...Array(4)];
  ordered[order.correct] = correct;
  for (let i = 0; i < 3; i++) {
    ordered[order.rest[i]] = rest[i];
  }
  return ordered;
}

function FeedbackMessage({ correct, correctAnswer, onContinue }) {
  function handleContinue() {
    onContinue();
  }

  let display = <div>Feedback Message Error</div>;
  if (correct) {
    display = (
      <div>
        <div>You are correct</div>
        <button onClick={handleContinue}>CONTINUE</button>
      </div>
    );
  } else {
    display = (
      <div>
        <div>Sorry, incorrect</div>
        <div>Correct solution:</div>
        <div>{correctAnswer}</div>
        <button onClick={handleContinue}>CONTINUE</button>
      </div>
    );
  }
  return display;
}

function LessonCompleteScreen({ onEndLesson }) {
  function handleEndLesson() {
    onEndLesson();
  }

  return (
    <div>
        <div className="object-contain h-30 w-30">
            <img src={LessonCompleteGoose} alt="Digital drawing of an ice-skating cartoon goose, wearing a yellow helmet, red scarf with yellow polka-dots, turquoise sweater, red pants, and brown ice skates." />
        </div>
        <div>
            Lesson complete! Great work!
        </div>
        <button className="bg-teal-400 text-white w-80 rounded-lg" onClick={handleEndLesson}>CONTINUE</button>
    </div>
);
}

function VocabMCQuestionDisplay({
  questionData,
  answerSubmitted,
  onSubmitAnswer,
}) {
  const [userChoice, setUserChoice] = useState(null);
  const [optionsOrder, setOptionsOrder] = useState(shuffleOrder(4)); //object with 1 correct and 3 rest

  function handleInputChange(e) {
    setUserChoice(parseInt(e.target.value, 10));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmitAnswer(userChoice === optionsOrder.correct);
  }

  const answerOptions = orderOptions(
    optionsOrder,
    questionData.vocab_word.target_language_word,
    questionData.incorrect_answer_options.map(
      (option) => option.target_language_word,
    ),
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <section>
          <div>
            Which one means {questionData.vocab_word.native_language_word}?
          </div>
          <fieldset>
            <legend>Select</legend>
            <ul>
              {answerOptions.map((choice, choiceIndex) => (
                <li key={choice}>
                  <label>
                    {choice}
                    <input
                      type="radio"
                      name="choice"
                      value={choiceIndex}
                      checked={choiceIndex === userChoice}
                      onChange={handleInputChange}
                    />
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        </section>
        {!answerSubmitted && <button type="submit">CHECK</button>}
      </form>
    </div>
  );
}

function SentenceMCQuestionDisplay({
  questionData,
  answerSubmitted,
  onSubmitAnswer,
}) {
  const [userChoice, setUserChoice] = useState(null);
  const [optionsOrder, setOptionsOrder] = useState(shuffleOrder(4)); //object with 1 correct and 3 rest

  function handleInputChange(e) {
    setUserChoice(parseInt(e.target.value, 10));
  }
  function handleSubmit(e) {
    e.preventDefault();
    onSubmitAnswer(userChoice === optionsOrder.correct);
  }

  const answerOptions = orderOptions(
    optionsOrder,
    questionData.correct_sentence.target_language_sentence,
    questionData.incorrect_answer_options.map(
      (option) => option.target_language_sentence,
    ),
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <section>
          <div>Select the correct translation</div>
          <div>{questionData.correct_sentence.native_language_sentence}</div>
          <fieldset>
            <legend>Select</legend>
            <ul>
              {answerOptions.map((choice, choiceIndex) => (
                <li key={choice}>
                  <label>
                    {choice}
                    <input
                      type="radio"
                      name="choice"
                      value={choiceIndex}
                      checked={choiceIndex === userChoice}
                      onChange={handleInputChange}
                    />
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        </section>
        {!answerSubmitted && <button type="submit">CHECK</button>}
      </form>
    </div>
  );
}

function QuestionDisplay({
  questionUrl,
  answerSubmitted,
  onSubmitAnswer,
  onNextQuestion,
}) {
  const [answeredCorrectly, setAnsweredCorrectly] = useState(null);

  function handleSubmitAnswer(answeredCorrectlySubmit) {
    onSubmitAnswer();
    setAnsweredCorrectly(answeredCorrectlySubmit);
  }

  function handleNextQuestion() {
    setAnsweredCorrectly(null);
    onNextQuestion();
  }

  const {
    questionBaseData,
    questionBaseLoading,
    questionBaseError,
    questionSpecificData,
    questionSpecificLoading,
    questionSpecificError,
  } = useQuestionData(questionUrl);
  let display = <div></div>;
  let correctAnswer = "";
  if (questionSpecificData && questionBaseData.id === questionSpecificData.id) {
    switch (questionBaseData.question_type) {
      case 1:
        display = (
          <VocabMCQuestionDisplay
            key={questionBaseData.id}
            questionData={questionSpecificData}
            answerSubmitted={answerSubmitted}
            onSubmitAnswer={handleSubmitAnswer}
          />
        );
        correctAnswer = questionSpecificData.vocab_word.target_language_word;
        break;
      case 2:
        display = (
          <SentenceMCQuestionDisplay
            key={questionBaseData.id}
            questionData={questionSpecificData}
            answerSubmitted={answerSubmitted}
            onSubmitAnswer={handleSubmitAnswer}
          />
        );
        correctAnswer =
          questionSpecificData.correct_sentence.target_language_sentence;
        break;
      default:
        display = <div>{`Invalid question type - ${data.question_type}`}</div>;
    }
  }

  return (
    <div>
      {(questionBaseLoading || questionSpecificLoading) && (
        <div>Loading Question Data</div>
      )}
      {(questionBaseError || questionSpecificError) && (
        <div>{`There was a problem fetching the question data - ${questionBaseError} ${questionSpecificError}`}</div>
      )}
      {questionBaseData && questionSpecificData && display}
      {answerSubmitted && (
        <FeedbackMessage
          correct={answeredCorrectly}
          correctAnswer={correctAnswer}
          onContinue={handleNextQuestion}
        />
      )}
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
  function handleEndLesson() {
    onNavigationSelect("menu", "lesson select");
  }

  const { data, loading, error } = useData(`api/lessons/${lessonId}.json`);
  let display;
  if (data && questionNumber > data.questions.length) {
    display = <LessonCompleteScreen onEndLesson={handleEndLesson} />;
  } else {
    display = (
      <div>
        {loading && <div>Loading Lesson</div>}
        {error && (
          <div>{`There was a problem fetching the lesson data - ${error}`}</div>
        )}
        {data && (
          <div>
            <h1>{`Question ${questionNumber} of ${data.questions.length}`}</h1>
            <QuestionDisplay
              questionUrl={data.questions[questionNumber - 1]}
              answerSubmitted={answerSubmitted}
              onSubmitAnswer={handleSubmitAnswer}
              onNextQuestion={handleNextQuestion}
            />
          </div>
        )}
      </div>
    );
  }

  return display;
}

function LessonChoiceRow({ id, lessonName, onNavigationSelect }) {
  function handleClickLesson() {
    onNavigationSelect(id);
  }

  return <button className="bg-teal-400 text-white w-80 rounded-lg" onClick={handleClickLesson}>{lessonName}</button>;
}

function MenuDisplay({ onNavigationSelect }) {
  function handleNavigationSelect(id) {
    onNavigationSelect("lesson", id);
  }

  const { data, loading, error } = useData("api/lessons.json");
  return (
    <div>
      <h1>Lesson Select Menu</h1>
      {loading && <div>Loading lessons list</div>}
      {error && (
        <div>{`There was a problem fetching the lessons data - ${error}`}</div>
      )}
      {data && (
        <ul>
          {data.map((lesson) => (
            <li key={lesson.id}>
              <LessonChoiceRow
                id={lesson.id}
                lessonName={lesson.lesson_name}
                onNavigationSelect={handleNavigationSelect}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function App() {
  const [navigationCategory, setNavigationCategory] = useState("menu");
  const [navigationId, setNavigationId] = useState("lesson select");

  function handleNavigationSelect(
    chosenNavigationCategory,
    navigationSelection,
  ) {
    switch (chosenNavigationCategory) {
      case "lesson":
        setNavigationCategory("lesson");
        setNavigationId(navigationSelection);
        break;
      case "menu":
      default:
        setNavigationCategory("menu");
        setNavigationId("lesson select");
    }
  }

  let display;
  switch (navigationCategory) {
    case "lesson":
      display = (
        <LessonDisplay
          lessonId={navigationId}
          onNavigationSelect={handleNavigationSelect}
        />
      );
      break;
    case "menu":
    default:
      display = <MenuDisplay onNavigationSelect={handleNavigationSelect} />;
  }
  return display;
}

// const container = document.getElementById('app');
// const root = createRoot(container);
// root.render(<App tab="home" />);
