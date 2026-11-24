// ♥ EVERYTHING YOU MIGHT WANT TO CHANGE IS IN THIS FILE ♥
// Edit the words between the quotes, save, refresh the page.
window.LOVE = {
  herName: "my cutieee baby", // reads as "For my cutieee baby"
  yourName: "Subham",              // signs the letter, e.g. "Yours, Alex". Leave "" to sign "Yours, always"
  togetherSince: "",         // e.g. "2024-02-14" shows a live count of your days together
  photos: [                  // put pictures in this folder, then list them, e.g.
    // { file: "us1.jpg", caption: "our first trip" },
  ],

  // One note hides inside each of the 13 flowers
  notes: [
    "Your smile is my favourite thing to be the reason for.",
    "Every ordinary day gets better the moment you text me.",
    "You are the first person I want to tell everything to.",
    "I still get butterflies. Every single time.",
    "Your laugh should be a song. I would play it on repeat.",
    "Home stopped being a place. It's you now.",
    "Even when you're annoyed at me, you're adorable. Sorry.",
    "You make me want to be kinder, braver, better.",
    "I would choose you again. In every version of this life.",
    "You're beautiful on the days you don't feel it too.",
    "Thank you for being so patient with my silly heart.",
    "Real flowers fade. So I made you ones that can't.",
    "You found the last kind of love I'll ever look for."
  ],

  // type: "choice" | "slider" | "text" | "forever"
  questions: [
    { type: "choice", ask: "Did the flowers make you smile?",
      options: [["Yes, a lot", "Then my whole job today is done."],
                ["Maybe a little", "A little? I can see you blushing from here."],
                ["I'm still smiling", "Stay just like that. It suits you so much."]] },
    { type: "slider", ask: "How much do you love me?" },
    { type: "choice", ask: "What should our next date be?", keep: "Our next date",
      options: [["Long drive, loud music", "You pick the songs. I'll sing them badly."],
                ["Candlelight dinner", "I'll dress up. I'll still only look at you."],
                ["Movie and cuddles", "I already know I won't watch the movie."],
                ["Sunset and ice cream", "Two spoons. One blanket. Deal."]] },
    { type: "choice", ask: "When you miss me, what should I do?", keep: "When you miss me",
      options: [["Call me right away", "Pick up on the first ring, okay?"],
                ["Come and hug me", "Already putting my shoes on."],
                ["Send a goofy selfie", "You asked for this. Remember that."]] },
    { type: "text", ask: "What's one thing you want us to do together someday?", keep: "Someday, together",
      placeholder: "Watch the snow fall, get a puppy…", reply: "Okay. It's a promise now." },
    { type: "forever", ask: "Last one. Will you be mine, forever?", reply: "Forever it is. No take-backs." }
  ],

  letter: [
    "I wanted to give you something you could keep. Something that wouldn't wilt in a week or get lost in a drawer.",
    "So here it is: a small pink corner of the world that exists only because you do.",
    "I love how you care about tiny things. I love how you make quiet moments feel full. I love that being with you feels like finally exhaling.",
    "I may not always find the right words. But if you ever wonder how I feel, come back here and tap the flower again. The answer will be the same every time.",
    "I love you. More than yesterday, and still not as much as tomorrow."
  ]
};
