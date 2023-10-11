const Vote = require('../models/vote');
const WebSocket = require('ws'); 
module.exports = function(wss) {

    return {

        getTotalVotes: async (req, res) => {
            try {
                const totalVotes = await Vote.countDocuments();
                return res.json({ totalVotes });
            } catch (error) {
                return res.status(500).json({ message: 'Erro ao obter o total de votos.' });
            }
        },

        getVotesByParticipant: async (req, res) => {
            const name = req.params.name;
            try {
                const total = await Vote.countDocuments({ participante: name });
                if (total !== undefined) {
                    return res.json({ [name]: total });
                } else {
                    return res.status(404).json({ message: 'Participante não encontrado.' });
                }
            } catch (error) {
                return res.status(500).json({ message: 'Erro ao obter votos para o participante.' });
            }
        },

        postVote: async (req, res) => {
            const { participante } = req.body;
            const hour = new Date().getHours();
            const vote = new Vote({ participante, hour });
            
            try {
                await vote.save();
                
                req.wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ participante }));
                    }
                });
                
                return res.json({ success: true });
            } catch (err) {
                console.error("Erro detalhado:", err.message, err.stack);
                return res.status(500).json({ success: false, message: 'Erro ao salvar voto.' });
            }
        },

        getHourlyVotes: async (req, res) => {
            const name = req.params.name;
            try {
                const hourlyVotes = await Vote.aggregate([
                    { $match: { participante: name } },
                    { $group: { _id: "$hour", count: { $sum: 1 } } },
                    { $sort: { _id: 1 } }
                ]);

                const formattedHourlyVotes = hourlyVotes.reduce((acc, vote) => {
                    acc[vote._id] = vote.count;
                    return acc;
                }, {});

                return res.json({ [name]: formattedHourlyVotes });
            } catch (error) {
                return res.status(500).json({ message: 'Erro ao obter votos por hora.' });
            }
        },

        getVotesHistory: async (req, res) => {
            try {
                const history = await Vote.aggregate([
                    {
                        $group: {
                            _id: { hour: "$hour", participante: "$participante" },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort: { "_id.hour": 1 }
                    }
                ]);

                return res.json(history);
            } catch (error) {
                return res.status(500).json({ message: 'Erro ao obter histórico de votos.' });
            }
        }

    };
};
