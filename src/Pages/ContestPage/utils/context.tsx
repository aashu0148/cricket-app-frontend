import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  PropsWithChildren,
} from "react";

import useFetchContest from "./useFetchContest";
import {
  CompletedMatch,
  Contest,
  PlayerPoints,
  Tournament,
} from "@/utils/definitions";
import { CONTEST_PAGE_TABS } from "./constants";

interface Props extends PropsWithChildren {
  tournamentId: string;
  contestId: string;
}

interface ContextValue {
  isFetchingContest: boolean;
  contestDetails: Contest;
  setContestDetails: Dispatch<SetStateAction<any>>;
  tournamentDetails: Tournament;
  playerPoints: PlayerPoints[];
  completedTournamentMatches: CompletedMatch[];
  refetchContest: () => void;

  isDraftRoundCompleted: boolean;
  isDraftRoundStarted: boolean;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<CONTEST_PAGE_TABS>>;
  showShareModal: boolean;
  setShowShareModal: Dispatch<SetStateAction<boolean>>;
}

const ContestPageContext = createContext<ContextValue>({} as ContextValue);

export const ContestProvider = ({
  children,
  tournamentId,
  contestId,
}: Props) => {
  const {
    isFetching: isFetchingContest,
    contestDetails,
    setContestDetails,
    tournamentDetails,
    playerPoints,
    completedTournamentMatches,
    refetchContest,
  } = useFetchContest({
    tournamentId,
    contestId,
  });

  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState(CONTEST_PAGE_TABS.PARTICIPANTS);

  const isDraftRoundCompleted = !!contestDetails?.draftRound?.completed;
  const isDraftRoundStarted =
    new Date() > new Date(contestDetails?.draftRound?.startDate || "");

  return (
    <ContestPageContext.Provider
      value={{
        setContestDetails,
        refetchContest,
        setActiveTab,
        setShowShareModal,

        showShareModal,
        isDraftRoundCompleted,
        isDraftRoundStarted,
        activeTab,
        isFetchingContest,
        completedTournamentMatches,
        contestDetails: contestDetails || ({} as Contest),
        tournamentDetails: tournamentDetails as Tournament,
        playerPoints,
      }}
    >
      {children}
    </ContestPageContext.Provider>
  );
};

export const useContest = () => {
  const context = useContext<ContextValue>(ContestPageContext);

  if (!context) {
    throw new Error("useContest must be used within a ContestProvider");
  }
  return context;
};
