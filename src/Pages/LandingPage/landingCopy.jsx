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
import { applicationRoutes } from "@/utils/constants";

const scoringSystemLink = applicationRoutes.viewScoringSystem("t20");

const generalCopy = {
  about: {
    shoulder: "",
    heading: "Tailored for true fans of the game",
    description:
      "Our app revolutionizes fantasy cricket with a unique draft system. The snake draft system ensures each player is exclusive to a team. Compete with up to 6 teams in your contest, with a squad of 15 players, with your best XI delivering the points. Our app scoring system has been designed to revamp the age-old fantasy scoring system to provide a new, improved fantasy scoring system.",
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
  {
    mainText: "Redefining Fantasy Scoring",
    subText:
      "Our advanced scoring system rewards real game impact like never before. Experience fair, skill-based scoring that brings you closer to the game.",
    icon: faKey,
  },
  {
    mainText: "Draft System",
    subText:
      "Create your fantasy team with a unique snake draft, ensuring no two users pick the same player.",
    icon: faCloudBolt,
  },
  {
    mainText: "Season-Long Fantasy Challenge",
    subText:
      "One team for the entire tournament—no daily changes needed. Plan for the long haul, and play strategically.",
    icon: faClock,
  },
  {
    mainText: "Detailed Analysis",
    subText:
      "Gain deep insights into every player's game with our comprehensive point-by-point analysis to understand exactly how each score was earned. ",
    icon: faEye,
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
    answer: `Most fantasy cricket apps use an outdated scoring system that lacks T20 context, focusing mainly on total runs and wickets. This approach restricts player choice, with most users selecting from a small group of players. T20 cricket is more nuanced than that, a team has different roles for different players and we believe fantasy cricket needs to take the next step to address those performances and give them appropriate weightage. We respect our users' cricketing knowledge by offering a system that rewards nuanced performances, making the experience more engaging. `,
  },
  {
    question: "How do you reward different roles?",
    answer: `Our points system recognizes each player's role, giving fair weight to finishers and middle-over bowlers—not just top-order batters or death-over bowlers.

Most users select top-order batters, as they get more deliveries and score more runs. However, the finisher’s role often goes unrecognized in fantasy cricket, despite its high value in real-life games.

Similarly, most users choose death-over bowlers for their ‘easy wickets,’ while middle-overs bowlers who build pressure with economical spells are overlooked. Our system balances these contributions.

A spell of 0-15 in 4 overs finally has a place in fantasy cricket.`,
  },
  {
    question: "What makes your scoring unique in T20s",
    answer: `We factor in match context—like valuing high strike rates in low-scoring games or low economy rates in high totals—to reflect each performance’s impact.

For example, a score of 50 off 40 balls by an opener might seem impressive in regular fantasy, but in a high-scoring T20 with team totals over 200, this could be a match-losing innings. Our system balances these performances to reflect their true impact.`,
  },
  {
    question: "Why is a draft system better than the regular fantasy one?",
    answer: `In most fantasy leagues, team compositions are nearly identical across users. Much like the real world, once you draft a player into your team, that player is 'yours'. This adds excitement, as you become more invested in each player’s performance, enhancing the tournament-watching experience.`,
  },
  {
    question: "So I only pick my team once for the entire tournament?",
    answer: `Yes! Once you pick your team of 15 players, you’re all set for the tournament. Only the top 11 point-scoring players contribute to your team’s score, so unforeseen injuries or form dips won’t ruin your chances.

Plus, you won’t have to worry about setting your lineup before every matchday. Pick, relax, and enjoy the game!
`,
  },
  {
    question: "Can I see the actual scoring system?",
    jsx: (
      <>
        You can view our scoring system details{" "}
        <a className="link" href={scoringSystemLink} target="_blank">
          here
        </a>{" "}
      </>
    ),
  },
  {
    question: "How long does a draft take?",
    answer: `This is completely dependent on you and the group that you are playing with. Each user has a 2-minute window per pick. If your choices are clear, you can move quickly, though the process may slow down as top players are chosen. Generally, we estimate 30-60 minutes for a full draft.`,
  },
  {
    question: "What happens if I miss my draft time?",
    answer: `If you miss the draft or are unable to join at the start, the app will auto-pick players based on your wishlist in the pre-draft page. `,
  },
  {
    question: "Can I play for free, or are there entry fees?",
    answer: `All contests are completely free to join. Our goal is to make this exciting new way of playing fantasy cricket accessible to as many fans as possible.`,
  },
  {
    question: "How do I start a contest with friends?",
    answer: `To start a contest, simply create a new contest on the app and invite friends to join. You have to set a particular date and time for the draft. `,
  },
  {
    question: "How are points updated?",
    answer: `Our app updates points at the end of every match. `,
  },
  {
    question: "What if a match is shortened due to weather?",
    answer: `No points will be awarded if there's no result in the match or if it is abandoned.`,
  },
  {
    question: "Can I trade players with other teams?",
    answer: `Currently, once a player is drafted, they remain with that team for the tournament. This exclusivity increases the strategic challenge and engagement in the draft format.`,
  },
  {
    question: "Is there a limit on the number of participants in a contest?",
    answer: `A maximum of six teams cane take part in the draft to ensure there are enough quality players available for everyone to achieve a balanced team.`,
  },
  {
    question: "Can I join multiple contests at the same time?",
    answer: `Yes, you can join multiple leagues and draft separate teams in each. Each league’s draft is independent, so your team in one league won’t affect others.`,
  },
  {
    question: "Is there any cap on the player roles within a team?",
    answer: `You can be as varied as you please in your team selection. There's nothing stopping you from having a team full of bowlers or batters. `,
  },
  {
    question: "What if a match goes into a Super Over?",
    answer: `In the event of a Super Over, points are not awarded as per typical play. However, your players’ points from the regular match play are fully counted.`,
  },
];

export {
  generalCopy,
  features,
  details,
  testimonials,
  FAQs,
  scoringSystemLink,
};
