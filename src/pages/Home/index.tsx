import { useNavigate } from "react-router-dom";

import { Button } from "../../components/Button";

import illustrationImg from "../../assets/images/illustration.svg";
import logoImg from "../../assets/images/logo.svg";
import googleIconImg from "../../assets/images/google-icon.svg";
import "../auth-home.scss";

import { useAuth } from "../../hooks/useAuth";
import { FormEvent, useState } from "react";
import { child, get, RealTimeDataBase, ref } from "../../services/firebase";

export function Home() {
  const [roomCode, setRoomCode] = useState("");
  const { user, signWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleCreateRoom() {
    if (!user) {
      await signWithGoogle();
    }
    navigate("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    const roomRef = ref(RealTimeDataBase);

    const firebaseRoom = await get(child(roomRef, `rooms/${roomCode}`));

    if (!firebaseRoom.exists()) {
      alert("Room does not exists.");
      return;
    }

    if (firebaseRoom.val().endedAt) {
      alert("Room already closed.");
      return;
    }

    navigate(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie sala de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Logo da Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
