import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { auth, firebaseReady } from "./firebase";

type Message = { id: number; text: string; mine: boolean; time: string };

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  async function authenticate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!auth || !firebaseReady) {
      setError("Firebase ещё не настроен. Добавьте переменные VITE_FIREBASE_* в GitHub Actions Secrets или файл .env.");
      return;
    }
    try {
      if (register) await createUserWithEmailAndPassword(auth, email.trim(), password);
      else await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось выполнить вход.");
    }
  }

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages(old => [...old, { id: Date.now(), text, mine: true, time: new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}) }]);
    setDraft("");
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon">✦</div><div><b>DonorGram</b><small>пространство для своих</small></div></div>
      <div className="profile"><div className="avatar">{(user?.email?.[0] || "D").toUpperCase()}</div><div><b>{user?.email || "Гость"}</b><small>{user ? "Аккаунт подключён" : "Демо-режим"}</small></div></div>
      {!user && <form className="auth-form" onSubmit={authenticate}>
        <h3>{register ? "Создать аккаунт" : "Войти"}</h3>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Пароль (от 6 символов)" value={password} onChange={e=>setPassword(e.target.value)} minLength={6} required />
        <button className="primary">{register ? "Регистрация" : "Войти"}</button>
        <button type="button" className="text-button" onClick={()=>setRegister(v=>!v)}>{register ? "Уже есть аккаунт? Войти" : "Создать аккаунт"}</button>
        {error && <p className="error">{error}</p>}
        {!firebaseReady && <p className="hint">Firebase не подключён</p>}
      </form>}
      <div className="section-title">РАБОЧЕЕ ПРОСТРАНСТВО</div>
      <button className="nav-active">▦　Общий чат</button>
      <button className="nav-item">✧　DonAI помощник <span>AI</span></button>
      <button className="nav-item">⌖　Моя геопозиция</button>
      <div className="sidebar-bottom"><span className="online-dot"/> {firebaseReady ? "Firebase настроен" : "Оффлайн-предпросмотр"}</div>
    </aside>
    <main className="chat">
      <header className="topbar"><div><span>Сообщения　/　</span><b>Общий чат</b></div><div className="top-actions"><span>◇ Приватность в приоритете</span>{user && <button className="logout" onClick={()=>auth && signOut(auth)}>Выйти</button>}</div></header>
      <section className="room-heading"><div className="room-symbol">#</div><div><h1>Общий чат</h1><p>Личное пространство · {messages.length} сообщений</p></div><span className="privacy">●　Защищённое пространство</span></section>
      <div className="notice">Добро пожаловать в DonorGram. Напиши первое сообщение или подключи Firebase для входа.</div>
      <section className="messages">
        {messages.length === 0 ? <div className="empty"><div className="empty-icon">✉</div><h2>Начни разговор</h2><p>Здесь пока тихо. Отправь первое сообщение — короткое и по делу.</p></div> : messages.map(m=><div className={m.mine ? "message mine" : "message"} key={m.id}><div className="message-avatar">{m.mine ? "Я" : "D"}</div><div><div className="message-meta"><b>{m.mine ? user?.email || "Ты" : "DonorGram"}</b><span>{m.time}</span></div><div className="bubble">{m.text}</div></div></div>)}
      </section>
      <form className="composer" onSubmit={send}><div className="composer-label">Сообщение · Enter — отправить</div><textarea value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send(e as unknown as React.FormEvent);}}} placeholder="Написать сообщение..." rows={2} maxLength={4000}/><div className="composer-footer"><span>{draft.length}/4000 символов</span><button className="send" disabled={!draft.trim()}>Отправить　➤</button></div></form>
      <footer>DONORGRAM　•　BUILD 0.1 <span>Сделано для общения</span></footer>
    </main>
  </div>;
}
