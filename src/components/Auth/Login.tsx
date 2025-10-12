import React, { useState, FormEvent } from 'react';
import { FirebaseError } from 'firebase/app';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

interface LoginProps {
  auth: Auth | null;
}

const Login: React.FC<LoginProps> = ({ auth }) => {
  // Estados para controlar o formulário
  const [isLogin, setIsLogin] = useState(true); // Controla se estamos em modo Login ou Cadastro
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Função para lidar com o envio do formulário
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!auth) {
        setError("Serviço de autenticação não está pronto.");
        setLoading(false);
        return;
        }

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (error) { // MUDANÇA: Capturamos o erro genérico primeiro
        // MUDANÇA: Afirmamos que este erro é do tipo FirebaseError
            const firebaseError = error as FirebaseError;

            // Agora usamos a nossa variável tipada
            switch (firebaseError.code) {
                case 'auth/user-not-found':
                setError('Nenhum treinador encontrado com este e-mail.');
                break;
                case 'auth/wrong-password':
                setError('Senha incorreta. Tente novamente.');
                break;
                case 'auth/email-already-in-use':
                setError('Este e-mail já está registrado por outro treinador.');
                break;
                case 'auth/weak-password':
                setError('A senha precisa ter pelo menos 6 caracteres.');
                break;
                default:
                setError('Ocorreu um erro. Tente novamente mais tarde.');
                break;
            }
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isLogin ? 'Login de Treinador' : 'Registro de Novo Treinador'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-bold text-gray-600 block">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-bold text-gray-600 block">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {error && <p className="text-sm text-center text-red-500">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md disabled:bg-indigo-300 transition-colors"
            >
              {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Registrar')}
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-600">
          {isLogin ? 'Não tem uma conta?' : 'Já é um treinador?'}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="ml-1 font-semibold text-indigo-600 hover:underline"
          >
            {isLogin ? 'Registre-se' : 'Faça Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;