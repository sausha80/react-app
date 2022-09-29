import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props){
  if (props.highlight) {
    //console.log("painting highlighted square");
    return (
      <button className='square winner' onClick={props.onClick}>
        {props.value}
      </button>
    )  
  }
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    const winner = calculateWinner(this.props.squares);
    const highlightSquare = winner ? winner.winSquares.includes(i) : false
    return (
      <Square
        key = {i} 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={highlightSquare}
      />
    );
  }

  render() {
    const row = [];
    for (let r = 0; r < 3; r++){
      const col = [];
      for (let c = 0; c <3; c++){
        col.push(this.renderSquare(3*r+c));
      }
      row.push(<div key={r} className="board-row">{col}</div>);
    }

    return (
      <div key='dummy'>
        {row}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      reverseHistory: null,
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{
        squares: squares,
        position: [(i-i%3)/3+1, i%3+1],
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  toggleMoves(){
    this.setState({
      reverseHistory: this.state.reverseHistory ? null : this.state.history.slice().reverse(),
    })
  }

  render() {
    const history = this.state.reverseHistory ? this.state.reverseHistory : this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares) ? calculateWinner(current.squares).winSign : null;
    //console.log(calculateWinner(current.squares) ? calculateWinner(current.squares).winSquares : null);
    let desc = null;

    const moves = history.map((step, move) => {
      if (this.state.reverseHistory){
        //console.log('painting reverse histroy: move - ', move, typeof(move), ' history length - ', history.length, typeof(history.length));
        desc = move === history.length-1 ? 'Go to game start' : 'Go to move #' + (history.length-move-1) + '(' + step.position + ')';
      }else {
        desc = move ? 'Go to move #' + move + '(' + step.position + ')' : 'Go to game start';
      }
      
      if (move === this.state.stepNumber){
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
              <b>{desc}</b>
            </button>
          </li>
        )
      };
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    })
      

    const orderMoves = () => {
      return (
        <button onClick={() => this.toggleMoves()}>order moves</button>
      )
    }

    let status;
    if (winner){
      status = 'Winner: ' + winner;
    } else if (current.squares.every(element => element != null)){
      status = 'It\'s a draw, Game Over!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)} 
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{orderMoves()}</div>
          <ol>{moves}</ol>
          <div><a href="/catalogsearch">go to catalog search module</a></div>
        </div>
        <div>
          
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares){
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];
  for (let i=0; i<lines.length; i++){
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return ({
        winSign: squares[a],
        winSquares: lines[i],
      })
    }
  }
  return null;
}
