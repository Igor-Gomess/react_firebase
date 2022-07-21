import {useState} from 'react';
import firebase from "./firebaseConnection";
import './style.css';

function App() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cargo, setCargo] = useState('');
  const [nome, setNome] = useState('');

  const [user, setUser] = useState({});

  async function novoUsuario(){
    await firebase.auth().createUserWithEmailAndPassword(email, senha)
    .then(async(value)=>{
      await firebase.firestore().collection('users')
      .doc(value.user.uid)
      .set({
        nome: nome,
        cargo: cargo,
        status: true,
      })
      .then(()=>{
        setNome('');
        setCargo('');
        setEmail('');
        setSenha('');
      })
    })
    .catch((error) => {
      if(error.code === 'auth/weak-password'){
        alert('Senha muito fraca...');
      }else if(error.code === 'auth/email-already-in-use'){
        alert('E-mail já existente...');
      }
    })
  }

  async function logout(){
    await firebase.auth().signOut();
    setUser({});
  }  

  async function login(){
    await firebase.auth().signInWithEmailAndPassword(email, senha)
    .then(async (value)=>{
      await firebase.firestore().collection('users')
      .doc(value.user.uid)
      .get()
      .then((snapshot)=>{
        setUser({
          nome: snapshot.data().nome,
          cargo: snapshot.data().cargo,
          status: snapshot.data().status,
          email: value.user.email
        });
      })
    })
    .catch((error)=>{
      console.log('ERRO AO LOGAR' + error)
    })
  }

  return (
    <div>
      <h1>ReactJS + Firebase :)</h1><br/>  

      <div className='container'>
        <label>Nome</label>
        <input type="text" value={nome} onChange={(event) => setNome(event.target.value)} /><br/>

        <label>Cargo</label>
        <input type="text" value={cargo} onChange={(event) => setCargo(event.target.value)} /><br/>
        
        <label>Email</label>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /><br/>

        <label>Senha</label>
        <input type="password" value={senha} onChange={(event) => setSenha(event.target.value)} /><br/>

        <button onClick={ login }>Fazer Login</button>
        <button onClick={ novoUsuario }>Cadastrar</button>
        <button onClick={ logout }>Sair da conta!</button>
      </div>

    <hr/>  <br/>

    {Object.keys(user).length > 0 && (
      <div>
        <strong>Olá</strong> {user.nome} <br/>
        <strong>Cargo: </strong> {user.cargo} <br/>
        <strong>Email: </strong> {user.email} <br/>
        <strong>Status: </strong> {user.status ? 'ATIVO' : 'DESATIVADO'} <br/>
      </div>
    )} 
  
    </div>
  );
}

export default App;