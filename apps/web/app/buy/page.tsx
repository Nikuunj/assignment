"use client";
import { Transak } from '@transak/transak-sdk';
import { useState, useEffect } from 'react';

enum Environments {
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
}

function BuyCreditsButton() {
     const [amount, setAmount] = useState<number>();
     const [flowStep, setFlowStep] = useState<"idle" | "akash" | "nosana">("idle");
     const [halfAmount, setHalfAmount] = useState<number>(0);
     const [userDetails, setUserDetails] = useState<{
          akashAddress: string;
          nosanaAddress: string;
          userEmail: string;
     } | null>(null);

     useEffect(() => {
          const handleWidgetClose = () => {
               console.log("Transak widget closed:", flowStep);

               if (flowStep === "akash" && userDetails) {
               const transakNosana = new Transak({
                    apiKey: 'ff42f37d-d475-499e-907a-997cda6f3c29',
                    environment: Environments.PRODUCTION,
                    fiatAmount: halfAmount,
                    cryptoCurrencyCode: 'NOS',
                    walletAddress: userDetails.nosanaAddress,
                    email: userDetails.userEmail,
                    themeColor: '000000',
                    redirectURL: '',
               });

               setFlowStep("nosana");
               transakNosana.init();
               } else if (flowStep === "nosana") {
               setFlowStep("idle");
               }
          };

          window.addEventListener("TRANSAK_WIDGET_CLOSE", handleWidgetClose);
          return () => {
               window.removeEventListener("TRANSAK_WIDGET_CLOSE", handleWidgetClose);
          };
     }, [flowStep, halfAmount, userDetails]);

     const handleBuy = () => {
          const akashAddress = localStorage.getItem('akashAddress') || 'akash1qr68cjrfrkrzsugjr3k8nthegjhwslepsvjfe6';
          const nosanaAddress = localStorage.getItem('nosanaAddress') || 'AYRcn91Sn23XbwDPb2Rgqe9rJhZQy8AJQbBfM9Yb8V9b';
          const userEmail = localStorage.getItem('email') || 'mnikunj449@gmail.com';

          if (!akashAddress || !nosanaAddress) {
               alert('Wallet addresses not found in localStorage');
               return;
          }

          if(!amount) {
               return;
          }
          const splitAmount = amount / 2;
          setHalfAmount(splitAmount);
          setUserDetails({ akashAddress, nosanaAddress, userEmail });

          const transakAkash = new Transak({
               apiKey: 'ff42f37d-d475-499e-907a-997cda6f3c29',
               environment: Environments.PRODUCTION,
               fiatAmount: splitAmount,
               cryptoCurrencyCode: 'AKT',
               walletAddress: akashAddress,
               email: userEmail,
               themeColor: '000000',
               redirectURL: '',
          });

          setFlowStep("akash");
          transakAkash.init();
     };

     return (
          <div className="flex flex-col gap-3 max-w-xs mx-auto h-screen justify-center">
               <input
               type="number"
               value={amount}
               onChange={(e) => setAmount(Number(e.target.value))}
               placeholder="Enter fiat amount"
               className="px-3 py-2 border rounded"
               />
               <button
               onClick={handleBuy}
               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
               >
               Buy Credits
               </button>
          </div>
     );
}

export default BuyCreditsButton;
