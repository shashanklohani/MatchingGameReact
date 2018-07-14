const IMAGES = ["amd", "intel", "windows", "chrome", "ebay", "photoshop", "playstore", "internet-explorer", "amd", "intel", "windows", "chrome", "ebay", "photoshop", "playstore", "internet-explorer"];

class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            score: 0,
            moves: 5
        };
        this.setScore = this.setScore.bind(this);
        this.setMoves = this.setMoves.bind(this);
    }

    setScore(val) {
        this.setState({ score: val });
        if (val === 16) {
            setTimeout(() => {
                if (window.confirm('Well Done \nYou did a great Job!\nWant to play again?')) {
                    window.location.reload();
                }
            }, 500);
        }
    }

    setMoves() {
        var moves = this.state.moves - 1;
        this.setState({ moves: moves });
        if (moves === 0) {
            if (window.confirm('Game Over \nDo you want to play again?')) {
                window.location.reload();
            }
        }
    }

    render() {
        return (
            <div className="Container">
                <Header />
                <ScorePanel score={this.state.score} moves={this.state.moves} />
                <Deck setScore={this.setScore} setMoves={this.setMoves} />
            </div>
        )
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

class Deck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: shuffleArray(IMAGES.slice()),
            selected: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], // indexes which have been selected
            correct: [] // indexes which have been guessed correctly
        };
        setTimeout(() => {
            this.setState({ selected: [] })
        }, 2000);
    }

    onCardClick(clickedIndex) {
        const { selected, cards, correct } = this.state;
        if (selected.length === 0) {
            this.setState({ selected: [clickedIndex] })
        } else if (selected.length === 1) {
            if (cards[selected[0]] === cards[clickedIndex]) {
                this.setState({
                    correct: correct.concat([selected[0], clickedIndex]),
                    selected: []
                });
                this.props.setScore(this.state.correct.length + 2);
            } else {
                this.setState({ selected: [selected[0], clickedIndex] });
                this.props.setMoves();
                setTimeout(() => {
                    this.setState({ selected: [] })
                }, 1000);
            }
        }
    }

    render() {
        const { correct, selected, cards } = this.state;
        return (
            <div>
                <div className="deck">
                    {cards.map((image, i) => (
                        <Card
                            key={i}
                            image={image}
                            isCorrect={correct.includes(i)}
                            isSelected={selected.includes(i)}
                            onSelect={() => this.onCardClick(i)}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

const Card = ({ image, isSelected, isCorrect, onSelect }) => (
    <div
        className="card"
        onClick={() => {
            if (!isCorrect && !isSelected) {
                onSelect();
            }
        }}>

        <img
            style={{ visibility: (isCorrect || isSelected) ? 'visible' : 'hidden' }}
            src={"./Icons/" + image + ".png"}
            alt={image}
        />
    </div>
);

class Header extends React.Component {
    render() {
        return (
            <div className="Header">
                MATCHING GAME
                </div>
        );
    }
}

class ScorePanel extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="ScorePanel">
                <Moves moves={this.props.moves} />
                <Score score={this.props.score} />
                <RestartButton />
            </div>
        );
    }
}

class Moves extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Moves" >
                {this.props.moves} Moves
                </div>
        );
    }
}

class RestartButton extends React.Component {

    constructor() {
        super();
        this.onItemClick = this.onItemClick.bind(this);
    }

    onItemClick() {
        window.location.reload();
    }

    render() {
        return (
            <button className="RestartButton" onClick={this.onItemClick}>
                <i className="material-icons">autorenew</i>
            </button>
        );
    }
}

class Score extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const scr = (this.props.score / 16) * 100;
        return (
            <div className="Score">
                Score = {scr}%
                </div>
        );
    }
}

ReactDOM.render(
    <Container />, document.getElementById('app'));