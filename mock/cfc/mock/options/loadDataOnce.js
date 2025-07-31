/** 前端分页的接口 */
module.exports = function (req, res) {
  res.json({
    status: 0,
    msg: 'ok',
    data: {
      count: data.length,
      items: data
    }
  });
};

const data = [
  {
    "label": "Laura Lewis",
    "value": "1"
  },
  {
    "label": "David Gonzalez",
    "value": "2"
  },
  {
    "label": "Christopher Rodriguez",
    "value": "3"
  },
  {
    "label": "Sarah Young",
    "value": "4"
  },
  {
    "label": "James Jones",
    "value": "5"
  },
  {
    "label": "Larry Robinson",
    "value": "6"
  },
  {
    "label": "Christopher Perez",
    "value": "7"
  },
  {
    "label": "Sharon Davis",
    "value": "8"
  },
  {
    "label": "Kenneth Anderson",
    "value": "9"
  },
  {
    "label": "Deborah Lewis",
    "value": "10"
  },
  {
    "label": "Jennifer Lewis",
    "value": "11"
  },
  {
    "label": "Laura Miller",
    "value": "12"
  },
  {
    "label": "Larry Harris",
    "value": "13"
  },
  {
    "label": "Patricia Robinson",
    "value": "14"
  },
  {
    "label": "Mark Davis",
    "value": "15"
  },
  {
    "label": "Jessica Harris",
    "value": "16"
  },
  {
    "label": "Anna Brown",
    "value": "17"
  },
  {
    "label": "Lisa Young",
    "value": "18"
  },
  {
    "label": "Donna Williams",
    "value": "19"
  },
  {
    "label": "Shirley Davis",
    "value": "20"
  },
  {
    "label": "Richard Clark",
    "value": "21"
  },
  {
    "label": "Cynthia Martinez",
    "value": "22"
  },
  {
    "label": "Kimberly Walker",
    "value": "23"
  },
  {
    "label": "Timothy Anderson",
    "value": "24"
  },
  {
    "label": "Betty Lee",
    "value": "25"
  },
  {
    "label": "Jeffrey Allen",
    "value": "26"
  },
  {
    "label": "Karen Martinez",
    "value": "27"
  },
  {
    "label": "Anna Lopez",
    "value": "28"
  },
  {
    "label": "Dorothy Anderson",
    "value": "29"
  },
  {
    "label": "David Perez",
    "value": "30"
  },
  {
    "label": "Dorothy Martin",
    "value": "31"
  },
  {
    "label": "George Johnson",
    "value": "32"
  },
  {
    "label": "Donald Jackson",
    "value": "33"
  },
  {
    "label": "Mary Brown",
    "value": "34"
  },
  {
    "label": "Deborah Martinez",
    "value": "35"
  },
  {
    "label": "Donald Jackson",
    "value": "36"
  },
  {
    "label": "Lisa Robinson",
    "value": "37"
  },
  {
    "label": "Laura Martinez",
    "value": "38"
  },
  {
    "label": "Timothy Taylor",
    "value": "39"
  },
  {
    "label": "Joseph Martinez",
    "value": "40"
  },
  {
    "label": "Karen Wilson",
    "value": "41"
  },
  {
    "label": "Karen Walker",
    "value": "42"
  },
  {
    "label": "William Martinez",
    "value": "43"
  },
  {
    "label": "Linda Brown",
    "value": "44"
  },
  {
    "label": "Elizabeth Brown",
    "value": "45"
  },
  {
    "label": "Anna Moore",
    "value": "46"
  },
  {
    "label": "Robert Martinez",
    "value": "47"
  },
  {
    "label": "Edward Hernandez",
    "value": "48"
  },
  {
    "label": "Elizabeth Hall",
    "value": "49"
  },
  {
    "label": "Linda Jackson",
    "value": "50"
  },
  {
    "label": "Brian Jones",
    "value": "51"
  },
  {
    "label": "Amy Thompson",
    "value": "52"
  },
  {
    "label": "Kimberly Wilson",
    "value": "53"
  },
  {
    "label": "Nancy Garcia",
    "value": "54"
  },
  {
    "label": "Mary Thompson",
    "value": "55"
  }
].map(function (item, index) {
  return Object.assign({}, item, {
    id: index + 1
  });
});
