const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Asegúrate de que la carpeta 'FotosCapturadas' existe
const fotosDir = path.join(__dirname, 'FotosCapturadas');
if (!fs.existsSync(fotosDir)){
    fs.mkdirSync(fotosDir);
}

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

app.post('/guardar_direccion', (req, res) => {
    const direccion = req.body.direccion;
    const filePath = path.join(__dirname, 'direccion.txt');

    // Añadir la dirección al archivo en lugar de sobrescribirlo
    fs.appendFile(filePath, direccion + '\n', (err) => {
        if (err) {
            console.error('Error al guardar la dirección:', err);
            res.status(500).send('Error al guardar la dirección');
        } else {
            res.send('Dirección guardada correctamente');
        }
    });
});

app.post('/guardar_foto', (req, res) => {
    const imgData = req.body.image;
    const base64Data = imgData.replace(/^data:image\/png;base64,/, "");
    const filePath = path.join(fotosDir, `foto_${Date.now()}.png`);

    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('Error al guardar la foto:', err);
            res.status(500).send('Error al guardar la foto');
        } else {
            res.send('Foto guardada correctamente');
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
