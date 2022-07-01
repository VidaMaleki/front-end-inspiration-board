import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import NewBoardForm from "./components/NewBoardForm";
import BoardsList from "./components/BoardsList";
import HideForm from "./components/HideForm";
import NewCardForm from "./components/NewCardForm";
import CardsList from "./components/CardsList";

function App() {
  const selectedBoardData = {
    id: null,
    title: "",
    owner: "",
  };

  // keeping stracking on board state
  const [boards, setBoards] = useState([]);
  // keeping tracking on showing or hiding form state
  const [displayForm, setDisplayForm] = useState(true);
  // keeping tracking on selected board state
  const [boardSelected, setBoardSelected] = useState(selectedBoardData);
  const [cardsData, setCardsData] = useState([]);
  const URL = "https://get-inspired-c17.herokuapp.com/boards";

  // get all boards from DB
  const fetchBoards = () => {
    axios
      .get(URL)
      .then((response) => {
        const newBoards = response.data.map((board) => {
          return {
            id: board.id,
            title: board.title,
            owner: board.owner,
          };
        });
        setBoards(newBoards);
      })
      .catch((error) => {
        alert("Oop! Could not access the boards!");
      });
  };

  // rendering and showing data once
  useEffect(fetchBoards, []);

  // adding board
  const addBoard = (boardInfo) => {
    axios
      .post(URL, boardInfo)
      .then((res) => {
        if (boardInfo.title && boardInfo.owner) {
          fetchBoards();
        } else {
          alert("Oop! Missing title or owner!");
        }
      })
      .catch((err) => {
        alert("Oop! Could not add the board!");
      });
  };

  // function to show or hide the form by click
  const flipDisplayForm = () => {
    setDisplayForm(!displayForm);
  };

  // showing selected board
  const selectedBoard = (id) => {
    const newBoards = [...boards];
    for (const board of newBoards) {
      if (board.id === id) {
        setBoardSelected(board);
        fetchCards(board.id);
      }
    }
  };

  const fetchCards = () => {
    axios
      .get(`${URL}/${boards.id}/cards`)
      .then((response) => {
        const newCards = response.data.map((card) => {
          return {
            id: card.card_id,
            message: card.message,
            likes_count: card.likes_count,
            board_id: card.board_id,
          };
        });
        setCardsData(newCards);
      })
      .catch((error) => {
        alert("Oop! Could not access the cards!");
      });
  };

  const postNewCard = (cardInfo) => {
    const boardId = cardInfo.board_id;
    console.log(cardInfo);
    console.log(boardSelected.id);
    axios
      .post(`${URL}/${boardId}/cards`, cardInfo)
      .then((response) => {
        fetchCards();
      })
      .catch((error) => {
        alert("Couldn't create a new card.");
      });
  };

  // .then((response) => {
  //   const new_cards = [...cardsData];
  //   new_cards.push(response.data.new_cards);
  //   setCardsData(new_cards);
  // })
  // .catch((error) => {
  //   console.log("Error:", error);
  //   alert("Couldn't create a new card.");
  // });
  return (
    <div className="App">
      <header className="App-header">
        <h1>Inspiration Board</h1>
      </header>
      <div>
        <section className="box-container">
          <div className="board">
            <h2>Boards</h2>
            <div className="boards-list">
              <BoardsList
                boardsList={boards}
                selectedBoardCallBack={selectedBoard}
              />
            </div>
          </div>
          <div className="selected-board">
            <h2>Selected Boards</h2>
            <div>
              {boardSelected.id
                ? `${boardSelected.title} - ${boardSelected.owner}`
                : "Select a Board from the Board List!"}
            </div>
          </div>
          <div className="New-board">
            <h2>Create a New Board</h2>
            {displayForm ? (
              <NewBoardForm
                addBoardCallBack={addBoard}
                flipFormCallBack={flipDisplayForm}
              />
            ) : (
              <HideForm flipFormCallBack={flipDisplayForm} />
            )}
          </div>
          <div>
            <h2>Card list</h2>
            <CardsList cardsList={cardsData} />
          </div>
          <div>
            <NewCardForm postNewCard={postNewCard}></NewCardForm>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
