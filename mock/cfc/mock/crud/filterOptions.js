module.exports = function (req, res) {
  const ret = {
    status: 0,
    msg: '',
    data: {
      options: [
        {
            "label": "A",
            "value": "A"
        },
        {
            "label": "B",
            "value": "B"
        },
        {
            "label": "C",
            "value": "C"
        },
        {
            "label": "D",
            "value": "D"
        },
        {
            "label": "X",
            "value": "X"
        }
      ]
    }
  };

  res.json(ret);
};
