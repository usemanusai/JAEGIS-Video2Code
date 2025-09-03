import express from 'express';

const app = express();
app.use(express.json({ limit: '5mb' }));

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(8080, () => {
  console.log('AI Gateway listening on :8080');
});

