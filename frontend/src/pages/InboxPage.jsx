import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState, useRef} from "react";

export default function InboxPage() {
    const navigate = useNavigate();
    const {folder} = useParams();
    const [letters, setLetters] = useState([]);
    const [error, setError] = useState("");
    const intervalRef = useRef(null);

    const [showCompose, setShowCompose] = useState(false);
    const [receiver, setReceiver] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);
    const [sendError, setSendError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const folders = ["inbox", "sent", "trash"];
    const folderLabels = {
        inbox: "Входящие",
        sent: "Отправленные",
        trash: "Удаленные",
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const fetchLetters = async () => {
        try {
            const res = await fetch(`http://localhost:8080/emails/${folder}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok) throw new Error("Ошибка загрузки писем");

            const data = await res.json();
            setLetters(data);
            setError("");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:8080/emails/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok) throw new Error("Ошибка при удалении");

            setLetters((prev) => prev.filter((email) => email.id !== id));
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        if (!folders.includes(folder)) {
            navigate("/mail/inbox");
            return;
        }

        fetchLetters();
        setError("");

        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(fetchLetters, 5000);

        return () => clearInterval(intervalRef.current);
    }, [folder, navigate]);

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
            <aside className="w-64 bg-white p-4 shadow-xl flex flex-col fixed h-full">
                <h2 className="text-xl font-bold mb-4 text-gray-700">📬 Почта</h2>
                {folders.map((f) => (
                    <button
                        key={f}
                        onClick={() => navigate(`/mail/${f}`)}
                        className={`text-left w-full px-3 py-2 rounded-xl font-medium mb-1 ${
                            folder === f
                                ? "bg-blue-100 text-blue-700"
                                : "hover:bg-gray-100 text-gray-700"
                        }`}
                    >
                        {folderLabels[f]}
                    </button>
                ))}
                <button
                    onClick={handleLogout}
                    className="mt-auto bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
                >
                    Выйти
                </button>
            </aside>

            <main className="ml-64 flex-1 p-8 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {folderLabels[folder] || "Папка"}
                        </h1>

                        <div className="flex gap-2">
                            {folder === "trash" && (
                                <button
                                    onClick={async () => {
                                        const confirmed = window.confirm("Удалить все письма безвозвратно?");
                                        if (!confirmed) return;

                                        await fetch("http://localhost:8080/emails/trash", {
                                            method: "DELETE",
                                            headers: {
                                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                                            },
                                        });

                                        fetchLetters();
                                    }}
                                    className="text-sm bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                                >
                                    🧹 Удалить навсегда
                                </button>
                            )}

                            <button
                                onClick={() => setShowCompose(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
                            >
                                ✉ Написать
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-red-500">{error}</p>}

                    {letters.length === 0 ? (
                        <p className="text-gray-500">Писем пока нет.</p>
                    ) : (
                        <ul className="space-y-3">
                            {letters.map((email) => (
                                <li
                                    key={email.id}
                                    className="p-4 bg-white rounded-xl shadow flex justify-between items-start hover:bg-gray-50"
                                >
                                    <div>
                                        <div className="font-semibold text-blue-900">
                                            {email.subject}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {email.sender.firstName} {email.sender.lastName} ({email.sender.login})
                                        </div>
                                        <div className="text-sm text-gray-800 mt-1 line-clamp-2">
                                            {email.body}
                                        </div>
                                    </div>

                                    {folder !== "trash" && (
                                        <button
                                            onClick={() => handleDelete(email.id)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Удалить"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>

            {showCompose && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg space-y-4 relative">
                        <button
                            onClick={() => setShowCompose(false)}
                            className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold text-gray-800">Новое письмо</h2>
                        <input
                            type="text"
                            placeholder="Кому (логин)"
                            value={receiver}
                            onChange={(e) => setReceiver(e.target.value)}
                            className="w-full border px-3 py-2 rounded-xl"
                        />
                        <input
                            type="text"
                            placeholder="Тема"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full border px-3 py-2 rounded-xl"
                        />
                        <textarea
                            placeholder="Сообщение"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="w-full border px-3 py-2 rounded-xl min-h-[120px]"
                        />
                        {sendError && <div className="text-red-500 text-sm">{sendError}</div>}
                        <button
                            onClick={async () => {
                                setSending(true);
                                setSendError("");
                                try {
                                    const res = await fetch("http://localhost:8080/emails/send", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                                        },
                                        body: JSON.stringify({receiver, subject, body}),
                                    });

                                    if (!res.ok) throw new Error("Ошибка при отправке");

                                    setShowCompose(false);
                                    setReceiver("");
                                    setSubject("");
                                    setBody("");
                                    setShowSuccess(true);
                                    if (folder === "sent") fetchLetters();
                                } catch (err) {
                                    setSendError(err.message);
                                } finally {
                                    setSending(false);
                                }
                            }}
                            className="bg-blue-500 text-white w-full py-2 rounded-xl hover:bg-blue-600 disabled:opacity-60"
                            disabled={sending}
                        >
                            {sending ? "Отправка..." : "Отправить"}
                        </button>
                    </div>
                </div>
            )}

            {showSuccess && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-xl shadow z-50">
                    Письмо успешно отправлено
                </div>
            )}
        </div>
    );
}
