import { Button } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  SystemProgram,
  Transaction,
  TransactionSignature,
} from "@solana/web3.js";
import { FC, ReactNode, useCallback } from "react";

type Props = {
  amount: number
  // children: ReactNode
}

// import { useNotify } from "./notify";

export const SendTransaction: FC<Props> = ({amount}) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  //   const notify = useNotify();

  const onClick = useCallback(async () => {
    if (!publicKey) {
      //   notify("error", "Wallet not connected!");
      return;
    }

    let signature: TransactionSignature = "";
    let swapAmount : number = amount;
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: Keypair.generate().publicKey,
          lamports: amount,      
        },)
      );

      signature = await sendTransaction(transaction, connection);
      //   notify("info", "Transaction sent:", signature);

      await connection.confirmTransaction(signature, "processed");
      //   notify("success", "Transaction successful!", signature);
    } catch (error: any) {
      //   notify("error", `Transaction failed! ${error?.message}`, signature);
      return;
    }
  }, [publicKey, connection, sendTransaction]);

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={onClick}
      disabled={!publicKey}
    >
      Send Transaction
    </Button>
  );
};
