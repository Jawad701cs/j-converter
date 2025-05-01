import logo from './logo.svg';
import './App.css';
import Voice from './Components/Voice';
import Logo from './Components/Logo';
import { useEffect, useState } from 'react';
function App() {
  const [logo,setLogo] = useState(true);
  useEffect(()=>{
    setTimeout(() => {
       setLogo(false)
    }, 5000);
  },[])
  return (
    <div className="App">
      {logo ? <Logo/> : <Voice/>}
    </div>
  );
}

export default App;
