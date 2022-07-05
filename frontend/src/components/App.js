import React, { Component } from "react";
import ReactDOM, { render } from "react-dom";

function withFetching(WrappedComponent, url, errorMessage) {
    return class extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                data: [],
                isLoading: false,
                error: null,
            };
        }

        componentDidMount() {
            this.setState({ isLoading: true });

            fetch(url)
                .then(
                    (result) => {
                        this.setState({
                            data: result.data,
                            isLoading: false
                        });
                    },
                   (error) => {
                        this.setState({
                            isLoading: false,
                            error
                        });
                    }
                )
        }

        render() {
            const { isLoading, error } = this.state;
            console.log(JSON.parse(JSON.stringify(data)), isLoading, error);

            if (error) {
                return <p>{errorMessage}</p>;
            }

            if (isLoading) {
                return <p>Loading...</p>;
            }

            return <WrappedComponent fetchedData={this.state.data} { ...this.props } />;
        }
    };
}

class LessonTopBar extends React.Component {
    constructor(props) {
        super(props);

        this.handleClickQuit = this.handleClickQuit.bind(this);
    }

    handleClickQuit() {
        this.props.onQuitLesson();
    }

    render() {
        const questionNumber = this.props.questionNumber;

        return (
            <div>
                <p><button onClick={this.handleClickQuit}>Quit Lesson</button></p>
                <p>Question {questionNumber}</p>
            </div>
        );
    }
}

class AnswerFeedback extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.handleNextQuestion();
    }

    render() {
        const {correct, correctAnswer} = this.props;

        return (
            <section>
                <div>{correct ? 'Correct' : 'Incorrect'}</div>
                {(!correct) &&
                    <div>
                        <p>Answer:</p>
                        <p>{correctAnswer}</p>
                    </div>
                }
                <div><button onClick={this.handleClick}>Continue</button></div>
            </section>
        );
    }
}

class MCQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNextQuestion = this.handleNextQuestion.bind(this);
    }

    handleInputChange(event) {
        this.props.handleInputChange(parseInt(event.target.value, 10));
    }

    handleSubmit(event) {
        this.props.handleSubmit();
        event.preventDefault();
    }

    handleNextQuestion() {
        this.props.handleNextQuestion();
    }

    render() {
        const {correctAnswer, incorrectAnswerOptions, correctAnswerNumber, answerSelection, answerWasSubmitted,
                questionPrompt} = this.props;

        const correctAnswerWasSubmitted = answerWasSubmitted && (correctAnswerNumber === answerSelection);

        let answerOptions = [...incorrectAnswerOptions];
        answerOptions.splice((correctAnswerNumber - 1), 0, correctAnswer);

        const optionItems = answerOptions.map((optionText, number) =>
            <li key={"key" + optionText}>
                <label>
                    {optionText}
                    <input
                        type="radio"
                        name="answerOption"
                        value={(number + 1)}
                        checked={((number + 1) === answerSelection)}
                        onChange={this.handleInputChange} />
                </label>
            </li>
        );

        return (
            <form onSubmit={this.handleSubmit}>
                <section>
                    {questionPrompt}
                    <fieldset>
                        <legend>Select</legend>
                        <ul>
                            {optionItems}
                        </ul>
                    </fieldset>
                </section>
                {!answerWasSubmitted &&
                    <section>
                        <p>
                            <input type="submit" value="Submit Answer" disabled={answerSelection === 0} />
                        </p>
                    </section>
                }
                {answerWasSubmitted &&
                    <AnswerFeedback
                        correct={correctAnswerWasSubmitted}
                        correctAnswer={correctAnswer}
                        handleNextQuestion={this.handleNextQuestion} />
                }
            </form>
        );
    }
}

class MCVocabQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {answerSelection: 0, answerWasSubmitted: false};

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNextQuestion = this.handleNextQuestion.bind(this);
    }

    handleInputChange(selection) {
        this.setState({answerSelection: selection});
    }

    handleSubmit() {
        this.setState({answerWasSubmitted: true});
    }

    handleNextQuestion() {
        this.setState({answerSelection: 0, answerWasSubmitted: false});
        this.props.onFinishQuestion();
    }

    render() {
        const {vocabWord, ...questionData} = this.props;
        const questionPrompt = <p>{`Which of these means "${vocabWord}"?`}</p>;
    
        return (
            <MCQuestionDisplay
                questionPrompt={questionPrompt}
                answerSelection={this.state.answerSelection}
                answerWasSubmitted={this.state.answerWasSubmitted}
                {...questionData}
                handleInputChange={this.handleInputChange}
                handleSubmit={this.handleSubmit}
                onFinishQuestion={this.handleNextQuestion} />
        );
    }
}

class LessonCompleteMessage extends React.Component {
    constructor(props) {
        super(props);

        this.handleEndLesson = this.handleEndLesson.bind(this);
    }

    handleEndLesson() {
        this.props.onEndLesson();
    }

    render() {
        return (
            <div>
                <div>Lesson Complete!</div>
                <div> <button onClick={this.handleEndLesson}>Continue</button> </div>
            </div>
        );
    }
}

