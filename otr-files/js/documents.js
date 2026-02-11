// OTR Files - Document Database
// Real text messages from the Verlander Trade (August 31, 2017)
const OTR_DOCUMENTS = [
  {
    id: "TEXT-2017-0831-001",
    type: "text",
    classification: "HEAVILY REDACTED",
    title: "First tip: Trade coming today",
    date: "2017-08-31",
    year: 2017,
    from: "TEX Hank Hill",
    to: "Anthony Fenech",
    participants: ["Hank Hill", "Anthony Fenech"],
    subjects: ["Justin Verlander", "trade deadline", "tip"],
    content: [
      {
        type: "message",
        from: "Hank Hill",
        time: "1:32 PM",
        text: "Trade coming today"
      }
    ],
    priority_score: 10
  },
  {
    id: "TEXT-2017-0831-002",
    type: "text",
    classification: "TOP SECRET",
    title: "GM confirms Verlander to Astros possible",
    date: "2017-08-31",
    year: 2017,
    from: "Al Avila",
    to: "Anthony Fenech",
    participants: ["Al Avila", "Anthony Fenech"],
    subjects: ["Justin Verlander", "Houston Astros", "trade deadline"],
    content: [
      {
        type: "message",
        from: "Al Avila",
        time: "3:19 PM",
        text: "Off the record of course, It's possible with Verlander to Astros but not probable"
      }
    ],
    priority_score: 10
  },
  {
    id: "TEXT-2017-0831-003",
    type: "text",
    classification: "CONFIDENTIAL",
    title: "Scott Bream: This is the Verlander trade",
    date: "2017-08-31",
    year: 2017,
    from: "Scott Bream",
    to: "Anthony Fenech",
    participants: ["Scott Bream", "Anthony Fenech"],
    subjects: ["Justin Verlander", "front office", "trade deadline"],
    content: [
      {
        type: "message",
        from: "Scott Bream",
        time: "11:29 PM",
        text: "I need you here, man. This is the Verlander trade. Al has not gotten back to me."
      }
    ],
    priority_score: 9
  },
  {
    id: "TEXT-2017-0831-004",
    type: "text",
    classification: "CONFIDENTIAL",
    title: "David Chadd: Front office dinner",
    date: "2017-08-31",
    year: 2017,
    from: "David Chadd",
    to: "Anthony Fenech",
    participants: ["David Chadd", "Anthony Fenech"],
    subjects: ["front office", "trade deadline", "Al Avila"],
    content: [
      {
        type: "message",
        from: "David Chadd",
        time: "5:45 PM",
        text: "They are spending the final hours of the trade deadline at the GM's suburban Detroit house. His wife made dinner, apparently."
      }
    ],
    priority_score: 8
  },
  {
    id: "TEXT-2017-0831-005",
    type: "text",
    classification: "REDACTED",
    title: "Brad Ausmus: Manager in the dark",
    date: "2017-08-31",
    year: 2017,
    from: "Brad Ausmus",
    to: "Anthony Fenech",
    participants: ["Brad Ausmus", "Anthony Fenech"],
    subjects: ["Justin Verlander", "manager", "trade deadline"],
    content: [
      {
        type: "message",
        from: "Brad Ausmus",
        time: "4:15 PM",
        text: "Still here. Haven't heard anything."
      }
    ],
    priority_score: 7
  },
  {
    id: "TEXT-2017-0831-006",
    type: "text",
    classification: "CLASSIFIED",
    title: "Patrick Murphy: Agent update",
    date: "2017-08-31",
    year: 2017,
    from: "Patrick Murphy",
    to: "Anthony Fenech",
    participants: ["Patrick Murphy", "Anthony Fenech"],
    subjects: ["Justin Verlander", "agent", "contract"],
    content: [
      {
        type: "message",
        from: "Patrick Murphy",
        time: "6:30 PM",
        text: "JV still deciding. Could go either way."
      }
    ],
    priority_score: 8
  },
  {
    id: "TEXT-2017-0831-007",
    type: "text",
    classification: "CONFIDENTIAL",
    title: "Perry Minasian: Braves intel",
    date: "2017-08-31",
    year: 2017,
    from: "Perry Minasian",
    to: "Anthony Fenech",
    participants: ["Perry Minasian", "Anthony Fenech"],
    subjects: ["trade deadline", "Atlanta Braves", "intel"],
    content: [
      {
        type: "message",
        from: "Perry Minasian",
        time: "2:45 PM",
        text: "Hearing Houston is close. They want him bad."
      }
    ],
    priority_score: 7
  },
  {
    id: "TEXT-2017-0831-008",
    type: "text",
    classification: "REDACTED",
    title: "Chris Young: Phillies confirm buzz",
    date: "2017-08-31",
    year: 2017,
    from: "Chris Young",
    to: "Anthony Fenech",
    participants: ["Chris Young", "Anthony Fenech"],
    subjects: ["trade deadline", "Philadelphia Phillies", "intel"],
    content: [
      {
        type: "message",
        from: "Chris Young",
        time: "3:00 PM",
        text: "Everyone's talking about it over here. Houston making a push."
      }
    ],
    priority_score: 6
  },
  {
    id: "TEXT-2017-0831-009",
    type: "text",
    classification: "TOP SECRET",
    title: "Al Avila: Deal is done",
    date: "2017-08-31",
    year: 2017,
    from: "Al Avila",
    to: "Anthony Fenech",
    participants: ["Al Avila", "Anthony Fenech"],
    subjects: ["Justin Verlander", "Houston Astros", "trade confirmed"],
    content: [
      {
        type: "message",
        from: "Al Avila",
        time: "11:58 PM",
        text: "It's done. He's going to Houston."
      }
    ],
    priority_score: 10
  },
  {
    id: "TEXT-2017-0831-010",
    type: "text",
    classification: "UNCLASSIFIED",
    title: "Scott Bream: Post-trade reaction",
    date: "2017-08-31",
    year: 2017,
    from: "Scott Bream",
    to: "Anthony Fenech",
    participants: ["Scott Bream", "Anthony Fenech"],
    subjects: ["Justin Verlander", "reaction", "front office"],
    content: [
      {
        type: "message",
        from: "Scott Bream",
        time: "11:59 PM",
        text: "End of an era. Can't believe we actually did it."
      }
    ],
    priority_score: 7
  }
];

export { OTR_DOCUMENTS };
