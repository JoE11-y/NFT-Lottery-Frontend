import {useContractKit} from "@celo-tools/use-contractkit"
import Cover from "./components/Cover";
import Counter from "./components/Counter";

import './App.css';

const App =  function AppWrapper() {
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
