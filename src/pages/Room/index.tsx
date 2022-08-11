import { FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logoImg from "../../assets/images/logo.svg";
import { Button } from "../../components/Button";
import { Question } from "../../components/Question";
import { RoomCode } from "../../components/RoomCode";
import { useAuth } from "../../hooks/useAuth";
import { useRoom } from "../../hooks/useRoom";
import { Like } from "../../components/Like";
import {
  push,
  RealTimeDataBase,
  ref,
  remove,
  set,
} from "../../services/firebase";
import "../room.scss";

type RoomParams = {
  id: string;
};

export function Room() {
  const [newQuestion, setNewQuestion] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<RoomParams>();

  if (!id) {
    throw new Error("Could not find room!");
  }
  const roomId = id;

  const { title, questions } = useRoom(roomId);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      throw new Error("You must be logged in");
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswer: false,
    };

    const roomRef = ref(RealTimeDataBase, `rooms/${roomId}/questions`);

    const firebaseRoom = await push(roomRef);

    await set(firebaseRoom, question);

    setNewQuestion("");
  }

  async function handleLikeQuestion(
    questionId: string,
    likedId: string | undefined
  ) {
    if (likedId) {
      const newLike = ref(
        RealTimeDataBase,
        `rooms/${roomId}/questions/${questionId}/likes/${likedId}`
      );

      await remove(newLike);
    } else {
      const newLike = ref(
        RealTimeDataBase,
        `rooms/${roomId}/questions/${questionId}/likes`
      );

      const questionsLiked = await push(newLike);

      await set(questionsLiked, {
        authorId: user?.id,
      });
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" onClick={() => navigate("/")} />
          <RoomCode code={roomId!} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length === 1 ? (
            <span>{questions.length} pergunta</span>
          ) : questions.length > 0 ? (
            <span>{questions.length} perguntas</span>
          ) : null}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user?.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça seu login</button>
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>
        <div className="list-questions">
          {questions.map((question) => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
            >
              <button
                className={`like-button ${question.likedId ? "liked" : ""}`}
                type="button"
                aria-label="Marcar como gostei"
                onClick={() =>
                  handleLikeQuestion(question.id, question.likedId)
                }
              >
                {question.likeCount > 0 && <span>{question.likeCount}</span>}
                <Like
                  color={`${
                    question.likedId ? "var(--purple)" : "var(--gray-dark)"
                  }`}
                  hasLiked={!!question.likedId}
                />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
