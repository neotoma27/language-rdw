import React, { Component } from "react";
import ReactDOM, { render } from "react-dom";

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
        const userAnswer = this.props.userAnswer;
        const correctAnswer = this.props.correctAnswer;
        const answerWasSubmitted = this.props.answerWasSubmitted;

        let feedbackArea;
        if (!answerWasSubmitted) {
            feedbackArea =
                <div> <input type="submit" value="Submit Answer" /> </div>;
        } else {
            feedbackArea = (
                <div>
                    <div> {(userAnswer === correctAnswer) ? 'Correct' : 'Incorrect'} </div>
                    <div> <button onClick={this.handleClick}>Continue</button> </div>
                </div>
            );
        }

        return (
            <section>{feedbackArea}</section>
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
        const options = this.props.answerOptions;
        const optionIDsMap = this.props.optionIDsMap;
        const correctAnswer = this.props.correctAnswer;
        const selection = this.props.answerSelection;
        const answerWasSubmitted = this.props.answerWasSubmitted;
        const instructions = this.props.instructions;
        const optionItems = options.map((optionText, number) =>
            <li key={optionIDsMap.get(optionText)}>
                <label>
                    {optionText}
                    <input
                        type="radio"
                        name="answerOption"
                        value={(number + 1)}
                        checked={((number + 1) === selection)}
                        onChange={this.handleInputChange} />
                </label>
            </li>
        );

        return (
            <form onSubmit={this.handleSubmit}>
                <section>
                    {instructions}
                    <fieldset>
                        <legend>Select</legend>
                        <ul>
                            {optionItems}
                        </ul>
                    </fieldset>
                </section>
                <AnswerFeedback
                    userAnswer={selection}
                    answerWasSubmitted={answerWasSubmitted}
                    correctAnswer={correctAnswer}
                    handleNextQuestion={this.handleNextQuestion} />
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
        //left off around here, need to get question and choices information from questionData
        const questionData = this.props.questionData;
        const {vocabularyPhrase, options, optionIDsMap, correctAnswer} = this.props;
        const {answerSelection, answerWasSubmitted} = this.state;
        const instructions = <p>{`Which of these means "${vocabularyPhrase}"?`}</p>;

        return (
            <MCQuestionDisplay
                answerOptions={options}
                optionIDsMap={optionIDsMap}
                correctAnswer={correctAnswer}
                answerSelection={answerSelection}
                answerWasSubmitted={answerWasSubmitted}
                instructions={instructions}
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
        this.state = {
            lessonData: [],
            isLoading: false,
            error: null,
        };

        this.handleNextQuestion = this.handleNextQuestion.bind(this);
        this.handleEndLesson = this.handleEndLesson.bind(this);
    }

    handleNextQuestion() {
        this.props.onFinishQuestion();
    }

    handleEndLesson() {
        this.props.onEndLesson();
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        
        const fetchPath = `lessons/lesson-detail/${this.props.lessonID}/`;
        fetch(fetchPath)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something wrong with loading lesson');
                }
            })
            .then(data => this.setState({ lessonData: data, isLoading: false }))
            .catch(error => this.setState({ error, isLoading: false }));
    }

    render() {
        const questionNumber = this.props.questionNumber;
        const lessonData = this.state.lessonData;
        const totalQuestions = lessonData.questions.length;
        const currentQuestion = lessonData.questions[(questionNumber - 1)];

        let display;
        if (questionNumber <= totalQuestions) {
            display = <MCVocabQuestionDisplay
                        questionData={currentQuestion}
                        onFinishQuestion={this.handleNextQuestion} />;
        } else {
            display = <LessonCompleteMessage
                        onEndLesson={this.handleEndLesson} />;
        }
        return (
            <div>{display}</div>
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
        return (
            <div>
                <div>
                    <LessonTopBar
                        questionNumber={this.state.questionNumber}
                        onQuitLesson={this.handleQuitLesson} />
                </div>
                <div>
                    <QuestionArea
                        questionNumber={this.state.questionNumber}
                        onFinishQuestion={this.handleNextQuestion} />
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
        subject = this.props.subject;
        //prop ID used in handleClickLesson

        return (
            <li><button onClick={this.handleClickLesson}>{subject}</button></li>
        );
    }
}

class MenuDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lessonsData: [],
            isLoading: false,
            error: null,
        };

        this.handleNavigationSelect = this.handleNavigationSelect.bind(this);
    }

    handleNavigationSelect(lessonID) {
        this.props.onNavigationSelect('lesson', lessonID);
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        
        fetch("lessons/lesson-list/")
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something wrong with loading lessons');
                }
            })
            .then(data => this.setState({ lessonsData: data, isLoading: false }))
            .catch(error => this.setState({ error, isLoading: false }));
    }

    render() {
        const { lessonsData, isLoading, error } = this.state;

        if (error) {
            return <p>{error.message}</p>;
        }

        if (isLoading) {
            return <p>Loading lessons...</p>;
        }

        return (
            <div>
                <p>Select Lesson</p>
                <ul>
                    {lessonsData.map(lesson => {
                        return (
                            <LessonChoiceRow
                                key={lesson.subject}
                                ID={lesson.id}
                                subject={lesson.subject}
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
        switch (currentDisplay) {
            case 'lesson-select-menu':
                display = <MenuDisplay onNavigationSelect={this.handleNavigationSelect} />;
                break;
            case 'lesson-display':
                display = <LessonDisplay
                            lessonID={this.state.lessonID}
                            onNavigationSelect={this.handleNavigationSelect} />;
                break;
            default:
                display = <MenuDisplay onNavigationSelect={this.handleNavigationSelect} />;
        }
        return (
            <div>{display}</div>
        );
    }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);