class QuestionArea extends React.Component {
    constructor(props) {
        super(props);

        this.handleNextQuestion = this.handleNextQuestion.bind(this);
        this.handleEndLesson = this.handleEndLesson.bind(this);
    }

    handleNextQuestion() {
        this.props.onFinishQuestion();
    }

    handleEndLesson() {
        this.props.onEndLesson();
    }

    render() {
        const {
            correct_answer: correctAnswer,
            incorrect_answer_options: incorrectAnswerOptions,
            vocab_word: vocabWord
        } = this.props.fetchedData;
        const correctAnswerNumber = 1; //I will make this random later
        const questionData = {correctAnswer, incorrectAnswerOptions, vocabWord, correctAnswerNumber};

        return (
            <div>
                <MCVocabQuestionDisplay
                    {...questionData}
                    onFinishQuestion={this.handleNextQuestion} />
            </div>
        );
    }
}

class LessonDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionNumber: 1
        };

        this.handleNextQuestion = this.handleNextQuestion.bind(this);
        this.handleQuitLesson = this.handleQuitLesson.bind(this);
    }

    handleNextQuestion() {
        this.setState({
            questionNumber: (this.state.questionNumber + 1)
        });
    }

    handleQuitLesson() {
        this.props.onNavigationSelect('menu', 'lesson-select-menu');
    }

    render() {
        const lessonData = this.props.fetchedData;
        const questionNumber = this.state.questionNumber;
        const totalQuestions = lessonData.questions.length;

        let mainArea;
        if (questionNumber <= totalQuestions) {
            const questionURL = lessonData.questions[(questionNumber - 1)] + ' Accept:application/json';
            const errorMessage = 'Something wrong with loading question';
            const QuestionAreaWithFetching = withFetching(QuestionArea, questionURL, errorMessage);
            mainArea = <QuestionAreaWithFetching
                            onFinishQuestion={this.handleNextQuestion} />
        } else {
            mainArea = <LessonCompleteMessage
                        onEndLesson={this.handleQuitLesson} />;
        }

        return (
            <div>
                <div>
                    <LessonTopBar
                        questionNumber={questionNumber}
                        onQuitLesson={this.handleQuitLesson} />
                </div>
                <div>
                    {mainArea}
                </div>
            </div>
        );
    }
}

class LessonChoiceRow extends React.Component {
    constructor(props) {
        super(props);

        this.handleClickLesson = this.handleClickLesson.bind(this);
    }

    handleClickLesson() {
        this.props.onNavigationSelect(this.props.ID);
    }

    render() {
        lesson_name = this.props.lesson_name;
        //prop ID used in handleClickLesson

        return (
            <li><button onClick={this.handleClickLesson}>{lesson_name}</button></li>
        );
    }
}

class MenuDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.handleNavigationSelect = this.handleNavigationSelect.bind(this);
    }

    handleNavigationSelect(lessonID) {
        this.props.onNavigationSelect('lesson', lessonID);
    }

    render() {
        const lessonsData = this.props.fetchedData;
        console.log(JSON.parse(JSON.stringify(lessonsData)));

        if (!lessonsData) return <div>No data loaded yet</div>;
        if (!lessonsData.length) return <div>Data is empty</div>;

        return (
            <div>
                <p>Select Lesson</p>
                <ul>
                    {lessonsData.map(lesson => {
                        return (
                            <LessonChoiceRow
                                key={lesson.lesson_name}
                                ID={lesson.id}
                                lesson_name={lesson.lesson_name}
                                onNavigationSelect={this.handleNavigationSelect} />
                        );
                    })}
                </ul>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {currentDisplay: 'lesson-select-menu', lessonID: 'menu'};

        this.handleNavigationSelect = this.handleNavigationSelect.bind(this);
    }

    handleNavigationSelect(navigationCategory, navigationSelection) {
        switch(navigationCategory) {
            case 'lesson':
                this.setState({
                    currentDisplay: 'lesson-display',
                    lessonID: navigationSelection
                });
                break;
            case 'menu':
                this.setState({
                    currentDisplay: navigationSelection,
                    lessonID: 'menu'
                });
                break;
            default:
                this.setState({
                    currentDisplay: 'lesson-select-menu',
                    lessonID: 'menu'
                });
        }
    }

    render() {
        const currentDisplay = this.state.currentDisplay;
        let display;
        console.log(currentDisplay);
        switch (currentDisplay) {
            case 'lesson-display':
                const lessonDetailURL = `api/lessons/${this.state.lessonID}.json`;
                const lessonErrorMessage = 'Something wrong with loading lesson';
                const LessonDisplayWithFetching = withFetching(LessonDisplay, lessonDetailURL, lessonErrorMessage);

                display = <LessonDisplayWithFetching
                            onNavigationSelect={this.handleNavigationSelect} />;
                break;
            case 'lesson-select-menu':
            default:
                const lessonsListURL = 'api/lessons.json';
                const lessonSelectErrorMessage = 'Something wrong with loading lesson-select menu';
                const MenuDisplayWithFetching = withFetching(MenuDisplay, lessonsListURL, lessonSelectErrorMessage);

                display = <MenuDisplayWithFetching onNavigationSelect={this.handleNavigationSelect} />;
        }
        return (
            <div>{display}</div>
        );
    }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);