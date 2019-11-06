let d = new Date();

export default {
  months: [
    {name: 'January', value: 1},
    {name: 'February', value: 2},
    {name: 'March', value: 3},
    {name: 'April', value: 4},
    {name: 'May', value: 5},
    {name: 'June', value: 6},
    {name: 'July', value: 7},
    {name: 'August', value: 8},
    {name: 'September', value: 9},
    {name: 'October', value: 10},
    {name: 'November', value: 11},
    {name: 'December', value: 12},
  ],
  years: [
    {name: d.getFullYear(), value: d.getFullYear()},
    {name: d.getFullYear()+1, value: d.getFullYear()+1},
    {name: d.getFullYear()+2, value: d.getFullYear()+2},
    {name: d.getFullYear()+3, value: d.getFullYear()+3},
    {name: d.getFullYear()+4, value: d.getFullYear()+4},
    {name: d.getFullYear()+5, value: d.getFullYear()+5}
  ]
}
