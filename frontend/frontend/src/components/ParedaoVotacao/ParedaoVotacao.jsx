import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ParedaoVotacao.css';
import ReCAPTCHA from "react-google-recaptcha";
import ParticipanteAImg from "../../assets/img/ParticipanteA.png";
import ParticipanteBImg from "../../assets/img/ParticipanteB.png";
const baseUrl = process.env.REACT_APP_BASE_URL;
const secretKey = process.env.REACT_APP_SECRET_KEY;




function ParedaoVotacao() {
    const [voto, setVoto] = useState(null);
    const [totalVotos, setTotalVotos] = useState({ participanteA: 0, participanteB: 0 });
    const recaptchaRef = useRef();
    const [selectedVote, setSelectedVote] = useState(null);

    const selectVote = (participante) => {
        setSelectedVote(participante);
    };

    const confirmVote = () => {
        if (selectedVote) {
            handleVote(selectedVote);
            setSelectedVote(null); // Reset selected vote after confirmation
        } else {
            alert('Por favor, selecione um participante antes de confirmar seu voto.');
        }
    };


    useEffect(() => {
        fetchVoteTotals();
    }, []);

    const refreshPage = () => {
        window.location.reload();
    }

    const fetchVoteTotals = async () => {
        try {
            const { data: resA } = await axios.get(`${baseUrl}/votes/participante/participanteA`);
            const { data: resB } = await axios.get(`${baseUrl}/votes/participante/participanteB`);
            setTotalVotos({
                participanteA: resA.participanteA || 0,
                participanteB: resB.participanteB || 0,
            });
        } catch (error) {
            console.error('Erro ao buscar totais de votos:', error);
        }
    };

    const handleVote = async (participante) => {
        const recaptchaValue = recaptchaRef.current.getValue();

        if (!recaptchaValue) {
            alert('Por favor, confirme que você não é um robô.');
            return;
        }

        try {
            await axios.post(`${baseUrl}/vote`, { participante });
            localStorage.setItem('hasVoted', 'true');
            setVoto(participante);
            fetchVoteTotals();

            recaptchaRef.current.reset();
        } catch (error) {
            console.error('Erro ao votar:', error);
        }
    };


    const getPercentage = (participanteVotes) => {
        const total = totalVotos.participanteA + totalVotos.participanteB;
        if (total === 0) return 0;  // Avoid division by zero
        return (participanteVotes / total) * 100;
    };

    const participanteAPercentage = getPercentage(totalVotos.participanteA);
    const participanteBPercentage = getPercentage(totalVotos.participanteB);


    return (
        <div className="votacao-container">

            {voto ? (
                <div>
                    <h4>Obrigado por votar no {voto}!</h4>
                    <img src={ParticipanteAImg} alt="A" sizes='300' />
                    <div className="progress">

                        <div className="bar" style={{ width: `${participanteAPercentage}%` }}></div>
                        <div className="label">Participante A: {participanteAPercentage.toFixed(2)}%</div>
                    </div>
                    <img src={ParticipanteBImg} alt="B" sizes='300' />
                    <div className="progress">
                        <div className="bar" style={{ width: `${participanteBPercentage}%` }}></div>
                        <div className="label">Participante B: {participanteBPercentage.toFixed(2)}%</div>
                    </div>
                    <Link onClick={refreshPage} className="btn-confirm-vote">
                        Votar
                    </Link>
                </div>
            ) : (
                <>
                    <h2>Votação Paredão BBB</h2>
                    <h3>QUEM DEVE SER ELIMINADO?</h3>

                    <div className="votacao-container d-flex justify-content-center align-items-center">
                        {/* Aqui, ao clicar na imagem, apenas selecionamos o voto. */}
                        <button className={`btn-votar ${selectedVote === 'participanteA' ? 'selected' : ''}`} onClick={() => selectVote('participanteA')}><img src={ParticipanteAImg} alt="A" sizes='300' /></button>
                        <button className={`btn-votar ${selectedVote === 'participanteB' ? 'selected' : ''}`} onClick={() => selectVote('participanteB')}><img src={ParticipanteBImg} alt="B" sizes='300' /></button>
                    </div>
                    <div className="d-flex justify-content-center align-items-center mt-3">
                        <ReCAPTCHA ref={recaptchaRef} sitekey={secretKey} />
                    </div>
                    <div className="d-flex justify-content-center align-items-center mt-2">
                        <button className="btn-confirm-vote" onClick={confirmVote}>Enviar meu voto</button>
                    </div>
                </>

            )}
            <Link to="/estatisticas" target="_blank" className="btn-estatisticas">
                Ver Estatísticas
            </Link>

        </div>
    );
}

export default ParedaoVotacao;
