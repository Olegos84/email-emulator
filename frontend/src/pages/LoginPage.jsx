import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const passwordsMatch = password === confirmPassword;

  const getPasswordStrength = () => {
    if (password.length === 0) return "";
    if (password.length < 4) return "Очень слабый";
    if (password.length < 6) return "Слабый";
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return "Средний";
    if (password.length >= 8 && /[!@#$%^&*]/.test(password)) return "Сильный";
    return "Хороший";
  };

  const getStrengthColor = () => {
    const strength = getPasswordStrength();
    switch (strength) {
      case "Очень слабый": return "text-red-500";
      case "Слабый": return "text-orange-500";
      case "Средний": return "text-yellow-500";
      case "Хороший": return "text-blue-500";
      case "Сильный": return "text-green-600";
      default: return "text-gray-500";
    }
  };

  const passwordStrength = getPasswordStrength();

  const resetFields = () => {
    setLogin("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setGroupName("");
    setError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isRegistering && !passwordsMatch) {
      setError("Пароли не совпадают");
      return;
    }

    const url = isRegistering
        ? "http://localhost:8080/auth/register"
        : "http://localhost:8080/auth/login";

    const payload = isRegistering
        ? { login, password, firstName, lastName, groupName }
        : { login, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Ошибка входа или регистрации");

      const data = await res.json();
      localStorage.setItem("token", data.token);

      navigate("/inbox");
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    resetFields();
  };

  return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-4"
        >
          <h2 className="text-2xl font-bold text-center text-gray-700">
            {isRegistering ? "Регистрация" : "Вход в почту"}
          </h2>

          <input
              type="text"
              placeholder="Логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
          />

          {isRegistering && (
              <>
                <input
                    type="text"
                    placeholder="Имя"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
                <input
                    type="text"
                    placeholder="Фамилия"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
                <input
                    type="text"
                    placeholder="Группа"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
              </>
          )}

          <div className="relative">
            <input
                type={showPassword ? "text" : "password"}
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                required
            />
            <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
            >
            {showPassword ? "🙈" : "👁️"}
          </span>
          </div>

          {isRegistering && password && (
              <div className={`text-sm -mt-2 mb-1 ${getStrengthColor()}`}>
                Сложность пароля: <span className="font-medium">{passwordStrength}</span>
              </div>
          )}

          {isRegistering && (
              <div className="relative">
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Подтвердите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 pr-10 ${
                        confirmPassword && !passwordsMatch
                            ? "border-red-500 focus:ring-red-400"
                            : "focus:ring-blue-400"
                    }`}
                    required
                />
                <span
                    className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
                {!passwordsMatch && confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">Пароли не совпадают</p>
                )}
              </div>
          )}

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition-all"
          >
            {isRegistering ? "Зарегистрироваться" : "Войти"}
          </button>

          <p className="text-sm text-center text-gray-600">
            {isRegistering ? "Уже есть аккаунт?" : "Нет аккаунта?"} {" "}
            <button
                type="button"
                onClick={toggleMode}
                className="text-blue-500 hover:underline"
            >
              {isRegistering ? "Войти" : "Зарегистрироваться"}
            </button>
          </p>
        </form>
      </div>
  );
}