import {useContractKit} from "@celo-tools/use-contractkit"
import Cover from "./components/Cover";
import Counter from "./components/Counter";

import './App.css';
import "@celo-tools/use-contractkit/lib/styles.css";
import "react-toastify/dist/ReactToastify.min.css";

const App = () => {
    const {address} = useContractKit()

    return (
        <div className="App">
            <header className="App-header">
                {address ?
                    <Counter/>
                    :
                    <Cover/>
                }

            </header>
        </div>
    );
}

export default App;
