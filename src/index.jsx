import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
        <button className="square" onClick={() => props.onClick()}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {


    renderSquare(i, y, x) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i, y, x)}/>;
    }

    render() {

        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0, 1, 1)}
                    {this.renderSquare(1, 1, 2)}
                    {this.renderSquare(2, 1, 3)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3, 2, 1)}
                    {this.renderSquare(4, 2, 2)}
                    {this.renderSquare(5, 2, 3)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6, 3, 1)}
                    {this.renderSquare(7, 3, 2)}
                    {this.renderSquare(8, 3, 3)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {

    handleClick(i, y, x) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1]
        const squares = current.squares.slice()
        if (calculateWinner(squares) || squares[i]) {
            return
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            history: history.concat([{
                squares: squares,
                x: x,
                y: y
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })

    }

    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    x: 0,
                    y: 0,
                }
            ],
            stepNumber: 0,
            xIsNext: true
        }
    }

    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares)

        const moves = history.map((step, move) => {
            const desc = move
                ? 'Get to move # ' + move + ' y: ' + step.y + ' x:' + step.x
                : 'Get to game start'
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        let status
        if (winner) {
            status = 'Winner: ' + winner
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i, y, x) => this.handleClick(i, y, x)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

/**
 * 临时用来做测试的看看是怎么只更新字符串的
 */

// class DateView extends React.Component {
//     render() {
//         return (<div>
//                 <h1>Hello, world!</h1>
//                 <h2>It is {new Date().toLocaleTimeString()}.</h2>
//             </div>
//         )
//     }
//
// }
//
// window.timeI = setInterval(() =>
//     ReactDOM.render(
//         <DateView/>,
//         document.getElementById('root')
//     ), 1000
// )

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
