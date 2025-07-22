"use client"
import Button from "@repo/ui/Button";
import { useEffect, useState } from "react";
import { getAkashBalance, getNosanaBalance } from "../function/getBalance";


export default function Page() {

    const [akashBalance, setAkashBalance] = useState<number | null>(null);
    const [nosanaBalance, setNosanaBalance] = useState<number | null>(null);

    useEffect(() => {
        const akashAddress = localStorage.getItem("akashAddress") ?? 'default';
        const nosanaAddress = localStorage.getItem("nosanaAddress") ?? 'default';

        if (akashAddress) {
            getAkashBalance(akashAddress).then(setAkashBalance);
        }
        
        if (nosanaAddress) {
            getNosanaBalance(nosanaAddress).then(setNosanaBalance);
        }
    }, []);
    

    return (
        <div className="relative min-h-screen p-4">
            <div className="absolute top-4 right-4 bg-white shadow-lg rounded-md p-3 text-sm space-y-1 z-10">
            {akashBalance !== null && (
                <div>
                <strong>Akash:</strong> {akashBalance.toFixed(4)} AKT
                </div>
            )}
            {nosanaBalance !== null && (
                <div>
                <strong>Nosana:</strong> {nosanaBalance.toFixed(4)} NOS
                </div>
            )}
            </div>
        </div>
    );
}
