module.exports = function (req, res) {
  let repeat = 2 + Math.round(Math.random() * 5);
  let options = [];

  if (req.query.parentId) {
    while (repeat--) {
      const value = Math.round(Math.random() * 1000000);
      const label = value + "";

      options.push({
        label: label,
        to: `?cat=${value}`,
        value: `${value}`,
        defer: Math.random() > 0.7,
      });
    }
  } else {
    options = [
      {
        label: "Nav 1",
        to: "?cat=1",
        value: "1",
        icon: "fa fa-user",
      },
      {
        label: "Nav 2",
        unfolded: true,
        children: [
          {
            label: "Nav 2-1",
            children: [
              {
                label: "Nav 2-1-1",
                to: "?cat=2-1",
                value: "2-1",
              },
            ],
          },
          {
            label: "Nav 2-2",
            to: "?cat=2-2",
            value: "2-2",
          },
        ],
      },
      {
        label: "Nav 3",
        to: "?cat=3",
        value: "3",
        defer: true,
      },
    ];
  }

  res.json({
    status: 0,
    msg: "",
    data: {
      links: options,
      value: req.query.parentId ? undefined : "?cat=1",
    },
  });
};
