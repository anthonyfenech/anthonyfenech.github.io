// OTR Files - Document Database
const OTR_DOCUMENTS = [
  {
    id: "TEXT-2017-0831-001",
    type: "text",
    classification: "HEAVILY REDACTED",
    title: "Verlander trade tip from GM",
    date: "2017-08-31",
    year: 2017,
    from: "Al Avila",
    to: "Anthony Fenech",
    participants: ["Al Avila", "Anthony Fenech"],
    subjects: ["Justin Verlander", "trade deadline", "Houston Astros"],
    content: [
      {
        type: "message",
        from: "Al Avila",
        time: "2:30 PM",
        text: "Trade happening today. Verlander to Houston."
      }
    ],
    priority_score: 10
  },
  {
    id: "TEXT-2017-0831-002",
    type: "text",
    classification: "CONFIDENTIAL",
    title: "Deep Throat confirms front office activity",
    date: "2017-08-31",
    year: 2017,
    from: "Deep Throat",
    to: "Anthony Fenech",
    participants: ["Deep Throat", "Anthony Fenech"],
    subjects: ["trade deadline", "front office"],
    content: [
      {
        type: "message",
        from: "Deep Throat",
        time: "5:45 PM",
        text: "They are spending the final hours of the trade deadline at the GM's suburban Detroit house. His wife made dinner, apparently."
      }
    ],
    priority_score: 8
  },
  {
    id: "TEXT-2019-0821-001",
    type: "text",
    classification: "UNCLASSIFIED",
    title: "AIRPLANE MODE — Mom",
    date: "2019-08-21",
    year: 2019,
    from: "Mom",
    to: "Anthony Fenech",
    participants: ["Mom", "Anthony Fenech"],
    subjects: ["Houston Astros", "support"],
    content: [
      {
        type: "message",
        from: "Mom",
        time: "10:15 PM",
        text: "Woohoo best game Tigers could win---against Houston!!!!"
      }
    ],
    priority_score: 5
  },
  {
    id: "TEXT-2019-0821-002",
    type: "text",
    classification: "CONFIDENTIAL",
    title: "AIRPLANE MODE — Pedro Gomez",
    date: "2019-08-21",
    year: 2019,
    from: "Pedro Gomez",
    to: "Anthony Fenech",
    participants: ["Pedro Gomez", "Anthony Fenech"],
    subjects: ["clubhouse access", "press freedom"],
    content: [
      {
        type: "message",
        from: "Pedro Gomez",
        time: "11:30 PM",
        text: "This is such a scary moment. It allows every club to say they can keep whoever they want out of their clubhouse. This is why this is an important matter. You're not wrong here. Remember that."
      }
    ],
    priority_score: 9
  },
  {
    id: "TEXT-2019-0821-003",
    type: "text",
    classification: "REDACTED",
    title: "AIRPLANE MODE — Drug Dealer",
    date: "2019-08-21",
    year: 2019,
    from: "Drug Dealer",
    to: "Anthony Fenech",
    participants: ["Drug Dealer", "Anthony Fenech"],
    subjects: ["support"],
    content: [
      {
        type: "message",
        from: "Drug Dealer",
        time: "11:45 PM",
        text: "Lmk if anyone tries to mess with you."
      }
    ],
    priority_score: 6
  },
  {
    id: "TEXT-2019-0821-004",
    type: "text",
    classification: "CONFIDENTIAL",
    title: "AIRPLANE MODE — Deep Throat",
    date: "2019-08-21",
    year: 2019,
    from: "Deep Throat",
    to: "Anthony Fenech",
    participants: ["Deep Throat", "Anthony Fenech"],
    subjects: ["media attention"],
    content: [
      {
        type: "message",
        from: "Deep Throat",
        time: "11:50 PM",
        text: "I'd say you're the most popular sports writer in America today."
      }
    ],
    priority_score: 7
  },
  {
    id: "TEXT-2019-0821-005",
    type: "text",
    classification: "UNCLASSIFIED",
    title: "AIRPLANE MODE — Orioles Scout",
    date: "2019-08-21",
    year: 2019,
    from: "Orioles Scout",
    to: "Anthony Fenech",
    participants: ["Orioles Scout", "Anthony Fenech"],
    subjects: ["ESPN", "media coverage"],
    content: [
      {
        type: "message",
        from: "Orioles Scout",
        time: "11:55 PM",
        text: "Just read your name in ESPN. That's great. Getting your name out there!"
      }
    ],
    priority_score: 4
  },
  {
    id: "EMAIL-2019-0822-001",
    type: "email",
    classification: "OFFICIAL",
    title: "Astros official statement",
    date: "2019-08-22",
    year: 2019,
    from: "Houston Astros PR",
    to: "Media",
    participants: ["Houston Astros PR", "Media"],
    subjects: ["clubhouse access", "official statement"],
    content: [
      {
        type: "message",
        from: "Houston Astros PR",
        time: "9:00 AM",
        text: "Reporter Anthony Fenech was delayed temporarily from entering the Astros clubhouse following last night's game."
      }
    ],
    priority_score: 8
  },
  {
    id: "TWEET-2019-0822-001",
    type: "tweet",
    classification: "PUBLIC",
    title: "Verlander's 'unethical' tweet",
    date: "2019-08-22",
    year: 2019,
    from: "@JustinVerlander",
    to: "Public",
    participants: ["Justin Verlander"],
    subjects: ["unethical", "Free Press", "clubhouse"],
    content: [
      {
        type: "message",
        from: "@JustinVerlander",
        time: "10:15 AM",
        text: "I declined to speak with the @Freep rep last night because of his unethical behavior in the past."
      }
    ],
    priority_score: 10
  },
  {
    id: "TEXT-2019-0822-002",
    type: "text",
    classification: "PERSONAL",
    title: "Kristie Ackert check-in",
    date: "2019-08-22",
    year: 2019,
    from: "Kristie Ackert",
    to: "Anthony Fenech",
    participants: ["Kristie Ackert", "Anthony Fenech"],
    subjects: ["support", "concern"],
    content: [
      {
        type: "message",
        from: "Kristie Ackert",
        time: "8:00 PM",
        text: "Text me tonight just to let me know you are ok. We are concerned."
      }
    ],
    priority_score: 7
  }
];

export { OTR_DOCUMENTS };
