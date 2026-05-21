
import './styles/ProductCard.css';
import { useEffect, useState } from "react";
import QRCode from "qrcode";

type PixQrCodeProps = {
    payload: string;
};

export default function PixQrCode({ payload }: PixQrCodeProps) {
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [errorQr, setErrorQr] = useState("");

    if (!payload) {
        return <div className="pix-qr-code-error">Erro: Qr code não fornecido.</div>;
    }

    useEffect(() => {
        async function generateQRCode() {
            try {
                const url = await QRCode.toDataURL(payload);
                setQrCodeUrl(url);
            } catch (error) {
                setErrorQr(`Erro ao gerar QR Code. ${error}`);
            }
        }

        if (payload) {
            generateQRCode();
        }
    }, [payload]);


    return (
        <>
            {errorQr && <div className="pix-qr-code-error">{errorQr}</div>}
            {qrCodeUrl && (
                <img
                    src={qrCodeUrl}
                    alt="QR Code PIX"
                />
            )}
        </>
    );
}