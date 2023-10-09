import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ParedaoVotacao.css';

import ParticipanteAImg from "../../assets/img/ParticipanteA.png";
import ParticipanteBImg from "../../assets/img/ParticipanteB.png";


function ParedaoVotacao() {
    const [voto, setVoto] = useState(null);
    const [totalVotos, setTotalVotos] = useState({ participanteA: 0, participanteB: 0 });
    // const [percentualA, setPercentualA] = useState(0);
    // const [percentualB, setPercentualB] = useState(0);

    // const recaptchaRef = useRef();

    function refreshPage() {
        window.location.reload();
    }

    const fetchVoteTotals = async () => {
        try {
            const resA = await axios.get('http://localhost:3001/votes/participante/participanteA');
            const resB = await axios.get('http://localhost:3001/votes/participante/participanteB');
            setTotalVotos({
                participanteA: resA.data.participanteA || 0,
                participanteB: resB.data.participanteB || 0,
            });
        } catch (error) {
            console.error('Erro ao buscar totais de votos:', error);
        }
    };


    const handleVote = async (participante) => {
        // const recaptchaValue = recaptchaRef.current.getValue();

        // if (!recaptchaValue) {
        //     console.error('Por favor, confirme que você não é um robô.');
        //     return;
        // }

        // const hasVoted = localStorage.getItem('hasVoted');
        // if (hasVoted) {
        //     console.error('Você já votou!');
        //     return;
        // }

        // const response = await axios.post('http://localhost:3001/vote', { participante }, {
        //     headers: {
        //         'x-has-voted': true
        //     }

        try {
            const response = await axios.post('http://localhost:3001/vote', { participante });
            console.log('response', response);
            localStorage.setItem('hasVoted', 'true');
            setVoto(participante);
            fetchVoteTotals();
        } catch (error) {
            console.error('Erro ao votar:', error);
        }
    }

    const participanteA = (totalVotos.participanteA / (totalVotos.participanteA + totalVotos.participanteB)) * 100;
    const participanteB = (totalVotos.participanteB / (totalVotos.participanteA + totalVotos.participanteB)) * 100;

    return (
        <div className="votacao-container">
            <h2>Votação Paredão BBB</h2>
            <h3>QUEM DEVE SER ELIMINADO?</h3>
            {/* <ReCAPTCHA ref={recaptchaRef} sitekey="6LfsK14oAAAAALOtP_K1iC6U29v0l09Y0TWUUo-J" /> */}
            {voto ? (
                <div>
                    <p>Obrigado por votar no {voto}!</p>
                    <img src={ParticipanteAImg} alt="A" sizes='300' />
                    <div className="progress">

                        <div className="bar" style={{ width: `${participanteA}%` }}></div>
                        <div className="label">Participante A: {participanteA.toFixed(2)}%</div>
                    </div>
                    <img src={ParticipanteBImg} alt="B" sizes='300' />
                    <div className="progress">
                        <div className="bar" style={{ width: `${participanteB}%` }}></div>
                        <div className="label">Participante B: {participanteB.toFixed(2)}%</div>
                    </div>
                    <Link onClick={refreshPage} className="btn-estatisticas">
                        Votar
                    </Link>
                </div>


            ) : (
                <div className="votacao-container d-flex justify-content-center align-items-center">
                    <button className="btn-votar" onClick={() => handleVote('participanteA')}><img src={ParticipanteAImg} alt="A" sizes='300' /></button>
                    <button className="btn-votar" onClick={() => handleVote('participanteB')}><img src={ParticipanteBImg} alt="B" sizes='300' /></button>
                </div>
            )}
            <Link to="/estatisticas" className="btn-estatisticas">
                Ver Estatísticas
            </Link>

        </div>
    );
}

export default ParedaoVotacao;
