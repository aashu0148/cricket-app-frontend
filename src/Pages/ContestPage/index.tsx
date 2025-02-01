import { useParams } from "react-router-dom";

import ContestPageMain from "./ContestPageMain";
import { ContestProvider } from "./utils/context";

export default function ContestPage() {
  const params = useParams();
  const { tournamentId, contestId } = params;

  return (
    <ContestProvider
      tournamentId={tournamentId + ""}
      contestId={contestId + ""}
    >
      <ContestPageMain />
    </ContestProvider>
  );
}
