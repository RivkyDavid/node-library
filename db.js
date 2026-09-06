const books =[
    {
        code:1,
        name:"dam kar",
        category: "metach",
        price: 80,
        isBorrowed: true,
        loans: [
        { loanDate: "2026-06-01", customerCode: 101 },
        { loanDate: "2026-05-15", customerCode: 105 }
        ]
    },
    {
        code:2,
        name:"paga ubarach",
        category: "regesh",
        price: 70,
        isBorrowed: true,
        loans: [
        {loanDate: "2026-06-05", customerCode: 103}
        ]
    },
    {
    code: 3,
    name: "geto varsha",
    category: "history",
    price: 105,
    isBorrowed: false,
    loans: []
  }
]

export default books;