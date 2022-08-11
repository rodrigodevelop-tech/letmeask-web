import { useNavigate, useParams } from "react-router-dom";
import logoImg from "../../assets/images/logo.svg";
import deleteImg from "../../assets/images/delete.svg";
import { Button } from "../../components/Button";
import { Question } from "../../components/Question";
import { RoomCode } from "../../components/RoomCode";
// import { useAuth } from "../../hooks/useAuth";
import { useRoom } from "../../hooks/useRoom";
import "../room.scss";
import { RealTimeDataBase, ref, remove, update } from "../../services/firebase";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  // const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<RoomParams>();

  if (!id) {
    throw new Error("Could not find room!");
  }
  const roomId = id;

  const { title, questions } = useRoom(roomId);

  async function handleDeleteQuestion(questionId: string) {
    if (confirm("Tem certeza que deseja remover essa pergunta?")) {
      const newLike = ref(
        RealTimeDataBase,
        `rooms/${roomId}/questions/${questionId}`
      );

      await remove(newLike);
    }
  }

  async function handleEndRoom() {
    const newLike = ref(RealTimeDataBase, `rooms/${roomId}`);

    await update(newLike, {
      endedAt: new Date(),
    });

    navigate("/");
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" onClick={() => navigate("/")} />
          <div>
            <RoomCode code={roomId!} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
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

        <div className="list-questions">
          {questions.map((question) => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
            >
              <button
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Remover pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
