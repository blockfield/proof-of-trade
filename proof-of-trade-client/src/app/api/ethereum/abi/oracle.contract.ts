import { ContractInterface } from "./contract.interface";

export let oracleContract: ContractInterface = {
    address: '0x0Be00A19538Fac4BE07AC360C69378B870c412BF',
    abi: [
        {
            "constant": true,
            "inputs": [],
            "name": "currentAnswer",
            "outputs": [{"name": "", "type": "int256"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
    ]
}