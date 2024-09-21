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
    heading: "Draft Smart, Play Hard, Win Big!",
    description:
      "Our app revolutionizes fantasy cricket with a unique snake draft system, ensuring each player is exclusive to a team. Compete with up to 10 teams in your league, with your best XI delivering the points. From IPL to major international tournaments, our app is designed to give you a competitive edge while offering detailed player stats, dynamic draft features, and an unmatched gaming experience.",
  },
  features: {
    shoulder:
      "Unleash the power of a competitive fantasy cricket league. Built for serious players.",
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
    subText: "Active Leagues",
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
    mainText: "Live Scoring Updates",
    subText:
      "Stay updated with real-time scoring and player performance tracking during every match.",
    icon: faClock,
  },
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
  {
    mainText: "Player Stats at a Glance",
    subText:
      "Access player profiles with historical performance stats to make informed selections.",
    icon: faEye,
  },
  {
    mainText: "Exciting Contests",
    subText:
      "Join leagues with friends or compete with global users in unlimited fantasy cricket contests.",
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
    question: "What is Fantasy Cricket?",
    answer:
      "Fantasy Cricket allows users to create virtual teams based on real-life players. Points are scored based on the player's performance in real matches.",
  },
  {
    question: "How do I join a league?",
    answer:
      "You can join a league by signing up, selecting a tournament, and entering the draft with other users.",
  },
  {
    question: "How are points calculated?",
    answer:
      "Points are awarded based on a player's actual performance in matches—runs, wickets, catches, and more.",
  },
];

export { generalCopy, features, details, testimonials, FAQs };
