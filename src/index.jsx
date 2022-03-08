import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
        <button title="" className="square" onClick={() => props.onClick()}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {


    renderSquare(i, y, x) {
        return <Square
            value={this.props.squares[i]} key={i}
            onClick={() => this.props.onClick(i, y, x)}/>;
    }

    render(props) {

        let i = 0
        let arr = [1, 2, 3]

        return <div>
            {arr.map(y =>
                <div className="board-row" key={y}>
                    {arr.map(x => this.renderSquare(i++, y, x))}
                </div>)
            }
        </div>

    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    x: 0,  // 行号
                    y: 0, // 列号
                    step: 0, // 当前步骤
                }
            ],
            isSort: false, // 升降序 false 升 true 降
            stepNumber: 0,
            xIsNext: true
        }
    }

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
                y: y,
                step: history.length
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

    sortHistory() {
        this.setState({
            isSort: !this.state.isSort,
        })
    }

    render() {
        const history = this.state.history.slice()
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares)
        if (this.state.isSort) {
            history.reverse()
        }

        const moves = history.map((item, move) => {
            const desc = item.step
                ? 'Get to move # ' + item.step + ' y: ' + item.y + ' x:' + item.x
                : 'Get to game start'
            return (
                <li key={move}>
                    <button style={{
                        fontWeight: this.state.stepNumber === item.step ? 'bolder' : 'normal'
                    }} onClick={() => this.jumpTo(item.step)}>{desc}</button>
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
                    <button onClick={() => this.sortHistory()}>
                        {this.state.isSort ? '降' : '升'}序
                    </button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

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
