import {useState, useEffect, useCallback} from 'react';
import {useContractKit} from '@celo-tools/use-contractkit';
import {useDappContract} from "./useDappContract";

export const useCount = () => {
    const {address, kit} = useContractKit();
    const [count, setCount] = useState(0);
    const dappContract = useDappContract();


    const getCount = useCallback(async () => {

        if (!dappContract) return
        // fetch a connected wallet token balance
        const value = await dappContract.methods.get().call();
        setCount(value);
    }, [address, kit, dappContract]);

    useEffect(() => {
        if (address) getCount();
    }, [address, getCount()]);

    return {
        count,
        getCount,
    };
};
