const express = require('express');
const router = express.Router();

const tatuadores = [
  { nome: "André", estilos: ["Old School", "Minimalista"] },
  { nome: "Bruna", estilos: ["Realismo", "Pontilhismo"] }
];

router.get('/', (req, res) => {
  res.json(tatuadores);
});

module.exports = router;
