import {
  faCamera,
  faClock,
  faCloudBolt,
  faCode,
  faDownload,
  faEye,
  faHeart,
  faHome,
  faKey,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

const generalCopy = {
  about: {
    shoulder:
      "Join the ultimate fantasy cricket experience, tailored for true fans of the game.",
    heading: "Tailored for true fans of the game",
    description:
      "Our app revolutionizes fantasy cricket with a unique draft system. The snake draft system ensures each player is exclusive to a team. Compete with up to 8 teams in your contest, with a squad of 15 players, with your best XI delivering the points. Our app scoring system has been designed to revamp the age-old fantasy scoring system to provide a new, improved fantasy scoring system.",
  },
  features: {
    shoulder:
      "Unleash the power of a competitive fantasy cricket contest. Built for serious players.",
  },
  testimonials: {
    shoulder:
      "Hear from fantasy cricket champions who have played and won big with us.",
  },
  faq: {
    shoulder:
      "Get answers to your questions and make the most of your fantasy cricket experience.",
  },
  contact: {
    shoulder: "Reach out to us with any questions, feedback, or support needs.",
  },
};

const details = [
  {
    mainText: "1,020",
    subText: "Active Contests",
    icon: faHome,
  },
  {
    mainText: "5,000+",
    subText: "Satisfied Fantasy Players",
    icon: faHeart,
  },
  {
    mainText: "15,000+",
    subText: "Positive Reviews",
    icon: faStar,
  },
  // {
  //   mainText: "50,000+",
  //   subText: "App Downloads",
  //   icon: faDownload,
  // },
];

const features = [
  // {
  //   mainText: "Live Scoring Updates",
  //   subText:
  //     "Stay updated with real-time scoring and player performance tracking during every match.",
  //   icon: faClock,
  // },
  {
    mainText: "Custom Draft System",
    subText:
      "Create your fantasy team with a unique snake draft, ensuring no two users pick the same player.",
    icon: faCloudBolt,
  },
  {
    mainText: "User-Friendly Design",
    subText:
      "Designed with simplicity in mind, our app ensures an easy and intuitive experience for all users.",
    icon: faKey,
  },
  {
    mainText: "Clean Interface",
    subText:
      "Navigate effortlessly with an intuitive interface designed for smooth user experience.",
    icon: faCode,
  },
  // {
  //   mainText: "Player Stats at a Glance",
  //   subText:
  //     "Access player profiles with historical performance stats to make informed selections.",
  //   icon: faEye,
  // },
  {
    mainText: "Exciting Contests",
    subText:
      "Join contests with friends or compete with global users in unlimited fantasy cricket contests.",
    icon: faCamera,
  },
];

const testimonials = [
  {
    stars: 5,
    review:
      "This fantasy app is the best I’ve ever used! It’s intuitive, the drafts are fun, and the stats are so detailed!",
    name: "Alice Johnson",
  },
  {
    stars: 4,
    review:
      "Great app for cricket lovers! Drafting players has never been this exciting.",
    name: "Bob Smith",
  },
  {
    stars: 4,
    review:
      "I love how easy it is to use, and the live scoring updates are a big plus!",
    name: "Carol Williams",
  },
];

const FAQs = [
  {
    question: "What's different about this fantasy app?",
    answer: `Regular fantasy cricket apps have an outdated scoring system, especially for T20s. It lacks the context of the match and gives undue weightage to the absolute runs scored by a batter or wickets taken by a bowler. It is a restrictive fantasy playing style where most users end up vying for the same group of players. T20 cricket is more nuanced than that, a team has different roles for different players and we believe fantasy cricket needs to take the next step to address those performances and give them appropriate weightage. 

Most users tend to pick batters who bat in the top four positions for their side, while this makes sense because they end up facing the bulk of the deliveries and therefore have a chance to score more runs, the role of the finisher is highly downplayed in fantasy cricket although it is one of the most sought after roles by the team management in an auction/selection meeting. 

Similarly, most users tend to pick bowlers who bowl at the death because they offer good value to pick up 'cheap wickets', whereas it could be a spell of 0-15 in 4 overs in the middle-overs which made those wickets possible in the first place. 
Most cricket fantasy apps undermine the match context in which those performances came, for example, the value of a dot ball and low economy rate should be higher in a high-scoring match whereas the same should hold true for a high strike rate innings in a low-scoring match. 

A performance of 50 off 40 balls by an opening batter is generally considered a very good outing in fantasy cricket but in a high-scoring T20 match with team totals above 200, that could be a match losing innings. We, at Cric Maestro, aim to balance these performances and give you the true worth of a player's performance. 

If you think a particular player is a match-winner but doesn't get enough credit, chances are you will see him do very well in our points scoring system. We want to respect the cricketing intelligence of our audience and give them options that make them think which in turn makes this a more wholesome experience. `,
  },
  {
    question: "Why is a draft system better than the regular fantasy one?",
    answer: `Over the course of playing many fantasy tournaments, we realised that there is a tremendous amount of homogeneity in every user's team and that takes the joy away from playing. 

    No body wants to be part of a contest where seven of the eight users have captained Virat Kohli while having six-seven same players. 

Much like the real world, once you draft a player into your team here, that player is 'yours'. You are likely to be way more invested in that player's performance and we have found that it makes for a great experience while watching the tournament. There's absolutely no confilct of interest here.`,
  },
  {
    question: "What is a snake draft?",
    answer: `A snake draft is a format commonly used in fantasy sports contests. In this type of draft, the pick order reverses after each round.

Here’s how it works:

In the first round, teams or participants select players in a set order (e.g., User 1 picks first, followed by User 2, User 3, and so on).
In the second round, the order is reversed. So, the team that picked last in the first round will pick first in the second round (e.g., User 3 picks first, then User 2, and finally User 1).
This alternating pattern continues for all rounds.

The advantage of a snake draft is that it balances the advantage of having the first pick, as the teams picking later in the first round get to pick earlier in the following round. It helps to level the playing field, ensuring no single participant gets an unfair advantage by consistently picking first in every round.`,
  },
  {
    question: "So I only pick my team once for the entire tournament?",
    answer: `That's right, once you pick your team of 15 players, you are all set for the tournament and only the top 11 point-scoring players from your team will end up contributing to your team's score. 

This aims to nullify any unforeseen injuries/drop of form for a player in your team. It is also a busy world and we are sure you have better things to do than to fret about setting your team before a deadline on every matchday. Pick, chill and don't repeat.`,
  },
  {
    question: "What is your 'superior scoring system?'",
    jsx: (
      <>
        <a
          className="link"
          href="https://cric-maestro.netlify.app/"
          target="_blank"
        >
          This link
        </a>{" "}
        will explain our scoring system in greater detail.
      </>
    ),
  },
  {
    question: "How long is a draft supposed to last?",
    answer: `As with most other things, it is completely dependent on you and the group that you are playing with. Each user will get a 2-minute time window to make a pick, if you are certain about your choices, you can rush through the draft process but we realise that this gets trickier once the top options are exhausted. 

To be on the conservative side, we think 60-90 minutes is enough to finish the entire draft process. `,
  },
];

export { generalCopy, features, details, testimonials, FAQs };
