import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { Line } from 'react-chartjs-2';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';
import { Link } from 'react-router-dom';


import './Estatisticas.css';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);

function Estatisticas() {
    const [dados, setDados] = useState({
        totalVotos: 0,
        votosPorHora: [],
        votosPorParticipante: {},
    });
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState({});

    const options = {
        scaleShowGridLines: true,
        scaleGridLineColor: 'rgba(0,0,0,.05)',
        scaleGridLineWidth: 1,
        scaleShowHorizontalLines: true,
        scaleShowVerticalLines: true,
        bezierCurve: true,
        bezierCurveTension: 0.4,
        pointDot: true,
        pointDotRadius: 4,
        pointDotStrokeWidth: 1,
        pointHitDetectionRadius: 20,
        datasetStroke: true,
        datasetStrokeWidth: 2,
        datasetFill: true,
        legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
    };

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3001');

        async function fetchData() {
            try {
                const resTotalVotos = await axios.get(`${baseUrl}/votes/total`);
                const resVotosPorHora = await axios.get(`${baseUrl}/votes/history`);

                const resVotosPorParticipanteA = await axios.get(`${baseUrl}/votes/participante/participanteA`);
                const resVotosPorParticipanteB = await axios.get(`${baseUrl}/votes/participante/participanteB`);

                const sortedData = resVotosPorHora.data.sort((a, b) => a._id.hour - b._id.hour);

                const resA = await axios.get(`${baseUrl}/votes/hourly/participanteA`);
                const resB = await axios.get(`${baseUrl}/votes/hourly/participanteB`);

                const dataA = resA.data.participanteA;
                const dataB = resB.data.participanteB;

                const labelsChart = Object.keys(dataA).map(hour => `${hour}:00`);
                const datasetA = Object.values(dataA);
                const datasetB = Object.values(dataB);

                const labels = sortedData.map(item => item._id.hour);
                const dataParticipanteA = sortedData
                    .filter(item => item._id.participante === 'participanteA')
                    .map(item => item.count);
                const dataParticipanteB = sortedData
                    .filter(item => item._id.participante === 'participanteB')
                    .map(item => item.count);

                setDados({
                    totalVotos: resTotalVotos.data.totalVotes, // Note a mudança aqui também
                    votosPorParticipante: {
                        participanteA: resVotosPorParticipanteA.data.participanteA,
                        participanteB: resVotosPorParticipanteB.data.participanteB
                    },
                    votosPorHoraLabels: labels,
                    votosPorHoraParticipanteA: dataParticipanteA,
                    votosPorHoraParticipanteB: dataParticipanteB,
                });

                setChartData({
                    labels: labelsChart,
                    datasets: [
                        {
                            label: 'Participante A',
                            data: datasetA,
                            borderColor: '#4f80e2',
                            fill: false,
                            tension: 0.2
                        },
                        {
                            label: 'Participante B',
                            data: datasetB,
                            borderColor: '#15cdca',
                            fill: false,
                            tension: 0.2
                        }
                    ]
                });
                setLoading(false);

                console.log(dados.votosPorHora.map(v => v.participanteA));
            } catch (error) {
                console.error("Erro ao buscar dados", error);
                setLoading(false);
            }
        }
        fetchData();

        socket.onopen = () => {
            console.log('WebSocket connection opened');
            socket.send('Hello from client');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'newVote') {
                setDados(prevDados => {
                    const updatedVotosPorParticipante = { ...prevDados.votosPorParticipante };
                    updatedVotosPorParticipante[data.participante]++;

                    return {
                        ...prevDados,
                        totalVotos: prevDados.totalVotos + 1,
                        votosPorParticipante: updatedVotosPorParticipante
                    };
                });
                fetchData();
            }
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            socket.close();
        };
    }, [dados]);


    const votosParticipanteA = dados.votosPorParticipante.participanteA;
    const votosParticipanteB = dados.votosPorParticipante.participanteB;
    const porcentParticipanteA = (votosParticipanteA / (votosParticipanteA + votosParticipanteB)) * 100;
    const porcentParticipanteB = (votosParticipanteB / (votosParticipanteA + votosParticipanteB)) * 100;

    return (
        <div className="estatisticas-container">
            {loading ? (
                <div className="spinner-container">
                    <ClipLoader color="#36A2EB" size={50} />
                </div>
            ) : (
                <>
                    <div className="d-flex flex-column align-items-center justify-content-center mb-5 pb-5" >
                        <header className="d-flex flex-row  align-items-center justify-content-between mb-5 w-100 px-5 mx-5">
                            <h2 className="estatisticas-title">Estatísticas de Votação</h2>
                            <Link to="/" className="btn-estatisticas float-end">
                                Vote aqui
                            </Link>
                        </header>

                        <div className="d-flex align-items-center justify-content-center py-5">


                            {/* Card Participante A */}
                            <div className="card mx-3">
                                <div className="card-body cardTotalA">
                                    <h5 className="card-title">Participante A</h5>
                                    <p className="card-text content-cardA">{votosParticipanteA}</p>
                                </div>
                            </div>

                            {/* Barra de Progresso Participante A */}

                            <div className="progress vertical">
                                <div className="progress-bar" role="progressbar" style={{ height: `${porcentParticipanteA}%`, backgroundColor: '#4f80e2' }} aria-valuenow={porcentParticipanteA} aria-valuemin="0" aria-valuemax="100">{porcentParticipanteA.toFixed(2)}%</div>
                            </div>


                            {/* Card Total de Votos */}
                            <div className="card mx-3" style={{ width: '400px' }}>
                                <div className="card-body cardTotal">
                                    <h5 className="card-title">Total de Votos</h5>
                                    <p className="card-text">{dados.totalVotos}</p>
                                </div>
                            </div>

                            {/* Barra de Progresso Participante B */}
                            <div className="progress vertical">
                                <div className="progress-bar" role="progressbar" style={{ height: `${porcentParticipanteB}%`, backgroundColor: '#15cdca' }} aria-valuenow={porcentParticipanteB} aria-valuemin="0" aria-valuemax="100">{porcentParticipanteB.toFixed(2)}%</div>
                            </div>


                            {/* Card Participante B */}
                            <div className="card mx-3">
                                <div className="card-body cardTotalB ">
                                    <h5 className="card-title">Participante B</h5>
                                    <p className="card-text">{votosParticipanteB}</p>
                                </div>
                            </div>

                        </div>



                        <Line data={chartData} options={options} />
                    </div>

                </>
            )}
        </div>
    );

}

export default Estatisticas;
