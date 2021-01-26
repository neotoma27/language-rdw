import React, { Component } from "react";
import ReactDOM, { render } from "react-dom";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lessonsData: [],
            isLoading: false,
            error: null,
        };

        // this.handleClickLesson = this.handleClickLesson.bind(this);
    }

    // handleClickLesson(event) {
    //     this.props.onNavigationSelect('lesson', event.target.name);
    // }

    componentDidMount() {
        this.setState({ isLoading: true });
        
        fetch("api/lesson")
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
            return <p>Loading lessons</p>;
        }

        return (
            <div>
                <p>Select Lesson</p>
                <ul>
                    {this.state.lessonsData.map(lesson => {
                        return (
                            <li key={lesson.subject}>
                                {lesson.subject}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);