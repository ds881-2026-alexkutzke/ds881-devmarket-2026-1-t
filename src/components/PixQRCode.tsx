
import './styles/ProductCard.css';
import { useEffect, useState } from "react";
import QRCode from "qrcode";

type PixQrCodeProps = {
    payload: string;
};

export default function PixQrCode({ payload }: PixQrCodeProps) {
    const [qrCodeUrl, setQrCodeUrl] = useState("");

    if (!payload) {
        return <div className="pix-qr-code-error">Erro: Qr code não fornecido.</div>;
    }

    useEffect(() => {
        async function generateQRCode() {
            try {
                const url = await QRCode.toDataURL(payload);
                setQrCodeUrl(url);
            } catch (error) {
                console.error("Erro ao gerar QR Code:", error);
            }
        }

        if (payload) {
            generateQRCode();
        }
    }, [payload]);


    return (
        <img
            src={qrCodeUrl}
            alt="QR Code PIX"
        />
    );
}