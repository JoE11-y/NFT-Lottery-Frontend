import logo from './logo.svg';
import './App.css';
import "@celo-tools/use-contractkit/lib/styles.css";
import "react-toastify/dist/ReactToastify.min.css";

function App() {
    return (
        <div className="App">
            <header className="App-header">

                <img src={logo} className="App-logo" alt="logo" />
                <p>
                   NFT Minter Boilerplate
                </p>

                <p>
                    Lets get started!
                </p>


            </header>
        </div>
    );
}

export default App;
