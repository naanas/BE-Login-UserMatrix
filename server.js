const express = require('express');
const app = express();

const port = process.env.PORT || 5000;


// Root route
app.get('/', (req, res) => {
  res.send(
    "jancuk tenan"
  );
});

app.listen(port, () => {
    `Server is running on port ${port}`;
    });